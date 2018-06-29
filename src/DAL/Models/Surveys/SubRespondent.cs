namespace DAL.Models.Surveys
{
    /// <summary>
    /// Sub Respondent type, associated with another primary respondent
    /// </summary>
    public class SubRespondent : ISurveyRespondent
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public ISurveyRespondentGroup SurveyRespondentGroup { get; set; }
    }
}