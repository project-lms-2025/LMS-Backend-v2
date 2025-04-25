import express from "express";
import ClassController from "../controllers/ClassController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import RoleMiddleware from "../middleware/RoleMiddleware.js";

const router = express.Router();

// Swagger - Create a class
/**
 * @swagger
 * /class/classes:
 *   post:
 *     summary: Create a new class
 *     description: Create a new class with all necessary details.
 *     tags: [Classes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: string
 *               course_id:
 *                 type: string
 *               teacher_id:
 *                 type: string
 *               class_title:
 *                 type: string
 *               class_date_time:
 *                 type: string
 *                 format: date-time
 *               recording_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post(
  "/classes",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "teacher"]),
  ClassController.createClass
);

// Swagger - Get all classes
/**
 * @swagger
 * /class/classes:
 *   get:
 *     summary: Get all classes
 *     description: Retrieve a list of all classes.
 *     tags: [Classes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   class_id:
 *                     type: string
 *                   course_id:
 *                     type: string
 *                   teacher_id:
 *                     type: string
 *                   class_title:
 *                     type: string
 *                   class_date_time:
 *                     type: string
 *                     format: date-time
 *                   recording_url:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/classes",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "teacher"]),
  ClassController.getAllClasses
);

// Swagger - Get class by ID
/**
 * @swagger
 * /class/classes/{class_id}:
 *   get:
 *     summary: Get a class by ID
 *     description: Retrieve the details of a class by its ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: class_id
 *         required: true
 *         description: The class ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The class details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 class_id:
 *                   type: string
 *                 course_id:
 *                   type: string
 *                 teacher_id:
 *                   type: string
 *                 class_title:
 *                   type: string
 *                 class_date_time:
 *                   type: string
 *                   format: date-time
 *                 recording_url:
 *                   type: string
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.get("/classes/:class_id", ClassController.getClass);

// Swagger - Get classes by course ID
/**
 * @swagger
 * /class/classes/course/{course_id}:
 *   get:
 *     summary: Get all classes for a specific course
 *     description: Retrieve a list of classes by course ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         description: The course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of classes for the specified course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   class_id:
 *                     type: string
 *                   course_id:
 *                     type: string
 *                   teacher_id:
 *                     type: string
 *                   class_title:
 *                     type: string
 *                   class_date_time:
 *                     type: string
 *                     format: date-time
 *                   recording_url:
 *                     type: string
 *       404:
 *         description: No classes found for the given course ID
 *       500:
 *         description: Internal server error
 */
router.get("/classes/course/:course_id", ClassController.getClassesByCourseId);

// Swagger - Update a class
/**
 * @swagger
 * /class/classes/{class_id}:
 *   put:
 *     summary: Update a class by ID
 *     description: Update the details of a class by its ID.
 *     tags: [Classes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: class_id
 *         required: true
 *         description: The class ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_title:
 *                 type: string
 *               recording_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/classes/:class_id",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "teacher"]),
  ClassController.updateClass
);

// Swagger - Delete a class
/**
 * @swagger
 * /class/classes/{class_id}:
 *   delete:
 *     summary: Delete a class by ID
 *     description: Delete a class by its ID.
 *     tags: [Classes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: class_id
 *         required: true
 *         description: The class ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/classes/:class_id",
  AuthMiddleware.auth,
  await RoleMiddleware.checkRole(["admin", "teacher"]),
  ClassController.deleteClass
);

export default router;
