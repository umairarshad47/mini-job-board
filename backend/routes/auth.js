const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateRequest = require("../middleware/validateRequest");
const { registerSchema, loginSchema } = require("../validators/authValidators");
const authenticateJWT = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

// register endpoint
router.post("/register", validateRequest(registerSchema), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        } else if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ status: 200, message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// login endpoint
router.post("/login", validateRequest(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });


        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        res.json({ message: "Login Successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// verify token endpoint with middleware, it will use in the frontend side for protected route
router.get("/verify-token", authenticateJWT, (req, res) => {
    res.status(200).json({ status: 200, message: 'Token is valid' });
});

// logout endpoint
router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ status: 200, message: "Logout Successfully" });
})

module.exports = router;