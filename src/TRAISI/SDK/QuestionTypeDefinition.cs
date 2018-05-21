using System;
using System.IO;

namespace TRAISI.SDK
{
    /// <summary>
    /// Contains the definition for a specific question type - path location and other meta info.
    /// </summary>
    public class QuestionTypeDefinition
    {
        public string TypeName{get;set;}

        public DirectoryInfo Location{get;set;}

        public Type Type{get;}

        public QuestionTypeDefinition(Type type)
        {
            this.Type = type;
            
        }

        
    }
}