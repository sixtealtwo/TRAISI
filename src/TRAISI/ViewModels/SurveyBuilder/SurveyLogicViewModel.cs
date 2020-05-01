using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SurveyLogicViewModel
    {
        public int Id { get; set; } = 0;

        public string Message { get; set; }

        public List<SurveyLogicViewModel> Rules { get; set; }

        public string Field { get; set; }

        public int FieldId { get; set; }

        public SurveyLogicOperator Operator { get; set; }

        public string Value { get; set; }
    }

}