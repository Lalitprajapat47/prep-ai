const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description retrieve interview report by ID
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewByidController)


/**
 * @route GET /api/interview/
 * @description retrieve all interview reports of the user
 * @access private
 */

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewsReportsController)

/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter