const notFound = (req,res,next) => {
    const error = new Error(`Route not ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err,req,res,next) => {
    let statusCode = res.statusCode
    
    if(!statusCode || statusCode === 200) {
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Interval server error",
        stack: process.env.MODE_ENV === "production" ? undefined : err.stack
    })
}

module.exports = { notFound, errorHandler }