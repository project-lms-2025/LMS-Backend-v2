import ddbClient from "../config/dynamoDB.js";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

dotenv.config();

class UserModel {
  static async createUser(user) {
    const authParams = {
      TableName: process.env.AUTH_TABLE,
      Item: marshall({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        exam_registered_for:user.exam_registered_for || null
      }),
    };

    try {
      const authCommand = new PutItemCommand(authParams);
      await ddbClient.send(authCommand);
      return { success: true, message: "User created successfully" };
    } catch (err) {
      console.error("Error creating user in DynamoDB:", err);
      return { success: false, message: "Error creating user" };
    }
  }

  static async getUserByEmail(email) {
    const authParams = {
      TableName: process.env.AUTH_TABLE,
      Key: marshall({ email }),
    };

    try {
      const authCommand = new GetItemCommand(authParams);
      const { Item: authItem } = await ddbClient.send(authCommand);
      if (!authItem) {
        return { success: false, message: "User not found" };
      }

      const user = unmarshall(authItem);

      return {
        success: true,
        data: user,
      };
    } catch (err) {
      console.error("Error fetching user from DynamoDB:", err);
      return { success: false, error: "Error fetching user" };
    }
  }

  static async getUserPhoneNumber(phoneNumber){
    const params = {
      TableName: process.env.AUTH_TABLE,
      IndexName: 'phoneNumber-index',
      KeyConditionExpression: 'phoneNumber = :phoneNumber',
      ExpressionAttributeValues: {
        ':phoneNumber': { S: phoneNumber }
      }
    };

    try {
      const authCommand = new QueryCommand(params);
      const { Items: queryItems } = await ddbClient.send(authCommand);
      if (!queryItems[0]) {
        return { success: false, message: "User not found" };
      }
      const user = unmarshall(queryItems[0]);

      return { success: true, ...user };
    } catch (err) {
      console.error("Error fetching user from DynamoDB:", err);
      return { success: false, error: "Error fetching user" };
    }
  }

  static async updateUser(userId, updatedFields) {
    const updateExpressions = [];
    const attributeValues = {};

    for (const [key, value] of Object.entries(updatedFields)) {
      updateExpressions.push(`${key} = :${key}`);
      attributeValues[`:${key}`] = { S: value };
    }

    const params = {
      TableName: process.env.USERS_TABLE,
      Key: {
        userId: { S: userId },
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return { success: true, data: Attributes };
    } catch (err) {
      console.error("Error updating user in DynamoDB:", err);
      return { success: false, message: "Error updating user" };
    }
  }

  static async deleteUser(email) {
    const authParams = {
      TableName: process.env.AUTH_TABLE,
      Key: marshall({ email }),
    };

    const userDataParams = {
      TableName: process.env.USER_DATA_TABLE,
      Key: marshall({ email }),
    };

    const userDocsParams = {
      TableName: process.env.USER_DOCS_TABLE,
      Key: marshall({ email }),
    };

    try {
      const authCommand = new DeleteItemCommand(authParams);
      const userDataCommand = new DeleteItemCommand(userDataParams);
      const userDocsCommand = new DeleteItemCommand(userDocsParams);
      await ddbClient.send(authCommand);
      await ddbClient.send(userDataCommand);
      await ddbClient.send(userDocsCommand);
      return { success: true, message: "User deleted successfully" };
    } catch (err) {
      console.error("Error deleting user from DynamoDB:", err);
      return { success: false, message: "Error deleting user" };
    }
  }

  static async updatePassword(email, newPassword) {
    const params = {
      TableName: process.env.AUTH_TABLE,
      Key: marshall({ email }),
      UpdateExpression: "SET password = :password",
      ExpressionAttributeValues: marshall({
        ":password": newPassword,
      }),
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateItemCommand(params);
      const { Attributes } = await ddbClient.send(command);
      return { success: true, data: Attributes };
    } catch (err) {
      console.error("Error updating password in DynamoDB:", err);
      return { success: false, message: "Error updating password" };
    }
  }

  static async getDataFromTable(tableName, key) {
    const params = {
      TableName: tableName,
      Key: marshall(key),
    };

    try {
      const command = new GetItemCommand(params);
      const result = await ddbClient.send(command);

      if (!result.Item) {
        throw new Error(`No data found for key: ${JSON.stringify(key)}`);
      }

      const item = unmarshall(result.Item);
      return item;
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }
  }

  static async getUserDataByEmail(email) {
    try {
      const authData = await this.getDataFromTable(process.env.AUTH_TABLE, {
        email,
      });
      const userData = await this.getDataFromTable(
        process.env.USER_DATA_TABLE,
        { email }
      );
      const userDocs = await this.getDataFromTable(
        process.env.USER_DOCS_TABLE,
        { email }
      );
      return { authData, userData, userDocs };
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error("Error fetching user details");
    }
  }
}

export default UserModel;
