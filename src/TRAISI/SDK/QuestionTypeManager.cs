using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK {

    public class QuestionTypeManager : IQuestionTypeManager {
        private ICollection<QuestionTypeDefinition> _questionTypeDefinitions;

        public QuestionTypeManager () {
            _questionTypeDefinitions = new LinkedList<QuestionTypeDefinition> ();
            LoadQuestionTypeDefinitions ();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attribute"></param>
        private void CreateQuestionTypeDefinition (Type questionType, Attribute attribute) {
            QuestionTypeDefinitions.Add (new QuestionTypeDefinition (questionType));
        }

        public ICollection<QuestionTypeDefinition> QuestionTypeDefinitions { get; }

        /// <summary>
        /// 
        /// </summary>
        public void LoadQuestionTypeDefinitions (string loadFrom = ".") {
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