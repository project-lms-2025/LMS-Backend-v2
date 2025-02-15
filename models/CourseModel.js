import { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "../config/dynamoDB.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";


class CourseModel {
    static async createCourse(course) {
        const params = {
            TableName: process.env.COURSE_TABLE,
            Item: marshall(course),
        };

        try {
            const command = new PutItemCommand(params);
            const data = await ddbClient.send(command);
            return course;
        } catch (error) {
            console.error("Error creating course:", error);
            throw error;
        }
    }

    static async getCourseById(course_id) {
        const params = {
            TableName: process.env.COURSE_TABLE,
            Key: marshall({ course_id }),
        };

        try {
            const command = new GetItemCommand(params);
            const data = await ddbClient.send(command);
            return data.Item ? unmarshall(data.Item) : null;
        } catch (error) {
            console.error("Error getting course:", error);
            throw error;
        }
    }

    static async getAllCourses() {
        const params = {
            TableName: process.env.COURSE_TABLE,
        };

        try {
            const command = new ScanCommand(params);
            const data = await ddbClient.send(command);
            return data.Items ? data.Items.map(item => unmarshall(item)) : [];
        } catch (error) {
            console.error("Error getting all courses:", error);
            throw error;
        }
    }

    static async getCoursesByBatchId(batch_id) { // New function to get courses within a batch
        const params = {
            TableName: process.env.COURSE_TABLE,
            IndexName: 'batch_id-index',  // Assuming you have a GSI on batch_id
            KeyConditionExpression: "batch_id = :batch_id",
            ExpressionAttributeValues: marshall({ ":batch_id": batch_id }),
        };

        try {
            const command = new QueryCommand(params);
            const data = await ddbClient.send(command);
            return data.Items.map(item => unmarshall(item));
        } catch (error) {
            console.error("Error getting courses by batch ID:", error);
            throw error;
        }
    }


    static async updateCourse(course_id, updatedCourseData) {
        const existingCourse = await this.getCourseById(course_id);
        if (!existingCourse) {
            throw new Error('Course not found');
        }


        const updateParams = {
            TableName: process.env.COURSE_TABLE,
            Key: marshall({ course_id }),
            UpdateExpression: "SET ",
            ExpressionAttributeValues: marshall({}),
            ReturnValues: "ALL_NEW"
        };


        for (const key in updatedCourseData) {
            if (updatedCourseData.hasOwnProperty(key)) {
                updateParams.UpdateExpression += `${key} = :${key}, `;
                updateParams.ExpressionAttributeValues[`:${key}`] = marshall({ [key]: updatedCourseData[key] })[key];
            }
        }

        updateParams.UpdateExpression = updateParams.UpdateExpression.slice(0, -2);

        console.log(updateParams)

        try {
            const command = new UpdateItemCommand(updateParams);
            const data = await ddbClient.send(command);
            return unmarshall(data.Attributes);
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    }

    static async deleteCourse(course_id) {
        const params = {
            TableName: process.env.COURSE_TABLE,
            Key: marshall({ course_id }),
        };

        try {
            const command = new DeleteItemCommand(params);
            const data = await ddbClient.send(command);
            return data;
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    }
}

export default CourseModel;