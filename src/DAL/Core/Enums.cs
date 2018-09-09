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
				OutOfBounds = 5,
				InRange = 6,
				OutsideRange = 7,
        IsAnyOf = 8,
        IsAllOf = 9,
        Contains = 10,
        DoesNotContain = 11
    }

}
