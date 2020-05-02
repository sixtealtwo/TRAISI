using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Traisi.Data.Models.Surveys;
using Newtonsoft.Json.Linq;
using Traisi.Sdk.Library.ResponseTypes;
using System.Linq;
namespace Traisi.Data.Models.ResponseTypes
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