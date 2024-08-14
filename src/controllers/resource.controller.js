const mongoose = require('mongoose');
const connectDB = require('../configs/db.config');
const Resource = require('../models/resource.model');
const Project = require('../models/project.model');

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

        // Tạo mới Resource
        const resource = new Resource(req.body);
        await resource.save();

        // Cập nhật các Project với Resource ID mới
        if (req.body.projects && req.body.projects.length > 0) {
            await Project.updateMany(
                { _id: { $in: req.body.projects } }, // Điều kiện lọc các projects
                { $addToSet: { members: resource._id } } // Thêm Resource ID vào mảng members của Project
            );
        }

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
        // Lấy tài nguyên theo ID và populate projects
        const resource = await Resource.findById(req.params.id).populate('projects');
        
        // Kiểm tra xem tài nguyên có tồn tại không
        if (!resource) {
            console.log('Resource not found for ID:', req.params.id);
            return res.status(404).send('Resource not found');
        }

        // Trả về tài nguyên đã được populate
        console.log('Fetched resource by ID:', resource);
        res.status(200).send(resource);
    } catch (err) {
        console.error('Error fetching resource by ID:', err.message);
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
