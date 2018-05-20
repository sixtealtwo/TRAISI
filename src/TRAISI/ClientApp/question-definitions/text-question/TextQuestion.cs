
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

    [SurveyQuestion]
    public class TextQuestion : ISurveyQuestion
    {
        public string TypeName
        {
            get => "Text";
        }

        [QuestionParameter(typeof(int),
        ParameterName="Max Length",
        ParameterDescription="Max number of characters")]
        public int MaxLength = 255;


    }



}