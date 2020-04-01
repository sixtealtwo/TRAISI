using System;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    /// <summary>
    /// 
    /// </summary>
    public class DateTimeResponse : ResponseValue, IDateTimeResponse
    {
       public DateTimeOffset Value {get;set;}

    }
}