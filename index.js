import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from "express-rate-limit"
dotenv.config();

const app = express();
const PORT = process.env.PORT;
// loggin middleware 

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    limit : 100,
    message : "Too many requests from this IP, Please try later"
})

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// body parser middlewares

app.use(express.json({limit : '10kb'}));
app.use(express.urlencoded({ extended : true, limit : "10kb" }));

// Global level handler

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({

        status : "error",
        message : err.message || "Internal server error",
        ...PORT(process.env.NODE_ENV === "development" && {stack : err.stack}),
    });
});


app.use(( err, req, res) => {
    res.status(400).json ({
    status : "error",
    message : "Route not found",
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT} in ${process.env.NODE_ENV}`);
}); 

