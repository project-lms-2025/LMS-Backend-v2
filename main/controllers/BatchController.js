import BatchModel from "../models/BatchModel.js";
import { generateUniqueId } from "../../utils/idGenerator.js";

class BatchController {
    static async createBatch(req, res) {
        try {
            const { batch_name, description, start_date, end_date, cost } = req.body;
            const batch_id = generateUniqueId(); // Generate unique batch ID
            const newBatch = { batch_id, batch_name, description, start_date, end_date, cost };
            
            const result = await BatchModel.createBatch(newBatch);
            res.status(result.success ? 201 : 400).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create batch" });
        }
    }

    static async getBatch(req, res) {
        try {
            const result = await BatchModel.getBatchById(req.params.batch_id);
            res.status(result.success ? 200 : 404).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get batch" });
        }
    }

    static async getAllBatches(req, res) {
        try {
            const result = await BatchModel.getAllBatches();
            res.status(result.success ? 200 : 500).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get all batches" });
        }
    }

    static async updateBatch(req, res) {
        try {
            const result = await BatchModel.updateBatch(req.params.batch_id, req.body);
            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update batch" });
        }
    }

    static async deleteBatch(req, res) {
        try {
            const result = await BatchModel.deleteBatch(req.params.batch_id);
            res.status(result.success ? 204 : 404).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete batch" });
        }
    }

    static async getUserBatches(req, res) {
        try {
            const result = await BatchModel.getUserBatches(req.params.user_id);
            res.status(result.success ? 200 : 404).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get user batches" });
        }
    }
}

export default BatchController;
