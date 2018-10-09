namespace DAL.Models.Surveys
{
    public  abstract class SurveyRespondent : ISurveyRespondent
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public SurveyRespondentGroup SurveyRespondentGroup { get; set; }

    }
}