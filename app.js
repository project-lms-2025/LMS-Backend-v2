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
import batchRoutes from "./routes/BatchRoutes.js"
import courseRoutes from "./routes/CourseRoutes.js"
import classRoutes from "./routes/ClassRoutes.js"


const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"], 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.options("*", cors());


app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/user', AuthMiddleware.auth, userRoutes);
app.use('/api/otp/', otpRoutes)
app.use('/api/batch/', batchRoutes)
app.use('/api/course/', courseRoutes)
app.use('/api/class/', classRoutes)

app.use(errorHandler);

app.listen(5000, () => console.log('Server running on port 5000'));
