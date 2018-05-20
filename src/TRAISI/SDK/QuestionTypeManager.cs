using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace TRAISI.SDK
{
    
    public static class QuestionTypeManager
    {
        private static ICollection<QuestionTypeDefinition> _questionTypeDefinitions;

        static QuestionTypeManager()
        {
            _questionTypeDefinitions = new LinkedList<QuestionTypeDefinition>();
            LoadQuestionTypeDefinitions();
            
            
        }

        public static ICollection<QuestionTypeDefinition> QuestionTypeDefinitions{get;}

        /// <summary>
        /// 
        /// </summary>
        public static void LoadQuestionTypeDefinitions(string loadFrom = ".")
        {
            var current = new DirectoryInfo(Directory.GetCurrentDirectory());

            var directories = current.GetDirectories();
            
            foreach(var directory in directories)
            {
                Console.WriteLine(directory);
            }


        }

    }
}