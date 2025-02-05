import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import  { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

class UserSession {
  static async createOrUpdateSession(userId, deviceType, token) {
    const params = {
      TableName: 'UserSessions',
      Item: marshall({
        userId,
        deviceType,
        token,
        createdAt: Date.now(),
      }),
    };
    await client.send(new PutItemCommand(params));
  }

  static async getSessionByUserAndDevice(userId, deviceType) {
    const params = {
      TableName: 'UserSessions',
      Key: marshall({
        userId,
        deviceType,
      }),
    };
    const result = await client.send(new GetItemCommand(params));
    return result.Item ? unmarshall(result.Item) : null;
  }

  static async deleteSession(userId, deviceType) {
    const params = {
      TableName: 'UserSessions',
      Key: marshall({
        userId,
        deviceType,
      }),
    };
    await client.send(new DeleteItemCommand(params));
  }
}

export default  UserSession;