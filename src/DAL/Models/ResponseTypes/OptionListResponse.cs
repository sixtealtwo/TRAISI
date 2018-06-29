using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;

namespace DAL.Models.ResponseTypes
{
    public class OptionListResponse : IResponseValue
    {

        public int Id { get; set; }
        /// <summary>
        /// List of all OptionValues
        /// </summary>
        /// <returns></returns>
        ICollection<string> OptionValues { get; set; }

        public SurveyResponse SurveyResponse { get; set; }
    }
}