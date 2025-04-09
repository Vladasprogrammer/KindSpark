import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import adminRoutes from './routes/admin.js';


const PORT = 3333;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stories', storiesRoutes);



app.listen(PORT, _ => console.log(`Server running on port ${PORT}`));
