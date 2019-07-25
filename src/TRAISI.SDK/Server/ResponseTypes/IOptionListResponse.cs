using System.Collections.Generic;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface IOptionListResponse : IResponseType
    {
        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        ICollection<IResponseType> OptionValues { get; set; }
    }
}