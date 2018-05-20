using System.Collections;
using System.Collections.Generic;

namespace TRAISI.SDK
{
    
    public class QuestionManager
    {
        private ICollection<QuestionTypeDefinition> _questionTypeDefinitions;

        public QuestionManager()
        {
            this._questionTypeDefinitions = new LinkedList<QuestionTypeDefinition>();
            
            
        }

        public ICollection<QuestionTypeDefinition> QuestionTypeDefinitions{get;}

    }
}