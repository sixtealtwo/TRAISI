using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TRAISI.ViewModels
{
    public class QuestionPartViewLabelViewModel
    {
        public int Id { get; set; }
        public LabelViewModel Label { get; set; }
        public int QuestionPartViewId { get; set; }
    }
}
