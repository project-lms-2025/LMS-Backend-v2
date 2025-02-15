import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

class ResultModel {
  static async createResult(result) {
    const params = {
      TableName: process.env.RESULTS_TABLE,
      Item: marshall(result),
    };

    try {
      const command = new PutItemCommand(params);
      const response = await ddbClient.send(command);
      const data = response.Attributes ? unmarshall(response.Attributes) : result;
      return { success: true, data };
    } catch (err) {
      console.error("Error creating result:", err);
      return { success: false, message: "Error creating result" };
    }
  }

  static async getResultById(result_id) {
    const params = {
      TableName: process.env.RESULTS_TABLE,
      Key: marshall({ result_id }),
    };

    try {
      const command = new GetItemCommand(params);
      const { Item } = await ddbClient.send(command);
      if (!Item) {
        return { success: false, message: "Result not found" };
      }
      return { success: true, data: unmarshall(Item) };
    } catch (err) {
      console.error("Error getting result by ID:", err);
      return { success: false, message: "Error getting result by ID" };
    }
  }

  static async getResultsByTestId(test_id) {
    const params = {
      TableName: process.env.RESULTS_TABLE,
      FilterExpression: "test_id = :test_id",
      ExpressionAttributeValues: marshall({ ":test_id": test_id }),
    };

    try {
      const command = new ScanCommand(params);
      const { Items } = await ddbClient.send(command);
      const results = Items ? Items.map((item) => unmarshall(item)) : [];
      return { success: true, data: results };
    } catch (err) {
      console.error("Error getting results by test ID:", err);
      return { success: false, message: "Error getting results by test ID" };
    }
  }

  static async updateResult(result_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`<span class="math-inline">\{key\} \= \:</span>{key}`);
      attributeValues[`:${key}`] = marshall({ [key]: value })[key];
    }

    const params = {
      TableName: process.env.RESULTS_TABLE,
      Key: marshall({ result_id }),
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return { success: true, data: unmarshall(Attributes) };
    } catch (err) {
      console.error("Error updating result:", err);
      return { success: false, message: "Error updating result" };
    }
  }

  static async deleteResult(result_id) {
    const params = {
      TableName: process.env.RESULTS_TABLE,
      Key: marshall({ result_id }),
    };

    try {
      const command = new DeleteItemCommand(params);
      await ddbClient.send(command);
      return { success: true, message: "Result deleted successfully" };
    } catch (err) {
      console.error("Error deleting result:", err);
      return { success: false, message: "Error deleting result" };
    }
  }
}

export default ResultModel;