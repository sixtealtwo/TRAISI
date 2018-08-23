namespace TRAISI.ViewModels.SurveyViewer
{
    /// <summary>
    /// View model for a flattened question object - removes the layered part view / part hierarchy
    /// into a model that represents a single component / question on the viewer end
    /// </summary>
    public class QuestionViewModel
    {
        public int Id {get;set;}

        public string Label {get ;set;}
        
        public string QuestionType { get; set; }
    }
}