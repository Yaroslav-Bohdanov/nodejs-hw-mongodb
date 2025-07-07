import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const port = Number(getEnvVar('PORT'));

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
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
