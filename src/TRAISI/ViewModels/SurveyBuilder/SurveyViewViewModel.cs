using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels;


namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SurveyViewViewModel
    {
        public int Id { get; set; }
				public int SurveyId { get; set; }
				public string ViewName { get; set; }
				public List<QuestionPartViewViewModel> QuestionPartViews {get; set; } 

    }

}
