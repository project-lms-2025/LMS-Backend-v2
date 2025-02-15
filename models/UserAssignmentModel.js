import { BatchWriteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../config/dynamoDB";
import dotenv from 'dotenv';


dotenv.config();


class UserAssignmentModel {
  static async assignUser(tableName, item) {
    const params = {
      TableName: tableName,
      Item: marshall(item)
    };

    try {
      await ddbClient.send(new BatchWriteItemCommand({ RequestItems: { [tableName]: [params] } }));
      console.log(`Item inserted into table ${tableName}:`, item);
    } catch (error) {
      console.error('Error inserting single item:', error);
    }
  }

  static async assignBatchUsers(tableName, items) {
    const params = {
      RequestItems: {
        [tableName]: items.map(item => ({
          PutRequest: {
            Item: marshall(item)
          }
        }))
      }
    };

    try {
      await ddbClient.send(new BatchWriteItemCommand(params));
      console.log(`Batch insert into table ${tableName}:`, items);
    } catch (error) {
      console.error('Error inserting batch items:', error);
    }
  }

  static async getItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: marshall(key)
    };

    try {
      const { Item } = await ddbClient.send(new GetItemCommand(params));
      if (Item) {
        console.log('Item retrieved:', unmarshall(Item));
        return unmarshall(Item);
      } else {
        console.log('Item not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting item:', error);
    }
  }

  static async getItemByUserId(tableName, key) {
    const params = {
      TableName: tableName,
      KeyConditionExpression: "#user_id = :user_id",
      ExpressionAttributeNames: {
        "#user_id": "user_id"
      },
      ExpressionAttributeValues: {
        ":user_id": { S: key }
      }
    };

    try {
      const { Items } = await ddbClient.send(new QueryCommand(params));
      return Items ? Items.map(item => unmarshall(item)) : [];
    } catch (error) {
      console.error('Error querying items:', error);
      return [];
    }
  }
}

export default UserAssignmentModel;
