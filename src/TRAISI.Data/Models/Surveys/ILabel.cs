using TRAISI.Data.Models.Interfaces;

namespace TRAISI.Data.Models.Surveys
{
    public interface ILabel
    {
        string Value { get; set; }

        string Language { get; set; }
    }
}