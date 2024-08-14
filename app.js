const express = require("express");
const cors = require("cors");  // Thêm dòng này
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Sử dụng cors
app.use(cors({
    origin: 'http://localhost:5173', // Cho phép truy cập từ nguồn này
    credentials: true, // Cho phép gửi cookie và các thông tin xác thực khác
}));

const resourceRoutes = require('./src/routes/resource.route');
const projectRoutes = require('./src/routes/project.route');

// Middleware để log thời gian
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

app.use('/resources', resourceRoutes);
app.use('/projects', projectRoutes);

app.listen(8000, () => {
    console.log("Server run at port 8000");
});
