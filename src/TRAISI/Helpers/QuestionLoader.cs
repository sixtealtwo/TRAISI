using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TRAISI.SDK;

namespace TRAISI.Helpers
{
    public class QuestionLoader
    {
        public static ICollection<IQuestion> Questions { get; private set; }
        
        public QuestionLoader()
        {
            Questions = new List<IQuestion>();
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
                .Where(type => typeof(IQuestion).GetTypeInfo().IsAssignableFrom(type.AsType()));  
        }
    }
}