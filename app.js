const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

const resourceRoutes = require('./src/routes/resource.route');

// Middleware để log thời gian
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

app.use('/resources', resourceRoutes);

app.listen(8000, () => {
    console.log("Server run at port 8000");
});
