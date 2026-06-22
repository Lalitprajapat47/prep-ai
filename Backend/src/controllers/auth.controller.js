const userModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tokenblacklistModel = require('../model/blacklist.model')


/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the requirments
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide email, username or password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        email,
        username,
        password: hash
    })

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User register successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })

}

/**
 * @name loginUserController
 * @description login a user , exppects username and passwordin the requirments
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description logout a user , using blacklisting
 * @access Public
 */

async function logoutUserController(req, res){

    const token = req.cookies.token
    if(token){
        await tokenblacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"User logout successfully"
    })
}


/**
 * @name getMeController
 * @description all logged user data fetch from database
 * @access Public
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User data fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}