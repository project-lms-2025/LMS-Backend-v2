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
      const response = await ddbClient.send(command);
      const data = response.Attributes ? unmarshall(response.Attributes) : question;
      return { success: true, data };
    } catch (err) {
      console.error("Error creating question:", err);
      return { success: false, message: "Error creating question" };
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
        return { success: false, message: "Question not found" };
      }
      return { success: true, data: unmarshall(Item) };
    } catch (err) {
      console.error("Error getting question by ID:", err);
      return { success: false, message: "Error getting question by ID" };
    }
  }

  static async getQuestionsByTestId(test_id) {
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      FilterExpression: "test_id = :test_id", // Filter by test_id
      ExpressionAttributeValues: marshall({ ":test_id": test_id }),
    };

    try {
      const command = new ScanCommand(params); // Use ScanCommand with filter
      const { Items } = await ddbClient.send(command);
      const questions = Items ? Items.map((item) => unmarshall(item)) : [];
      return { success: true, data: questions };
    } catch (err) {
      console.error("Error getting questions by test ID:", err);
      return { success: false, message: "Error getting questions by test ID" };
    }
  }

  static async updateQuestion(question_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`<span class="math-inline">\{key\} \= \:</span>{key}`);
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
      return { success: true, data: unmarshall(Attributes) };
    } catch (err) {
      console.error("Error updating question:", err);
      return { success: false, message: "Error updating question" };
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
      return { success: true, message: "Question deleted successfully" };
    } catch (err) {
      console.error("Error deleting question:", err);
      return { success: false, message: "Error deleting question" };
    }
  }
}

export default QuestionModel;