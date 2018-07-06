using System.Collections.Generic;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public interface IQuestionOption
    {
        int Id { get; set; }


        string Name { get; set; }

        ICollection<Label> Values { get; set; }




    }
}