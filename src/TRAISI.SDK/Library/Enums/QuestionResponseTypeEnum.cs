using System;

namespace TRAISI.SDK.Enums
{
    /// <summary>
    /// Enum specifying the type of data that this question type will save in the survey
    /// </summary>
    public enum QuestionResponseType {
        
        String,
        Boolean,
        Integer,
        Decimal,
        Location,
        Json,
        OptionList,
        DateTime
    }

}