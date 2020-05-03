using System.Collections.Generic;
using Traisi.Data.Models.Surveys;

namespace Traisi.Models.ViewModels 
{
    public class SurveyLogicViewModel
    {
        public int? Id { get; set; } = 0;

        public string Message { get; set; }

        public string Condition {get;set;}

        public List<SurveyLogicViewModel> Rules { get; set; }

        public string Field { get; set; }

        public SurveyLogicOperator Operator { get; set; }

        public string Value { get; set; }
    }

}