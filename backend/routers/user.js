import { Router } from "express";
import User from '../models/users.model.js'
import passport from "../config/passport.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "calistasalsa.cpw@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD
    }
})

router.get('/', async (req, res) => {
    try{
        const users = await User.find({}, 'username email isAdmin');
        res.status(200).json(users);
    } catch (err){
        res.status(500).json({message: "An error occured while fetching users."})
    }
});

router.post("/signup", async (req, res)=> {
    
    try {   
        const {email, username, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({message: "Email already exists"});
        }

        const user = await User.create({
            username,
            email,
            password,
        })

        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: '"EZtudy" <calistasalsa.cpw@gmail.com>',
            to: user.email,
            subject: "Verify your email for EZtudy Platform",
            html: `
                <p>Hello, ${user.username}</p>
                <p>Thank you for registering on EZtudy Learning Platform. Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>This link will expire in 24 hours.</p>
            `
        })

        res.status(201).json({message: "User created successfully, please check your email to verify your account."});
    } catch (error) {
        console.error("SIGNUP FAILED:", error); 
        res.status(400).send({ error: "User registration failed" });
    }
})

router.get("/verify-email", async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: "Verification token not provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true;
        await user.save();
        res.redirect("http://localhost:5173/auth/login?verified=true");
    } catch (err){
        res.status(400).json({ message: "Invalid or expired verification token" });
    }
});

router.post("/login", passport.authenticate("local", {
    session: false
}), (req, res) => { 
    try {    
        let token = null;
        let user = null;

        if(req.user) {
            if (!req.user.isVerified){
                return res.status(401).json({message: "Please verify your email before logging in."});
            }
            
            const _id = req.user._id;
            const payload = {_id};
            token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

            // Prepare user object for the response (without the password)
            user = {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                isAdmin: req.user.isAdmin,
                registerType: req.user.registerType,
                isVerified: req.user.isVerified
            };
        }
        res.cookie("token", token)
        res.json({message: 'login success!', user: user})
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post("/logout", (req, res, next)=> {
    try {
    // The only task is to clear the cookie containing the JWT
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
})

router.get("/login/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/login/google/callback",
    passport.authenticate("google", {session: false}),
    (req, res) => {
        let token = null;
        if(req.user) {
            const _id = req.user._id;
            const payload = {_id};
            token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
            res.cookie("token", token)
            res.redirect("http://localhost:5173/")
        } else {
            res.redirect("http://localhost:5173/auth/login?error=google-auth-failed");
        }
    }
)

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided or token is invalid" });
    }
    // Return user data (without the hashed password)
    const { username, email, _id, isAdmin, registerType, isVerified } = req.user;
    res.json({ username, email, _id, isAdmin, registerType, isVerified });
});

export default router;