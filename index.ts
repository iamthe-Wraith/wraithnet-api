import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import { apiRouter } from './src/routes/api';
import { authRouter } from './src/routes/auth';
import { serviceMiddleware } from './src/middleware/service';
import { ADMIN_ROUTE, API_ROUTE, AUTH_ROUTE, STATUS_ROUTE } from './src/constants';
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

app.use(STATUS_ROUTE, (_, res) => res.status(200).send());

app.use(serviceMiddleware);

app.use(API_ROUTE, apiRouter);
app.use(ADMIN_ROUTE, adminRouter);
app.use(AUTH_ROUTE, authRouter);

app.use((_, res) => res.status(404).send('Not found'));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`[+] ${process.env.NODE_ENV} server ready and waiting on port ${port}`);
});