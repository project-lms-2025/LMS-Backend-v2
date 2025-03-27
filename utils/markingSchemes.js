// markingSchemes.js

const markingSchemes = {
    GATE: {
        MCQ: (option_id, correct_option_id, positive_marks, negative_marks) => {
            if (option_id === correct_option_id) {
                return positive_marks;
            } else {
                return -negative_marks;
            }
        },
        MSQ: (option_id, correct_option_id, positive_marks, negative_marks) => {
            if (option_id === correct_option_id) {
                return positive_marks;
            } else {
                return -negative_marks;
            }
        },
        NAT: (response_text, option_text, positive_marks, negative_marks) => {
            if (response_text === option_text) {
                return positive_marks;
            } else {
                return -negative_marks;
            }
        }
    },
    JEE: {
        MCQ: (option_id, correct_option_id, positive_marks, negative_marks) => {
            if (option_id === correct_option_id) {
                return positive_marks;
            } else {
                return -negative_marks;
            }
        },
        MSQ: (selected_option_ids, correct_option_ids, positive_marks, negative_marks, partial_marks = 1) => {
            let score = 0;
            const selectedOptions = selected_option_ids.split('_');
            const correctOptions = correct_option_ids.split('_');

            const correctCount = selectedOptions.filter(option => correctOptions.includes(option)).length;
            const incorrectCount = selectedOptions.length - correctCount;

            score += correctCount * positive_marks;
            score -= incorrectCount * partial_marks;

            return score;
        },
        NAT: (response_text, option_text, positive_marks, negative_marks) => {
            if (response_text === option_text) {
                return positive_marks;
            } else {
                return -negative_marks;
            }
        }
    }
};

export default markingSchemes;
