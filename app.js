import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoutes from './routes/AuthRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import otpRoutes from './routes/OtpRoutes.js'
import errorHandler from './middleware/ErrorMiddleware.js';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthMiddleware from './middleware/AuthMiddleware.js';
import batchRoutes from "./main/routes/BatchRoutes.js"
import courseRoutes from "./main/routes/CourseRoutes.js"
import classRoutes from "./routes/ClassRoutes.js"
import testRoutes from "./test/testRouter.js"
// import mainRoutes from './main/mainRoutes.js'
import testSeriesRoutes from './main/routes/testSeriesRoutes.js'
import setTable from './middleware/setTableMIddleware.js';
import enrollmentroutes from './routes/EnrollmentRoutes.js';
import swaggerSpec from './config/swagger.js';
import paymentRoutes from './razorpay/routes.js';

const app = express();

app.use(cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173", "https://lmssystem01.vercel.app/", "https://www.teachertech.in"], 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.options("*", cors());


app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/user', AuthMiddleware.auth, userRoutes);
app.use('/api/otp/', otpRoutes)
app.use('/api/batch/', batchRoutes)
app.use('/api/course/', courseRoutes)
app.use('/api/class/', classRoutes)
app.use('/api/test/', testRoutes)
app.use('/api/test-series', testSeriesRoutes)
app.use('/api/enrollment', AuthMiddleware.auth, enrollmentroutes)
app.use('/api/payment/', paymentRoutes)
// app.use('/api/', mainRoutes)
app.use('/', (req, res) =>{
  return res.json({message: "this is the home of teachertech test api"})
})

app.use(errorHandler);

app.listen(5000, () => console.log('Server running on port 5000'));
