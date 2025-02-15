import OptionModel from "../models/OptionModel.js";
import { generateUniqueId } from "../../utils/idGenerator.js";

class OptionController {
  static async getOptionsForQuestion(req, res) {
    const { question_id } = req.params;
    try {
      const options = await OptionModel.getOptionsByQuestionId(question_id);
      res.status(200).json(options);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch options" });
    }
  }

  static async createOption(req, res) {
    const { question_id } = req.params;
    const optionData = req.body;
    optionData.option_id = generateUniqueId();
    optionData.question_id = question_id;
    try {
      await OptionModel.createOption(optionData);
      res.status(201).json({ message: "Option created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create the option" });
    }
  }

  static async updateOption(req, res) {
    const { option_id } = req.params;
    const updateData = req.body;
    try {
      await OptionModel.updateOption(option_id, updateData);
      res.status(200).json({ message: "Option updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update the option" });
    }
  }

  static async deleteOption(req, res) {
    const { option_id } = req.params;
    try {
      await OptionModel.deleteOption(option_id);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the option" });
    }
  }
}

export default OptionController;
