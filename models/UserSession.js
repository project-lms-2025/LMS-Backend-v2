import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import  { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

class UserSession {
  static async createOrUpdateSession(email, deviceType, token) {
    const params = {
      TableName: process.env.SESSIONS_TABLE,
      Item: marshall({
        email,
        deviceType,
        token,
        createdAt: Date.now(),
      }),
    };
    await client.send(new PutItemCommand(params));
  }

  static async getSessionByUserAndDevice(email, deviceType) {
    const params = {
      TableName: process.env.SESSIONS_TABLE,
      Key: marshall({
        email,
        deviceType,
      }),
    };
    const result = await client.send(new GetItemCommand(params));
    return result.Item ? unmarshall(result.Item) : null;
  }

  static async deleteSession(email, deviceType) {
    const params = {
      TableName: process.env.SESSIONS_TABLE,
      Key: marshall({
        email,
        deviceType,
      }),
    };
    await client.send(new DeleteItemCommand(params));
  }
}

export default  UserSession;