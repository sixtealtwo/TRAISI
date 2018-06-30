using System.Collections.Generic;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public interface IQuestionOption
    {
        int Id { get; set; }

        string Value { get; set; }

        ICollection<Label> Label { get; set; }




    }
}