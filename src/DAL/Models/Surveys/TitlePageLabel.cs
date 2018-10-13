using DAL.Models.Surveys;
using Newtonsoft.Json;

namespace DAL.Models.Surveys
{
    public class TitlePageLabel: Label
    {
        [JsonIgnore]
        public int Id { get; set; }

        public Survey Survey {get;set;}


    }
}