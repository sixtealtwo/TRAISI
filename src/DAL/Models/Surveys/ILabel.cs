using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    public interface ILabel
    {
        string Value { get; set; }

        string Language { get; set; }
    }
}