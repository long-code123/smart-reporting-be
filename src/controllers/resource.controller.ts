import { Request, Response } from 'express';
import mongoose from 'mongoose';
import connectDB from '../configs/db.config';
import Resource from '../models/resource.model';
import Project from '../models/project.model';

// Kết nối cơ sở dữ liệu
const initDB = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

// Create: Tạo mới một resource
export const createResource = async (req: Request, res: Response): Promise<void> => {
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
        res.status(201).json(resource);
    } catch (err) {
        console.error('Error creating resource:', err);
        res.status(400).send('Bad Request');
    }
};

// Read: Lấy danh sách tất cả resource
export const getResources = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();
        const resources = await Resource.find();
        console.log('Fetched all resources:', resources);
        res.status(200).json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Read: Lấy resource theo ID
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();
        // Lấy tài nguyên theo ID và populate projects
        const resource = await Resource.findById(req.params.id).populate('projects');

        // Kiểm tra xem tài nguyên có tồn tại không
        if (!resource) {
            console.log('Resource not found for ID:', req.params.id);
            res.status(404).send('Resource not found');  // Không cần return ở đây
            return; // Chỉ return để kết thúc hàm
        }

        // Trả về tài nguyên đã được populate
        console.log('Fetched resource by ID:', resource);
        res.status(200).json(resource);  // Không cần return ở đây
    } catch (err) {
        console.error('Error fetching resource by ID:', err.message);
        res.status(500).send('Internal Server Error');  // Không cần return ở đây
    }
};



// Update: Cập nhật resource theo ID
export const updateResource = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();

        // Cập nhật Resource theo ID
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // Kiểm tra xem Resource có tồn tại không
        if (!resource) {
            console.log('Resource not found for update with ID:', req.params.id);
            res.status(404).send('Resource not found');
            return; // Kết thúc hàm khi không tìm thấy tài nguyên
        }

        // Nếu có projects trong yêu cầu cập nhật, cập nhật Project với Resource ID mới
        if (req.body.projects) {
            const projectIds = req.body.projects;

            // Cập nhật các project để thêm resource vào mảng members
            await Project.updateMany(
                { _id: { $in: projectIds } },
                { $addToSet: { members: resource._id } }
            );

            // Xóa resource khỏi các projects không còn liên quan
            await Project.updateMany(
                { _id: { $nin: projectIds } },
                { $pull: { members: resource._id } }
            );
        }

        console.log('Resource updated successfully:', resource);
        res.status(200).json(resource);
    } catch (err) {
        console.error('Error updating resource:', err);
        res.status(400).send('Bad Request');
    }
};


// Delete: Xóa resource theo ID
export const deleteResource = async (req: Request, res: Response): Promise<void> => {
    try {
        await initDB();
        const resource = await Resource.findByIdAndDelete(req.params.id);
        
        if (!resource) {
            console.log('Resource not found for delete with ID:', req.params.id);
            res.status(404).send('Resource not found');
            return; // Kết thúc hàm khi không tìm thấy tài nguyên
        }
        
        console.log('Resource deleted successfully:', resource);
        res.status(200).send('Resource deleted successfully');
    } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).send('Internal Server Error');
    }
};

