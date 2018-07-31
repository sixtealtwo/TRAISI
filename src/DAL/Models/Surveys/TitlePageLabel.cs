using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class TitlePageLabel: Label
    {
        public int Id { get; set; }

        public Survey Survey {get;set;}


    }
}