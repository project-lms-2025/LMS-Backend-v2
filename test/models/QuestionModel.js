import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

class QuestionModel {
  static async createQuestion(question) {
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Item: marshall(question),
    };

    try {
      const command = new PutItemCommand(params);
      await ddbClient.send(command);
      return question;
    } catch (err) {
      console.error("Error creating question:", err);
      throw new Error("Error creating question");
    }
  }

  static async getQuestionById(question_id) {
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: marshall({ question_id }),
    };

    try {
      const command = new GetItemCommand(params);
      const { Item } = await ddbClient.send(command);
      if (!Item) {
        return null;
      }
      return unmarshall(Item);
    } catch (err) {
      console.error("Error getting question by ID:", err);
      throw new Error("Error getting question by ID");
    }
  }

  static async getQuestionsByTestId(test_id) {
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      FilterExpression: "test_id = :test_id",
      ExpressionAttributeValues: marshall({ ":test_id": test_id }),
    };

    try {
      const command = new ScanCommand(params);
      const { Items } = await ddbClient.send(command);
      return Items ? Items.map((item) => unmarshall(item)) : [];
    } catch (err) {
      console.error("Error getting questions by test ID:", err);
      throw new Error("Error getting questions by test ID");
    }
  }

  static async updateQuestion(question_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`${key} = :${key}`);
      attributeValues[`:${key}`] = marshall({ [key]: value })[key];
    }

    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: marshall({ question_id }),
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return unmarshall(Attributes);
    } catch (err) {
      console.error("Error updating question:", err);
      throw new Error("Error updating question");
    }
  }

  static async deleteQuestion(question_id) {
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: marshall({ question_id }),
    };

    try {
      const command = new DeleteItemCommand(params);
      await ddbClient.send(command);
      return { success: true };
    } catch (err) {
      console.error("Error deleting question:", err);
      throw new Error("Error deleting question");
    }
  }
}

export default QuestionModel;
