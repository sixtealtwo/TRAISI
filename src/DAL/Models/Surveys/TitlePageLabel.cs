using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class TitlePageLabel
    {
        public int Id { get; set; }

        public int LabelId { get; set; }

        public Label Label { get; set; }

        public Survey Survey {get;set;}


    }
}