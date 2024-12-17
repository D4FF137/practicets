import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import router from './routes/index';
import { PORT } from './config/env';
import { DB } from './config/env';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger'; // Импортируйте конфигурацию Swagger

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// Подключите Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

app.listen(PORT, (err?: Error) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`The server started on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  }
});