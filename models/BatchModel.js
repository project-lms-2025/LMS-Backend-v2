import ddbClient from "../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

class BatchModel {
  static async createBatch(batch) {
    const params = {
      TableName: process.env.BATCH_TABLE,
      Item: marshall(batch),
    };

    try {
      const command = new PutItemCommand(params);
      const data = await ddbClient.send(command);
      return batch;
    } catch (error) {
      console.error("Error creating batch:", error);
      throw error;
    }
  }

  static async getBatchById(batch_id) {
    const params = {
      TableName: process.env.BATCH_TABLE,
      Key: marshall({ batch_id }),
    };

    try {
      const command = new GetItemCommand(params);
      const data = await ddbClient.send(command);
      return data.Item ? unmarshall(data.Item) : null;
    } catch (error) {
      console.error("Error getting batch:", error);
      throw error;
    }
  }

  static async getAllBatches() {
    const params = {
      TableName: process.env.BATCH_TABLE,
    };
    try {
      const command = new ScanCommand(params);
      const data = await ddbClient.send(command);
      return data.Items.map((item) => unmarshall(item));
    } catch (error) {
      console.error("Error getting all batches:", error);
      throw error;
    }
  }

  static async updateBatch(batch_id, updatedBatchData) {
    const existingBatch = await this.getBatchById(batch_id);
    if (!existingBatch) {
      throw new Error("Batch not found");
    }

    const updateParams = {
      TableName: process.env.BATCH_TABLE,
      Key: marshall({ batch_id }),
      UpdateExpression: "SET ",
      ExpressionAttributeValues: marshall({}),
      ReturnValues: "ALL_NEW",
    };

    for (const key in updatedBatchData) {
      if (updatedBatchData.hasOwnProperty(key)) {
        updateParams.UpdateExpression += `${key} = :${key}, `;
        updateParams.ExpressionAttributeValues[`:${key}`] = marshall({ [key]: updatedBatchData[key] })[key];
      }
    }

    updateParams.UpdateExpression = updateParams.UpdateExpression.slice(0, -2);

    try {
      const command = new UpdateItemCommand(updateParams);
      const data = await ddbClient.send(command);
      return unmarshall(data.Attributes);
    } catch (error) {
      console.error("Error updating batch:", error);
      throw error;
    }
  }

  static async deleteBatch(batch_id) {
    const params = {
      TableName: process.env.BATCH_TABLE,
      Key: marshall({ batch_id }),
    };

    try {
      const command = new DeleteItemCommand(params);
      const data = await ddbClient.send(command);
      return data;
    } catch (error) {
      console.error("Error deleting batch:", error);
      throw error;
    }
  }
}

export default BatchModel;
