const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes')
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors')
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
app.use('/api/user', userRoutes);
app.use('/api/otp/', otpRoutes)

app.use(errorHandler);

app.listen(5000, () => console.log('Server running on port 5000'));
