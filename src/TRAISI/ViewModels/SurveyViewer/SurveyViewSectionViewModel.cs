using System.Collections.Generic;
using TRAISI.Data.Models.Questions;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewSectionViewModel
    {
        public int Id { get; set; }

        public int Order { get; set; }
        public List<QuestionViewModel> Questions { get; set; }

        public string Label { get; set; }

        public string Icon { get; set; }

        public bool IsHousehold {get;set;}

        public int RepeatSource { get; set; }

        public bool IsRepeat { get; set; }

		public bool IsMultiView {get;set;}

        public List<QuestionConditionalOperator> Conditionals {get;set;}
    }
}