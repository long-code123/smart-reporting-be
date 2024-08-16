import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Tải biến môi trường từ file .env
dotenv.config();

// Tạo ứng dụng Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Sử dụng cors với biến môi trường
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Sử dụng biến môi trường, nếu không có thì mặc định là 'http://localhost:5173'
    credentials: true, // Cho phép gửi cookie và các thông tin xác thực khác
}));

// Import các route
import resourceRoutes from './src/routes/resource.route';
import projectRoutes from './src/routes/project.route';

// Middleware để log thời gian
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
});

// Sử dụng các route
app.use('/resources', resourceRoutes);
app.use('/projects', projectRoutes);

// Lấy port từ biến môi trường
const port = process.env.PORT;

// Khởi động server
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
