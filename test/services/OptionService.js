import OptionModel from '../models/OptionModel.js';

class OptionService {
  static async getOptionsForQuestion(question_id) {
    return await OptionModel.getOptionsByQuestionId(question_id);
  }

  static async createOption(question_id, optionData) {
    return await OptionModel.createOption(question_id, optionData);
  }

  static async updateOption(option_id, updateData) {
    return await OptionModel.updateOption(option_id, updateData);
  }

  static async deleteOption(option_id) {
    return await OptionModel.deleteOption(option_id);
  }
}

export default OptionService;
