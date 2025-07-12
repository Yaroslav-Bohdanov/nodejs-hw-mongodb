import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUI from 'swagger-ui-express';
import path from 'node:path';
import fs from 'node:fs';

const port = Number(getEnvVar('PORT'));
const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('/uploads', express.static(UPLOAD_DIR));

  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  } catch {
    app.use('/api-docs', (req, res) =>
      res.status(500).json({ message: "Can't load swagger docs" }),
    );
  }

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
