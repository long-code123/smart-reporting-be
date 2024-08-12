const mongoose = require('mongoose');
const connectDB = require('../configs/db.config');
const Resource = require('../models/resource.model');

// Kết nối cơ sở dữ liệu
const initDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

// Create: Tạo mới một resource
const createResource = async (req, res) => {
    try {
        await initDB();
        const resource = new Resource(req.body);
        await resource.save();
        console.log('Resource created successfully:', resource);
        res.status(201).send(resource);
    } catch (err) {
        console.error('Error creating resource:', err);
        res.status(400).send('Bad Request');
    }
};

// Read: Lấy danh sách tất cả resource
const getResources = async (req, res) => {
    try {
        await initDB();
        const resources = await Resource.find();
        console.log('Fetched all resources:', resources);
        res.status(200).send(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Read: Lấy resource theo ID
const getResourceById = async (req, res) => {
    try {
        await initDB();
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            console.log('Resource not found for ID:', req.params.id);
            return res.status(404).send('Resource not found');
        }
        console.log('Fetched resource by ID:', resource);
        res.status(200).send(resource);
    } catch (err) {
        console.error('Error fetching resource by ID:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Update: Cập nhật resource theo ID
const updateResource = async (req, res) => {
    try {
        await initDB();
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!resource) {
            console.log('Resource not found for update with ID:', req.params.id);
            return res.status(404).send('Resource not found');
        }
        console.log('Resource updated successfully:', resource);
        res.status(200).send(resource);
    } catch (err) {
        console.error('Error updating resource:', err);
        res.status(400).send('Bad Request');
    }
};

// Delete: Xóa resource theo ID
const deleteResource = async (req, res) => {
    try {
        await initDB();
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            console.log('Resource not found for delete with ID:', req.params.id);
            return res.status(404).send('Resource not found');
        }
        console.log('Resource deleted successfully:', resource);
        res.status(200).send('Resource deleted successfully');
    } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource
};
