const { ddbClient } = require('../config/dynamoDB');
const { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const dotenv = require('dotenv');

dotenv.config();

const createUser = async (user) => {
  const authParams = {
    TableName: process.env.AUTH_TABLE,
    Item: {
      email: { S: user.email },
      password: { S: user.password },
      is_email_verified: { BOOL: false },
      exam_registered_for: { S: user.exam_registered_for },
    },
  };

  const userDataParams = {
    TableName: process.env.USER_DATA_TABLE,
    Item: {
      email: { S: user.email },
      name: { S: user.name },
      address: { S: user.address },
      pincode: { S: user.pincode },
      state: { S: user.state },
      marks10: { N: user.marks10.toString() },
      marks12: { N: user.marks12.toString() },
      higher_degree_score: user.higher_degree_score ? { N: user.higher_degree_score.toString() } : { NULL: true },
      previous_year_score: user.previous_year_score ? { N: user.previous_year_score.toString() } : { NULL: true },
    },
  };

  const userDocsParams = {
    TableName: process.env.USER_DOCS_TABLE,
    Item: {
      email: { S: user.email },
      profile_picture_url: { S: user.profile_picture },
      pdf10th: user.pdf10th ? { S: user.pdf10th } : { NULL: true },
      pdf12th: user.pdf12th ? { S: user.pdf12th } : { NULL: true },
      higher_degree_urls: user.higher_degree_urls && user.higher_degree_urls.length > 0 
        ? { L: user.higher_degree_urls.map(url => ({ S: url })) }
        : { NULL: true },
      previous_year_scorecard_url: user.previous_year_scorecard_url ? { S: user.previous_year_scorecard_url } : { NULL: true },
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
      data: authItem,
    };
  } catch (err) {
    console.error('Error fetching user from DynamoDB:', err);
    return { success: false, error: 'Error fetching user' };
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

const deleteUser = async (email) => {
  const authParams = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      email: { S: email },
    },
  };

  const userDataParams = {
    TableName: process.env.USER_DATA_TABLE,
    Key: {
      email: { S: email },
    },
  };

  const userDocsParams = {
    TableName: process.env.USER_DOCS_TABLE,
    Key: {
      email: { S: email },
    },
  };

  try {
    const authCommand = new DeleteItemCommand(authParams);
    const userDataCommand = new DeleteItemCommand(userDataParams);
    const userDocsCommand = new DeleteItemCommand(userDocsParams);
    await ddbClient.send(authCommand);
    await ddbClient.send(userDataCommand);
    await ddbClient.send(userDocsCommand);
    return { success: true, message: 'User deleted successfully' };
  } catch (err) {
    console.error('Error deleting user from DynamoDB:', err);
    return { success: false, message: 'Error deleting user' };
  }
};

const updatePassword = async (email, newPassword) => {
  const params = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      email: { S: email },
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



const getDataFromTable = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: {
      email: { S: key.email },
    },
  };


  try {
    const command = new GetItemCommand(params);
    const result = await ddbClient.send(command);

    if (!result.Item) {
      throw new Error(`No data found for key: ${JSON.stringify(key)}`);
    }

    const item = result.Item;
    return item;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
};

const getUserDataByEmail = async (email) => {
  try {
    const authData = await getDataFromTable(process.env.AUTH_TABLE, { email });
    const userData = await getDataFromTable(process.env.USER_DATA_TABLE, { email });
    const userDocs = await getDataFromTable(process.env.USER_DOCS_TABLE, { email });
    return { authData, userData, userDocs };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Error fetching user details');
  }
};


module.exports = { createUser, getUserByEmail, updateUser, deleteUser, updatePassword, getUserDataByEmail};
