const { ddbClient } = require('../config/dynamoDB');
const { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const dotenv = require('dotenv');

dotenv.config();

const createUser = async (user) => {
  const authParams = {
    TableName: process.env.AUTH_TABLE,
    Item: {
      userId: { S: user.id },
      email: { S: user.email },
      password: { S: user.password },
    },
  };

  const userDataParams = {
    TableName: process.env.USER_DATA_TABLE,
    Item: {
      userId: { S: user.id },
      name: { S: user.name },
      profile_picture: { S: user.profile_picture },
    },
  };

  const userDocsParams = {
    TableName: process.env.USER_DOCS_TABLE,
    Item: {
      userId: { S: user.id },
      pdf: { S: user.pdf },
    },
  };

  try {
    const authCommand = new PutItemCommand(authParams);
    const userDataCommand = new PutItemCommand(userDataParams);
    const userDocsCommand = new PutItemCommand(userDocsParams);
    await ddbClient.send(authCommand);
    await ddbClient.send(userDataCommand);
    await ddbClient.send(userDocsCommand);
    return { success: true, message: 'User created successfully' };
  } catch (err) {
    console.error('Error creating user in DynamoDB:', err);
    return { success: false, message: 'Error creating user' };
  }
};


const getUserByEmail = async (email) => {
  const authParams = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      email: { S: email },
    },
  };

  try {
    const authCommand = new GetItemCommand(authParams);
    const { Item: authItem } = await ddbClient.send(authCommand);
    if (!authItem) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      data: { auth: authItem},
    };
  } catch (err) {
    console.error('Error fetching user from DynamoDB:', err);
    return { success: false, message: 'Error fetching user' };
  }
};

const updateUser = async (userId, updatedFields) => {
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
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const command = new UpdateItemCommand(params);
    const { Attributes } = await ddbClient.send(command);
    return { success: true, data: Attributes };
  } catch (err) {
    console.error('Error updating user in DynamoDB:', err);
    return { success: false, message: 'Error updating user' };
  }
};

const deleteUser = async (userId) => {
  const authParams = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      userId: { S: userId },
    },
  };

  const userDataParams = {
    TableName: process.env.USER_DATA_TABLE,
    Key: {
      userId: { S: userId },
    },
  };

  try {
    const authCommand = new DeleteItemCommand(authParams);
    const userDataCommand = new DeleteItemCommand(userDataParams);
    await ddbClient.send(authCommand);
    await ddbClient.send(userDataCommand);
    return { success: true, message: 'User deleted successfully' };
  } catch (err) {
    console.error('Error deleting user from DynamoDB:', err);
    return { success: false, message: 'Error deleting user' };
  }
};

const updatePassword = async (userId, newPassword) => {
  const params = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      userId: { S: userId },
    },
    UpdateExpression: 'SET password = :password',
    ExpressionAttributeValues: {
      ':password': { S: newPassword },
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const command = new UpdateItemCommand(params);
    const { Attributes } = await ddbClient.send(command);
    return { success: true, data: Attributes };
  } catch (err) {
    console.error('Error updating password in DynamoDB:', err);
    return { success: false, message: 'Error updating password' };
  }
};



module.exports = { createUser, getUserByEmail, updateUser, deleteUser, updatePassword };
