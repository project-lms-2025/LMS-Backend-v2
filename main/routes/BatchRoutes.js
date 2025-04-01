import express from 'express';
const router = express.Router();
import AuthMiddleware from "../../middleware/AuthMiddleware.js";
import BatchController from "../controllers/BatchController.js";
import RoleMiddleware from '../../middleware/RoleMiddleware.js';


router.post('/', AuthMiddleware.auth, await RoleMiddleware.checkRole(["admin","teacher"]), BatchController.createBatch);
router.get('/:batch_id', BatchController.getBatch); //check for enrollment
router.get('/',  BatchController.getAllBatches);
router.put('/:batch_id', AuthMiddleware.auth ,await RoleMiddleware.checkRole(["admin", "teacher"]), BatchController.updateBatch);
router.delete('/:batch_id', AuthMiddleware.auth ,await RoleMiddleware.checkRole(["admin", "teacher"]), BatchController.deleteBatch);
router.get('/my-batches', AuthMiddleware.auth, BatchController.getUserBatches);

export default router;