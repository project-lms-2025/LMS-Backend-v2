import { marshall } from '@aws-sdk/util-dynamodb';
import ddbClient from '../../config/dynamoDB.js';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

class StudentAnswerModel {
  static async submitAnswers(test_id, student_id, answers) {
    const params = {
      TableName: process.env.STUDENT_ANSWERS,
      Item: marshall({ test_id, student_id, answers }),
    };

    try {
      const command = new PutItemCommand(params);
      await ddbClient.send(command);
      return true;
    } catch (err) {
      console.error("Error submitting answers:", err);
      throw new Error("Error submitting answers");
    }
  }
}

export default StudentAnswerModel;
