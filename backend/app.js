import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRouter from './routers/user.js';
import courseRouter from './routers/course.js';
import materialRouter from './routers/material.js';
import progressRouter from './routers/progress.js';

const app = express(); 

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// Authentication middleware
app.use((req, res, next) => {
    if(!req.cookies['token']) {
        return next();
    }
    passport.authenticate(
        "jwt",
        {session: false}
    )(req, res, next)
});

app.use('/auth', userRouter); 
app.use('/courses', courseRouter);
app.use('/materials', materialRouter);
app.use('/progress', progressRouter);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'EZtudy Backend API is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/auth/*',
            course: '/courses/*',
            material: '/materials/*',
            progress: '/progress/*'
        }
    });
});


// 404 handler 
app.use('/*splat', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
        availableEndpoints: ['/auth', '/courses', '/materials', '/progress']
    });
});

export default app;