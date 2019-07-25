using System.Collections.Generic;
using DAL.Models.Questions;
using DAL.Models.ResponseTypes;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.Surveys
{
    public class SurveyResponse : AuditableEntity, ISurveyResponse, IResponseType
    {
        public int Id { get; set; }

        public QuestionPart QuestionPart { get; set; }

        public List<ResponseValue> ResponseValues { get; set; }

        public int Repeat { get; set; }

        public SurveyRespondent Respondent { get; set; }

        public SurveyAccessRecord SurveyAccessRecord { get; set; }

        public SurveyResponse()
        {
            this.ResponseValues = new List<ResponseValue>();
        }


    }
}