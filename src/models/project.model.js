const mongoose = require('mongoose');

// Kiểm tra xem mô hình đã tồn tại chưa, nếu có thì sử dụng nó
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'on hold'],
        required: true,
    },
    leader: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
    }],
    cost: {
        type: Number,
        required: true,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
}));

module.exports = Project;
