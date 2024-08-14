const mongoose = require('mongoose');

// Kiểm tra xem mô hình đã tồn tại chưa, nếu có thì sử dụng nó
const Resource = mongoose.models.Resource || mongoose.model('Resource', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    identityCard: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contract: {
        type: String,
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
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
}));

module.exports = Resource;
