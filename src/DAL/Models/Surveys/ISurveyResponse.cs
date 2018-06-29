using DAL.Models.Questions;
using DAL.Models.ResponseTypes;

namespace DAL.Models.Surveys
{
    public interface ISurveyResponse
    {
        int Id { get; set; }


        QuestionPart QuestionPart { get; set; }

        ResponseValue ResponseValue { get; set; }


    }
}