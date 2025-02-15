import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { PutItemCommand, GetItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "../../config/dynamoDB.js";


class TestModel {
  static async createTest(test) {
    const params = {
      TableName: process.env.TESTS_TABLE,
      Item: marshall(test),
    };

    try {
      const command = new PutItemCommand(params);
      const response = await ddbClient.send(command);
      const data = response.Attributes ? unmarshall(response.Attributes) : test;
      return { success: true, data };
    } catch (err) {
      console.error("Error creating test:", err);
      return { success: false, message: "Error creating test" };
    }
  }

  static async getTestById(test_id) {
    const params = {
      TableName: process.env.TESTS_TABLE,
      Key: marshall({ test_id }),
    };

    try {
      const command = new GetItemCommand(params);
      const { Item } = await ddbClient.send(command);
      if (!Item) {
        return { success: false, message: "Test not found" };
      }
      return { success: true, data: unmarshall(Item) };
    } catch (err) {
      console.error("Error getting test by ID:", err);
      return { success: false, message: "Error getting test by ID" };
    }
  }

  static async getAllTests() {
    const params = {
      TableName: process.env.TESTS_TABLE,
    };

    try {
      const command = new ScanCommand(params);
      const { Items } = await ddbClient.send(command);
      const tests = Items ? Items.map((item) => unmarshall(item)) : [];
      return { success: true, data: tests };
    } catch (err) {
      console.error("Error getting all tests:", err);
      return { success: false, message: "Error getting all tests" };
    }
  }

  static async updateTest(test_id, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`<span class="math-inline">\{key\} \= \:</span>{key}`);
      attributeValues[`:${key}`] = marshall({ [key]: value })[key];
    }

    const params = {
      TableName: process.env.TESTS_TABLE,
      Key: marshall({ test_id }),
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return { success: true, data: unmarshall(Attributes) };
    } catch (err) {
      console.error("Error updating test:", err);
      return { success: false, message: "Error updating test" };
    }
  }

  static async deleteTest(test_id) {
    const params = {
      TableName: process.env.TESTS_TABLE,
      Key: marshall({ test_id }),
    };

    try {
      const command = new DeleteItemCommand(params);
      await ddbClient.send(command);
      return { success: true, message: "Test deleted successfully" };
    } catch (err) {
      console.error("Error deleting test:", err);
      return { success: false, message: "Error deleting test" };
    }
  }
}

export default TestModel;