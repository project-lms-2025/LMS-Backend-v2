import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "../../config/dynamoDB";

class EnrollmentModel {
  static async JoinCourse(student_id, course_id) {
    const params = {
      TableName: process.env.STUDENT_COURSES_TABLE,
      Item: marshall({
        student_id,
        course_id,
        enrollment_date: new Date().toISOString(),
      }),
    };

    try {
      const command = new PutItemCommand(params);
      const data = await ddbClient.send(command);
      return data;
    } catch (error) {
      console.error("Error enrolling student in course:", error);
      throw error;
    }
  }

  static async JoinBatch(student_id, batch_id){
    const params = {
        TableName: process.env.STUDENT_BATCHES_TABLE,
        Item: marshall({
            student_id,
            batch_id,
            enrollment_date: new Date().toISOString(),
        }),
    };

    try {
        const command = new PutItemCommand(params);
        const data = await ddbClient.send(command);
        return data;
    } catch (error) {
        console.error("Error enrolling student in batch:", error);
        throw error;
    }
  }
}


export default EnrollmentModel;
