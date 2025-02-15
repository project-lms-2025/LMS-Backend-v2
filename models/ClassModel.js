import { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "../config/dynamoDB.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";


class ClassModel {
    static async createClass(cls) { 
        const params = {
            TableName: process.env.CLASS_TABLE,
            Item: marshall(cls),
        };

        try {
            const command = new PutItemCommand(params);
            const data = await ddbClient.send(command);
            return cls;
        } catch (error) {
            console.error("Error creating class:", error);
            throw error;
        }
    }

    static async getClassById(class_id) {
        const params = {
            TableName: process.env.CLASS_TABLE,
            Key: marshall({ class_id }),
        };

        try {
            const command = new GetItemCommand(params);
            const data = await ddbClient.send(command);
            return data.Item ? unmarshall(data.Item) : null;
        } catch (error) {
            console.error("Error getting class:", error);
            throw error;
        }
    }

    static async getClassesByCourseId(course_id) {
        const params = {
            TableName: process.env.CLASS_TABLE,
            IndexName: 'course_id-index', // Assuming you have a GSI on course_id
            KeyConditionExpression: "course_id = :course_id",
            ExpressionAttributeValues: marshall({ ":course_id": course_id }),
        };

        try {
            const command = new QueryCommand(params);
            const data = await ddbClient.send(command);
            return data.Items.map(item => unmarshall(item));
        } catch (error) {
            console.error("Error getting classes by course ID:", error);
            throw error;
        }
    }

    static async getAllClasses() {
        const params = {
            TableName: process.env.CLASS_TABLE,
        };

        try {
            const command = new ScanCommand(params);
            const data = await ddbClient.send(command);
            return data.Items ? data.Items.map(item => unmarshall(item)) : [];
        } catch (error) {
            console.error("Error getting all classes:", error);
            throw error;
        }
    }

    static async updateClass(class_id, updatedClassData) {
        const existingClass = await this.getClassById(class_id);
        if (!existingClass) {
            throw new Error('Class not found');
        }

        const updateParams = {
            TableName: process.env.CLASS_TABLE,
            Key: marshall({ class_id }),
            UpdateExpression: "SET ",
            ExpressionAttributeValues: marshall({}),
            ReturnValues: "ALL_NEW"
        };

        for (const key in updatedClassData) {
            if (updatedClassData.hasOwnProperty(key)) {
                updateParams.UpdateExpression += `${key} = :${key}, `;
                updateParams.ExpressionAttributeValues[`:${key}`] = marshall({ [key]: updatedClassData[key] })[key];
            }
        }

        updateParams.UpdateExpression = updateParams.UpdateExpression.slice(0, -2);

        try {
            const command = new UpdateItemCommand(updateParams);
            const data = await ddbClient.send(command);
            return unmarshall(data.Attributes);
        } catch (error) {
            console.error("Error updating class:", error);
            throw error;
        }
    }

    static async deleteClass(class_id) {
        const params = {
            TableName: process.env.CLASS_TABLE,
            Key: marshall({ class_id }),
        };

        try {
            const command = new DeleteItemCommand(params);
            const data = await ddbClient.send(command);
            return data;
        } catch (error) {
            console.error("Error deleting class:", error);
            throw error;
        }
    }
}

export default ClassModel;