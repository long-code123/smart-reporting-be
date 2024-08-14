const mongoose = require('mongoose');
const Project = require('../models/project.model');
const connectDB = require('../configs/db.config');
const Resource = require('../models/resource.model');


// Kết nối cơ sở dữ liệu
const initDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

// Create: Tạo mới một project
const createProject = async (req, res) => {
    try {
        await initDB();
        
        // Tạo mới Project
        const project = new Project(req.body);
        await project.save();

        // Cập nhật các Resource với Project ID mới
        if (req.body.members && req.body.members.length > 0) {
            await Resource.updateMany(
                { _id: { $in: req.body.members } }, // Điều kiện lọc các members
                { $addToSet: { projects: project._id } } // Thêm Project ID vào mảng projects của Resource
            );
        }

        res.status(201).send(project);
    } catch (err) {
        console.error(err);
        res.status(400).send('Bad Request');
    }
};


// Read: Lấy danh sách tất cả project
const getProjects = async (req, res) => {
    try {
        await initDB();
        const projects = await Project.find();
        res.status(200).send(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Read: Lấy project theo ID
const getProjectById = async (req, res) => {
    try {
        await initDB();
        // Lấy dự án theo ID và populate members
        const project = await Project.findById(req.params.id).populate('members');
        
        // Kiểm tra xem dự án có tồn tại không
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Trả về dự án đã được populate
        res.status(200).send(project);
    } catch (err) {
        console.error('Error fetching project by ID:', err.message);
        res.status(500).send('Internal Server Error');
    }
};



// Update: Cập nhật project theo ID
const updateProject = async (req, res) => {
    try {
        await initDB();
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('members');
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).send(project);
    } catch (err) {
        console.error(err);
        res.status(400).send('Bad Request');
    }
};


// Delete: Xóa project theo ID
const deleteProject = async (req, res) => {
    try {
        await initDB();
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.status(200).send('Project deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
