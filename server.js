const express=require('express');
const colors=require('colors');
const morgan=require('morgan');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const connectDB = require('./config/db');
const path = require('path');


//dotenv config
dotenv.config();


//mongodb connection
connectDB();

// rest object
const app=express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));


// Serve static files from Vite's dist folder
app.use(express.static(path.join(__dirname, './client/dist')));

// Catch-all handler for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});


// routes

app.use('/api/v1/user',require("./routes/userRoutes"));
app.use('/api/v1/admin',require("./routes/adminRoutes"));
app.use('/api/v1/doctor',require("./routes/doctorRoutes"));

//listen port
const port=process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`server running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white);
});
