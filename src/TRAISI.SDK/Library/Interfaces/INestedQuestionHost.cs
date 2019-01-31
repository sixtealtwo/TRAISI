using System.Collections.Generic;

namespace TRAISI.SDK.Library.Interfaces
{
    public interface INestedQuestionHost
    {
		/// <summary>
		/// 
		/// </summary>
         List<NestedQuestionDefinition> ConfigureNestedQuestions();
    }
}