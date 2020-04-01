using System.Collections.Generic;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.ResponseTypes;

namespace TRAISI.Data.Models.Surveys
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