import OptionModel from "../models/OptionModel.js";

class OptionController {
  static async getOptionsForQuestion(req, res) {
    const { question_id } = req.params;
    try {
      const options = await OptionModel.getOptionsByQuestionId(question_id);
      return res.status(200).json({
        success: true,
        message: "Fetched options for the question successfully.",
        data: options,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch options.",
        error: error.message,
      });
    }
  }

  static async createOption(req, res) {
    const { question_id } = req.params;
    const optionData = req.body;
    try {
      await OptionModel.createOption(question_id, optionData);
      return res.status(201).json({
        success: true,
        message: "Option created successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create the option.",
        error: error.message,
      });
    }
  }

  static async updateOption(req, res) {
    const { option_id } = req.params;
    const updateData = req.body;
    try {
      await OptionModel.updateOption(option_id, updateData);
      return res.status(200).json({
        success: true,
        message: "Option updated successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update the option.",
        error: error.message,
      });
    }
  }

  static async deleteOption(req, res) {
    const { option_id } = req.params;
    try {
      await OptionModel.deleteOption(option_id);
      return res.status(200).json({
        success: true,
        message: "Option deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete the option.",
        error: error.message,
      });
    }
  }
}

export default OptionController;
