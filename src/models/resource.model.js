const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
    name: String,
    dateOfBirth: Date,
    sex: String,
    account: String,
    status: String,
    phoneNumber: String,
    identityCard: String,
    email: String,
    contract: String,
    startDate: Date,
    endDate: Date
});

const Resource = mongoose.model('resource', resourceSchema);

module.exports = Resource;