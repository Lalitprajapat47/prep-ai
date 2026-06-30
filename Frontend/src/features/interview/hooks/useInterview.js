import { getAllInterviewReports, generateResumePdf, generateInterviewReport, getInterviewReportById } from "../../auth/services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import toast from "react-hot-toast"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        const loadingToast = toast.loading('Generating your interview strategy...')

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            setReport(response.interviewReport)
            toast.success('Interview plan generated successfully!', { id: loadingToast })

            return response.interviewReport

        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to generate plan. Please try again."
            toast.error(msg, { id: loadingToast })
            return null
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        const loadingToast = toast.loading('Preparing your resume PDF...')
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(response)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            toast.success('Resume downloaded!', { id: loadingToast })
        }
        catch (error) {
            toast.error('Failed to generate resume PDF', { id: loadingToast })
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            toast.error('Failed to load report')
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            // silent fail — empty state handles this in UI
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, getResumePdf, generateReport, getReportById, getReports }

}