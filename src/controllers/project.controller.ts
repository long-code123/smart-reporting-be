import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/project.model';
import connectDB from '../configs/db.config';
import Resource from '../models/resource.model';

// Kết nối cơ sở dữ liệu
const initDB = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

// Create: Tạo mới một project
export const createProject = async (req: Request, res: Response): Promise<void> => {
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
export const getProjects = async (req: Request, res: Response): Promise<void> => {
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
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();
        // Lấy dự án theo ID và populate members
        const project = await Project.findById(req.params.id).populate('members');

        // Kiểm tra xem dự án có tồn tại không
        if (!project) {
            res.status(404).send('Project not found');
            return;
        }

        // Trả về dự án đã được populate
        res.status(200).send(project);
    } catch (err) {
        console.error('Error fetching project by ID:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

// Update: Cập nhật project theo ID
export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();

        // Cập nhật Project theo ID
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Kiểm tra xem Project có tồn tại không
        if (!updatedProject) {
            res.status(404).send('Project not found');
            return;
        }

        // Cập nhật Resource với Project ID mới
        if (req.body.members) {
            const existingMembers = updatedProject.members;

            // Cập nhật các Resource với Project ID mới
            await Resource.updateMany(
                { _id: { $in: req.body.members } }, // Điều kiện lọc các members
                { $addToSet: { projects: updatedProject._id } } // Thêm Project ID vào mảng projects của Resource
            );

            // Xóa Project ID khỏi các Resource không còn là thành viên
            await Resource.updateMany(
                { _id: { $in: existingMembers, $nin: req.body.members } }, // Điều kiện lọc các members cũ không còn
                { $pull: { projects: updatedProject._id } } // Xóa Project ID khỏi mảng projects của Resource
            );
        }

        // Populate members và trả về Project đã được cập nhật
        const populatedProject = await Project.findById(updatedProject._id).populate('members');
        res.status(200).json(populatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(400).send('Bad Request');
    }
};

// Delete: Xóa project theo ID
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            res.status(404).send('Project not found');
            return;
        }
        res.status(200).send('Project deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
