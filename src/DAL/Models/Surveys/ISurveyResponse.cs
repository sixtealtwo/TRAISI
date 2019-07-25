using System.Collections.Generic;
using DAL.Models.Questions;
using DAL.Models.ResponseTypes;

namespace DAL.Models.Surveys
{
    public interface ISurveyResponse
    {
        int Id { get; set; }

        int Repeat { get; set; }

        QuestionPart QuestionPart { get; set; }

        List<ResponseValue> ResponseValues { get; set; }

        SurveyRespondent Respondent { get; set; }
    }
}