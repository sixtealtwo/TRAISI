using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;
using TRAISI.SDK.Library.ResponseTypes;
using System.Linq;
namespace DAL.Models.ResponseTypes
{
    public class OptionListResponse : ResponseValue, IOptionListResponse
    {

        public ICollection<ResponseValue> OptionResponseValues { get; set; }
        /// <summary>
        /// List of all OptionValues
        /// </summary>
        /// <returns></returns>

        [NotMapped]
        public ICollection<IResponseType> OptionValues
        {
            get => OptionResponseValues.Cast<IResponseType>().ToList();
            set => this.OptionResponseValues = value as ICollection<ResponseValue>;
        }


    }
}