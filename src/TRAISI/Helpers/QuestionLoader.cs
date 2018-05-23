using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;

namespace TRAISI.Helpers
{
    public class QuestionLoader
    {
        public static ICollection<ISurveyQuestion> Questions { get; private set; }
        
        public QuestionLoader()
        {
            Questions = new List<ISurveyQuestion>();
        }


        /// <summary>
        /// 
        /// </summary>
        private void loadQuestions()
        {
            var all = Assembly
                .GetEntryAssembly()
                .GetReferencedAssemblies()
                .Select(Assembly.Load)
                .SelectMany(x => x.DefinedTypes)
                .Where(type => typeof(ISurveyQuestion).GetTypeInfo().IsAssignableFrom(type.AsType()));  
        }
    }
}