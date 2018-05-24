using TRAISI.ClientApp.question_definitions.map_question;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Questions;

namespace TRAISI.ClientApp.question_definitions.map_other_question
{

    /// <summary>
    /// An extension to the Map Question that includes a question part slot
    /// </summary>
    public class MapOtherQuestion : MapQuestion
    {
        public new string TypeName => "Map Other";

        public new string Icon
        {
            get => "Map";
        }

		[QuestionPartSlot(SlotName="Other Select",SlotQuestionType=QuestionResponseType.OptionList)]
		public ISurveyQuestion SelectOtherQuestionSlot{get;set;}



    }

}
