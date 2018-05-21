using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using TRAISI.SDK.Attributes;

namespace TRAISI.SDK {

    public static class QuestionTypeManager {
        private static ICollection<QuestionTypeDefinition> _questionTypeDefinitions;

        static QuestionTypeManager () {
            _questionTypeDefinitions = new LinkedList<QuestionTypeDefinition> ();
            LoadQuestionTypeDefinitions ();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attribute"></param>
        private static void CreateQuestionTypeDefinition (Type questionType, Attribute attribute) {
            QuestionTypeDefinitions.Add (new QuestionTypeDefinition (questionType));
        }

        public static ICollection<QuestionTypeDefinition> QuestionTypeDefinitions { get; }

        /// <summary>
        /// 
        /// </summary>
        public static void LoadQuestionTypeDefinitions (string loadFrom = ".") {
            Assembly[] assemblies = AppDomain.CurrentDomain.GetAssemblies ();

            foreach (var assembly in assemblies) {
                Type[] types = assembly.GetTypes ();
                foreach (var type in types) {

                    var e = type.GetCustomAttributes (typeof (SurveyQuestionAttribute));

                    foreach (var attribute in e) {
                        if (attribute.GetType () == typeof (SurveyQuestionAttribute)) {
                            CreateQuestionTypeDefinition (type, attribute);
                        }
                    }

                }
            }

        }

    }
}