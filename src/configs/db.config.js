const mongoose = require('mongoose');

const uri = 'mongodb+srv://nguyenbalong250902:nguyenbalong@long.jcpqjcd.mongodb.net/smart-reporting';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
