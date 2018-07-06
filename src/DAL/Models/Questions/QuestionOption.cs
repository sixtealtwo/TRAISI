using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionOption : IQuestionOption
    {
        public int Id { get; set; }


        public string Name {get;set;}

        [NotMapped]
        public ICollection<Label> Values { get; set; }

        public ICollection<QuestionOptionLabels> QuestionOptionLabels { get; set; }

        public string Description { get; set; }


        public QuestionOption()
        {
            Values = new HashSet<Label>();
            QuestionOptionLabels = new HashSet<QuestionOptionLabels>();
        }



    }
}