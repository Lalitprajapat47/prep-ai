const { Router }  = require('express')
const authController = require('../controllers/auth.controller')
const authRouter = Router()

/**
 * @route POST /auth/api/register
 * @description Register User
 * @access Public
 */

authRouter.post('/register',authController.registerUserController)

/**
 * @route POST /auth/api/login
 * @description Login User
 * @access Public
 */

authRouter.post('/login',authController.loginUserController)

/**
 * @route GET /auth/api/logout
 * @description LogOut User
 * @access Public
 */

authRouter.get('/logout',authController.logoutUserController)

module.exports = authRouter