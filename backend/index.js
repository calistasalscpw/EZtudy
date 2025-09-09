import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/eztudy';
mongoose.connect(mongoUrl, {dbName: 'eztudy'})
    .then(()=> {
        console.log('database connected')
        app.listen(5000, ()=> {
            console.log('Server is running on port 5000')
        })
    })
    .catch((err) => {
        console.log('Database connection error:', err.message);
    })