import express from 'express';
const router = express.Router();
import AuthMiddleware from "../middleware/AuthMiddleware.js"
import BatchController from "../controllers/BatchController.js"
import RoleMiddleware from '../middleware/RoleMiddleware.js';


router.post('/', AuthMiddleware.auth,await RoleMiddleware.checkRole(["teacher"]), BatchController.createBatch);
router.get('/:batch_id', BatchController.getBatch);
router.get('/', BatchController.getAllBatches);
router.put('/:batch_id', AuthMiddleware.auth,await RoleMiddleware.checkRole(["teacher"]), BatchController.updateBatch);
router.delete('/:batch_id', AuthMiddleware.auth,await RoleMiddleware.checkRole(["teacher"]), BatchController.deleteBatch);

export default router;