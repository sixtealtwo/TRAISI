using System.Collections.Generic;

namespace TRAISI.ViewModels
{
    public class QuestionPartViewModel
    {
        public int Id {get;set;}

        public string Label {get ;set;}

        public List<QuestionPartViewModel> QuestionChildren;
    }
}