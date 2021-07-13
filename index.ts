import express from 'express';
import https from 'https';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import { apiRouter } from './src/routes/api';
import { authRouter } from './src/routes/auth';
import { serviceMiddleware } from './src/middleware/service';
import { ADMIN_ROUTE, ERROR } from './src/constants';
import { adminRouter } from './src/routes/admin';

dotenv.config();

const app = express();

mongoose.connection.on('open', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[+] database ready');
  }
});
mongoose.connection.on('error', error => console.log(`[-] database error - ${error.message}`));
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(serviceMiddleware);

app.use('/api', apiRouter);
app.use(ADMIN_ROUTE, adminRouter);
app.use('/auth', authRouter);

app.use((_, res) => {
  res.status(404).send('Not found');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT, () => {
    console.log(`[+] ${process.env.NODE_ENV} server ready and waiting on port ${process.env.PORT}`);
  });
} else {
  const options = {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
  };

  https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`[+] ${process.env.NODE_ENV} server ready and waiting on port ${process.env.PORT}`);
  });
}