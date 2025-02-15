import BatchAssignmentModel from "../models/BatchAssignmentModel.js";

class BatchAssignmentController {
  static async assignEntityToBatch(req, res) {
    const { batch_id, entity } = req.body;

    try {
      const result = await BatchAssignmentModel.assignEntityToBatch(
        batch_id,
        entity
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error assigning entity to batch:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async bulkAssignEntitiesToBatches(req, res) {
    const { batchEntityAssignments } = req.body;

    try {
      const result = await BatchAssignmentModel.bulkAssignEntitiesToBatches(
        batchEntityAssignments
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error bulk assigning entities to batches:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default BatchAssignmentController;
