using System;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class QuestionPartSlotAttribute: Attribute
    {

        /// <summary>
        /// The name of the question slot for the question builder
        /// </summary>
        /// <returns></returns>

        public string SlotName { get; set; }


        /// <summary>
        /// Limits the Slot Question Type when this is set
        /// </summary>
        /// <returns></returns>
        public Type SlotQuestionType {get;set;}


        public QuestionPartSlotAttribute()
        {

        }

    }
}