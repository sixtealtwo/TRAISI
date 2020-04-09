using TRAISI.Data.Models.Surveys;
using Newtonsoft.Json;

namespace TRAISI.Data.Models.Surveys
{
    public class TitlePageLabel: Label
    {
        [JsonIgnore]
        public int Id { get; set; }

        public Survey Survey {get;set;}


    }
}