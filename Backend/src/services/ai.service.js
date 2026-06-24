const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string(),
})

const FALLBACK_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.5-flash",
]

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms))
}

function buildPrompt(resume, selfDescription, jobDescription) {
    return `You are an expert technical interviewer. Analyze the candidate's resume, self description, and job description, then generate a structured interview report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no extra text.
The JSON must follow this EXACT structure:

{
  "title": "<job title from job description>",
  "matchScore": <number 0-100 indicating how well candidate matches the job>,
  "technicalQuestions": [
    {
      "question": "<technical question to ask in interview>",
      "intention": "<why interviewer would ask this>",
      "answer": "<how candidate should answer, what points to cover>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question to ask in interview>",
      "intention": "<why interviewer would ask this>",
      "answer": "<how candidate should answer, what points to cover>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill the candidate is lacking>",
      "severity": "<low|medium|high>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<main topic to focus on this day>",
      "tasks": ["<task 1>", "<task 2>"]
    }
  ]
}

Rules:
- matchScore must be a number between 0 and 100
- technicalQuestions must have exactly 10 items
- behavioralQuestions must have exactly 10 items
- skillGaps must have 3 to 7 items
- preparationPlan must have 7 days
- severity must be exactly one of: low, medium, high
- Return ONLY the JSON object, nothing else`
}

async function callGemini(model, resume, selfDescription, jobDescription) {
    const prompt = buildPrompt(resume, selfDescription, jobDescription)

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",  // hint only, no responseSchema
        }
    })

    const raw = response.text
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim()

    let parsed
    try {
        parsed = JSON.parse(clean)
    } catch (e) {
        console.error("JSON parse failed. Raw was:", raw)
        throw new Error("Gemini returned invalid JSON")
    }

    const result = interviewReportSchema.safeParse(parsed)
    if (!result.success) {
        console.error("Validation Error:\n", result.error)
        console.error("Parsed object:", JSON.stringify(parsed, null, 2))
        throw new Error("Gemini returned invalid interview report structure")
    }

    return result.data
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    for (const model of FALLBACK_MODELS) {
        console.log(`Trying model: ${model}`)

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const data = await callGemini(model, resume, selfDescription, jobDescription)
                console.log(`Success with model: ${model}`)
                return data

            } catch (err) {
                const status = err?.status ?? 0
                const msg = err?.message ?? ""

                const isRateLimited = status === 429 || msg.includes("RESOURCE_EXHAUSTED")
                const isOverloaded  = status === 503 || msg.includes("UNAVAILABLE")
                const isNotFound    = status === 404 || msg.includes("NOT_FOUND")

                if (isNotFound) {
                    console.warn(`[${model}] Model not found, skipping...`)
                    break
                }

                if (isRateLimited) {
                    if (attempt < MAX_RETRIES) {
                        const delay = RETRY_DELAY_MS * attempt * 2
                        console.warn(`[${model}] Rate limited — retry ${attempt}/${MAX_RETRIES} in ${delay}ms`)
                        await sleep(delay)
                        continue
                    }
                    console.warn(`[${model}] Quota exhausted, switching model...`)
                    break
                }

                if (isOverloaded) {
                    if (attempt < MAX_RETRIES) {
                        const delay = RETRY_DELAY_MS * attempt
                        console.warn(`[${model}] Overloaded — retry ${attempt}/${MAX_RETRIES} in ${delay}ms`)
                        await sleep(delay)
                        continue
                    }
                    break
                }

                // Validation/JSON error — retry once, then move to next model
                if (attempt < MAX_RETRIES) {
                    console.warn(`[${model}] Bad response — retry ${attempt}/${MAX_RETRIES}`)
                    await sleep(RETRY_DELAY_MS)
                    continue
                }

                console.error(`[${model}] All retries failed:`, msg)
                break
            }
        }
    }

    throw new Error("All models failed. Please try again later.")
}

module.exports = generateInterviewReport