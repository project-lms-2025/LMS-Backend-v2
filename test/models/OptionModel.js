import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

class OptionModel {
  static async createOption(option) {
    const params = {
      TableName: process.env.OPTIONS_TABLE,
      Item: marshall(option),
    };

    try {
      const command = new PutItemCommand(params);
      const response = await ddbClient.send(command);
      const data = response.Attributes
        ? unmarshall(response.Attributes)
        : option;
      return { success: true, data };
    } catch (err) {
      console.error("Error creating option:", err);
      return { success: false, message: "Error creating option" };
    }
  }

  static async getOptionById(option_id) {
    const params = {
      TableName: process.env.OPTIONS_TABLE,
      Key: marshall({ option_id }),
    };

    try {
      const command = new GetItemCommand(params);
      const { Item } = await ddbClient.send(command);
      if (!Item) {
        return { success: false, message: "Option not found" };
      }
      return { success: true, data: unmarshall(Item) };
    } catch (err) {
      console.error("Error getting option by ID:", err);
      return { success: false, message: "Error getting option by ID" };
    }
  }

  static async getOptionsByQuestionId(question_id) {
    const params = {
      TableName: process.env.OPTIONS_TABLE,
      FilterExpression: "question_id = :question_id",
      ExpressionAttributeValues: marshall({ ":question_id": question_id }),
    };

    try {
      const command = new ScanCommand(params);
      const { Items } = await ddbClient.send(command);
      const options = Items ? Items.map((item) => unmarshall(item)) : [];
      return { success: true, data: options };
    } catch (err) {
      console.error("Error getting options by question ID:", err);
      return {
        success: false,
        message: "Error getting options by question ID",
      };
    }
  }

  static async updateOption(option_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(
        `<span class="math-inline">\{key\} \= \:</span>{key}`
      );
      attributeValues[`:${key}`] = marshall({ [key]: value })[key];
    }

    const params = {
      TableName: process.env.OPTIONS_TABLE,
      Key: marshall({ option_id }),
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return { success: true, data: unmarshall(Attributes) };
    } catch (err) {
      console.error("Error updating option:", err);
      return { success: false, message: "Error updating option" };
    }
  }

  static async deleteOption(option_id) {
    const params = {
      TableName: process.env.OPTIONS_TABLE,
      Key: marshall({ option_id }),
    };

    try {
      const command = new DeleteItemCommand(params);
      await ddbClient.send(command);
      return { success: true, message: "Option deleted successfully" };
    } catch (err) {
      console.error("Error deleting option:", err);
      return { success: false, message: "Error deleting option" };
    }
  }
}

export default OptionModel;
