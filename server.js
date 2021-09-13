const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileUpload');
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/error');
const path = require('path');
const advancedResults = require('./middlewares/advancedResults');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });
//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//connect to db
connectDB();
const app = express();

//body parser
app.use(express.json());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
//file upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
//mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);
app.use(errorHandler);
app.use(cors);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//handle exceptions
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    server.close(() => process.exit(1));
})
