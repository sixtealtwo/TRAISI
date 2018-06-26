namespace DAL.Models.Surveys
{
    /// <summary>
    /// Primary Respondent type for surveys.
    /// </summary>
    public class PrimaryRespondent : ISurveyRespondent
    {
        public int Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}