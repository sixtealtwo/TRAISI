
using TRAISI.SDK.Annotations;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

    [SurveyQuestion]
    public class TextQuestion : ISurveyQuestion
    {
        public string TypeName { 
            get => "Text";
            }

            
    [QuestionPart("Sub Part")]
    public string question;
    }

}