using System;

namespace DAL.Core
{
    public enum Gender
    {
        None,
        Female,
        Male
    }

    public enum SurveyViewType {
        RespondentView = 0,
        CatiView = 1
    }

    public enum QuestionConditionalType
    {
        IsEqualTo = 0,
        IsNotEqualTo = 1,
        GreaterThan = 2,
        LessThan = 3,
        InBounds = 4,
        InRange = 5,
        IsAnyOf = 6,
        IsAllOf = 7,
        Contains = 8,
        DoesNotContain = 9
    }

}
