const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

app.listen(5000, () => console.log('Server running on port 5000'));
