const express = require('express');
const dotenv  = require('dotenv');
const bootcamps = require('./routes/bootcamp');
const courses = require('./routes/courses');
const users = require("./routes/user");
const auth = require('./routes/auth');
const reviews = require("./routes/reviews");
const cookieparser = require('cookie-parser');
const logger = require('./middleware/logger');
const connectDb = require('./config/db');
const errorHandler  = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const cors = require('cors');

const mongoSanitize = require('express-mongo-sanitize')
//Include the environment variables
dotenv.config({
    path:'./config/config.env'
});
//Connect to database
connectDb();

const app = express();


//Middleware to use req.body //Similar as body parser
app.use(express.json());


app.use(logger);

//Sanitize data




app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));
//Middleware for cookie
app.use(cookieparser());

app.use(mongoSanitize());
//Middlewer to use file upload

//Set security headers
app.use(helmet());

//Prevent cross site scripting
app.use(xss());
//Rate limiting

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(hpp());

//Enable cors
app.use(cors());
//Router files
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use("/api/v1/auth/admin", users);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler);



//My own middle ware to console log the request made by  the client
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running of port ${PORT} in ${process.env.NODE_ENV} mode`))

process.on('unhandledRejection',(err,promise) => {
    console.log(`Error:${err}`);
})
