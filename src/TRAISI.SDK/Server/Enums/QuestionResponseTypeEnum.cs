using System;

namespace Traisi.Sdk.Enums
{
    /// <summary>
    /// Enum specifying the type of data that this question type will save in the survey
    /// </summary>
    public enum QuestionResponseType
    {

        String,
        Boolean,
        Integer,
        Decimal,
        Location,
        Json,
        OptionSelect,
        OptionList,
        DateTime,
        Time,
        Path,
        Timeline,
        None
    }

}