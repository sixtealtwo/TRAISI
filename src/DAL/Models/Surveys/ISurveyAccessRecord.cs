using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    public interface ISurveyAccessRecord
    {
        int Id { get; set; }
        string QueryParams { get; set; }
    }
}