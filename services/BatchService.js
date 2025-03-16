import BatchModel from '../models/BatchModel.js';
import { generateUniqueId } from '../utils/idGenerator.js';

class BatchService {
    static async createBatch(teacher_email, batch_name, description) {
        const batch_id = generateUniqueId();
        const batch = { batch_id, teacher_email, batch_name, description };
        return BatchModel.createBatch(batch);
    }

    static async getBatch(batch_id) {
        return BatchModel.getBatchById(batch_id);
    }

    static async getAllBatches() {
        return BatchModel.getAllBatches();
    }

    static async updateBatch(batch_id, updatedBatchData) {
        return BatchModel.updateBatch(batch_id, updatedBatchData);
    }

    static async deleteBatch(batch_id) {
        return BatchModel.deleteBatch(batch_id);
    }
}

export default BatchService;