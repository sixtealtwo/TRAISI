using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

    public class TextQuestionValidator<T> : ResponseValidator<T>
    {
        public TextQuestionValidator()
        {
        }

        public override bool ValidateResponse(T data)
        {
            throw new System.NotImplementedException();
        }
    }
}