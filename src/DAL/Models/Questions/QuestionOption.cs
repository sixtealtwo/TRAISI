using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Surveys;
using System.Linq;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace DAL.Models.Questions
{
    public class QuestionOption : IQuestionOption
    {
        public int Id { get; set; }


        public string Name { get; set; }


        public ICollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

        public string Description { get; set; }

        public int Order { get; set; }

        public QuestionOption()
        {
            //Values = new HashSet<Label>();
            QuestionOptionLabels = new HashSet<QuestionOptionLabel>();


        }


    }
}