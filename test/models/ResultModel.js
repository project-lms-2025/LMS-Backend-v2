import connection from "../../config/database.js"; 

class ResultModel {
  static async getResultsByStudentId(student_id) {
    const queryStr = `
      SELECT 
        r.response_id,
        r.student_id,
        r.question_id,
        q.test_id,
        q.question_text,
        q.question_type,
        r.selected_option_id,
        r.given_ans_text,
        o.option_id,
        o.is_correct,
        q.positive_marks,
        q.negative_marks
      FROM 
        student_response2 r
      JOIN 
        questions q ON r.question_id = q.question_id
      LEFT JOIN 
        options o ON r.selected_option_id = o.option_id
      WHERE
        r.student_id = ?;
    `;

    try {
      const [rows] = await connection.query(queryStr, [student_id]);
      return rows;
    } catch (err) {
      throw new Error("Error getting results for the student");
    }
  }

  static async calculateResult(student_id) {
    const results = await this.getResultsByStudentId(student_id);
    let totalPositiveMarks = 0;
    let totalNegativeMarks = 0;

    results.forEach((result) => {
      const { is_correct, positive_marks, negative_marks } = result;
      if (is_correct) {
        totalPositiveMarks += positive_marks;
      } else {
        totalNegativeMarks -= negative_marks;
      }
    });

    const finalScore = totalPositiveMarks - totalNegativeMarks;

    return {
      student_id,
      totalPositiveMarks,
      totalNegativeMarks,
      finalScore,
    };
  }

  static async getDetailedResult(student_id) {
    const results = await this.getResultsByStudentId(student_id);
    return results.map((result) => {
      const { 
        response_id, student_id, question_id, test_id, question_text, 
        question_type, selected_option_id, given_ans_text, option_id, 
        is_correct, positive_marks, negative_marks 
      } = result;

      return {
        response_id,
        student_id,
        question_id,
        test_id,
        question_text,
        question_type,
        selected_option_id,
        given_ans_text,
        option_id,
        is_correct,
        positive_marks,
        negative_marks,
      };
    });
  }
}

export default ResultModel;
