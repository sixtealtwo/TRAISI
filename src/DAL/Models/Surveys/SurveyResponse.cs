using DAL.Models.Questions;
using DAL.Models.ResponseTypes;

namespace DAL.Models.Surveys
{
    public class SurveyResponse :AuditableEntity, ISurveyResponse
    {
        
        public int Id { get; set; }

        public QuestionPart QuestionPart { get; set; }

        
        public ResponseValue ResponseValue {get;set;}

        public int ResponseValueId {get;set;}





    }
}