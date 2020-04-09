using System;
using System.ComponentModel.DataAnnotations;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class StringResponse : ResponseValue, IStringResponse
    {

        public string Value { get; set; }

    }
}