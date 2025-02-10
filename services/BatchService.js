import BatchModel from '../models/BatchModel.js';
import { generateUniqueId } from '../utils/idGenerator.js';

class BatchService {
    async createBatch(teacher_email, batch_name, description) {
        const batch_id = generateUniqueId();
        const batch = { batch_id, teacher_email, batch_name, description };
        return BatchModel.createBatch(batch);
    }

    async getBatch(batch_id) {
        return BatchModel.getBatchById(batch_id);
    }

    async getAllBatches() {
        return BatchModel.getAllBatches();
    }

    async updateBatch(batch_id, updatedBatchData) {
        return BatchModel.updateBatch(batch_id, updatedBatchData);
    }

    async deleteBatch(batch_id) {
        return BatchModel.deleteBatch(batch_id);
    }
}

const batchService = new BatchService();
export default batchService;