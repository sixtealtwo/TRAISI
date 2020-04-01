using System;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public enum ResponseTypes
    {

        StringResponse = 1,
        NumberResponse = 2,
        LocationResponse = 3,
        OptionListResponse = 4,
        JsonResponse = 5,
        TimelineResponse = 6,
        DateTimeResponse = 7,
        OptionSelectResponse = 8,


    }
}