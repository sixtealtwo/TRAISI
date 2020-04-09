using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    /// <summary>
    /// 
    /// </summary>
    public class DateTimeResponse : ResponseValue, IDateTimeResponse
    {
       public DateTime Value {get;set;}

    }
}