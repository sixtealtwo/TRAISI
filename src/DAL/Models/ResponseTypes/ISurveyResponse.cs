using DAL.Models.Questions;

namespace DAL.Models.ResponseTypes {
    public interface ISurveyResponse {
        int Id { get; set; }

        QuestionPart Question { get; set; }

    }
}