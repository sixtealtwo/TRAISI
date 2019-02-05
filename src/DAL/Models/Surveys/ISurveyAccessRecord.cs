using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    public interface ISurveyAccessRecord
    {
        int Id { get; set; }
        string QueryString { get; set; }
    }
}