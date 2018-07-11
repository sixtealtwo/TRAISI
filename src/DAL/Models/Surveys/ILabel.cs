using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    public interface ILabel
    {
        int Id { get; set; }

        string Value { get; set; }

        string Language {get;set;}
    }
}