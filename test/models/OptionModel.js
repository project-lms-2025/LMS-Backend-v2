import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
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
      await ddbClient.send(command);
      return option;
    } catch (err) {
      console.error("Error creating option:", err);
      throw new Error("Error creating option");
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
        return null;
      }
      return unmarshall(Item);
    } catch (err) {
      console.error("Error getting option by ID:", err);
      throw new Error("Error getting option by ID");
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
      return Items ? Items.map((item) => unmarshall(item)) : [];
    } catch (err) {
      console.error("Error getting options by question ID:", err);
      throw new Error("Error getting options by question ID");
    }
  }

  static async getCorrectOptionsByTestId(test_id) {
    const params = {
      TableName: process.env.OPTIONS_TABLE,
      IndexName: "test_id-index",
      KeyConditionExpression: "test_id = :test_id",
      FilterExpression: "is_correct = :is_correct",
      ExpressionAttributeValues: marshall({
        ":test_id": test_id,
        ":is_correct": true,
      }),
    };
  
    try {
      const command = new QueryCommand(params);
      const { Items } = await ddbClient.send(command);
      const options = Items ? Items.map((item) => unmarshall(item)) : [];
  
      return options;
    } catch (err) {
      console.error("Error getting correct options by test ID:", err);
      throw new Error("Error getting correct options by test ID");
    }
  }
  

  static async updateOption(option_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`${key} = :${key}`);
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
      return unmarshall(Attributes);
    } catch (err) {
      console.error("Error updating option:", err);
      throw new Error("Error updating option");
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
      return { success: true };
    } catch (err) {
      console.error("Error deleting option:", err);
      throw new Error("Error deleting option");
    }
  }
}

export default OptionModel;
