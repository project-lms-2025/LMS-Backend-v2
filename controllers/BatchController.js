import BatchService from '../services/BatchService.js';

class BatchController {
    static async createBatch(req, res) {
        try {
            const { batch_name, description } = req.body;
            const teacher_email = req.email;

            const newBatch = await BatchService.createBatch(teacher_email, batch_name, description);
            res.status(201).json(newBatch);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create batch' });
        }
    }

    static async getBatch(req, res) {
        try {
            const batch = await BatchService.getBatch(req.params.batch_id);
            if (!batch) {
                return res.status(404).json({ error: 'Batch not found' });
            }
            res.json(batch);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get batch' });
        }
    }

    static async getAllBatches(req, res) {
        try {
            const batches = await BatchService.getAllBatches();
            res.json(batches);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get all batches' });
        }
    }

    static async updateBatch(req, res) {
        try {
            const updatedBatch = await BatchService.updateBatch(req.params.batch_id, req.body);
            res.json(updatedBatch);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update batch' });
        }
    }

    static async deleteBatch(req, res) {
        try {
            await BatchService.deleteBatch(req.params.batch_id);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete batch' });
        }
    }
}

export default BatchController;
