using System.Collections.Generic;
using TRAISI.SDK.Enums;
namespace TRAISI.SDK.Interfaces
{
    public interface ISurveyQuestion
    {
        string TypeName { get; }

        string Icon { get; }

        QuestionIconType IconType { get; }

    }
}