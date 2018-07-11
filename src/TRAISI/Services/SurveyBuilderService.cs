using DAL;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using System;
using System.Collections.Generic;
using System.Linq;
using TRAISI.Helpers;
using TRAISI.SDK;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
{
    public class SurveyBuilderService : ISurveyBuilderService
    {
        private IUnitOfWork _unitOfWork;

        private QuestionTypeManager _questions;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="questions"></param>
        public SurveyBuilderService(IUnitOfWork unitOfWork, QuestionTypeManager questions)
        {
            this._unitOfWork = unitOfWork;
            this._questions = questions;
        }


        /// <summary>
        /// Adds a new view to the specified survey
        /// </summary>
        /// <param name="survey"></param>
        public SurveyView AddSurveyView(Survey survey, string viewName)
        {
            var surveyView = new SurveyView()
            {
                ViewName = viewName
            };
            survey.SurveyViews.Add(surveyView);

            return surveyView;
        }

        /// <summary>
        /// Removes the specified view from the targetted survey
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="id"></param>
        public void RemoveSurveyView(Survey survey, int id)
        {
            survey.SurveyViews.Remove(survey.SurveyViews.Single(s => s.Id == id));
        }

        /// <summary>
        /// Sets a configuration value for the specified question part
        /// </summary>
        /// <param name="questionPart"></param>
        /// <param name="name"></param>
        /// <param name="value"></param>
        public QuestionConfiguration SetQuestionConfiguration(QuestionPart questionPart, string name, string value)
        {
            var configuration = questionPart.QuestionConfigurations.SingleOrDefault(c => c.Name == name);

            if (configuration == null)
            {
                QuestionConfiguration qc = new QuestionConfiguration(){
                    Name = name,
                    Value = value
                };
                questionPart.QuestionConfigurations.Add(qc);
                return qc;
            }
            else
            {
                configuration.Value = value;
                return configuration;
            }

        }


        /// <summary>
        /// Sets a question option value on the specified question part. If langauge is null then the default label is used, otherwise 
        /// the value data is set on the matched langauge label.
        /// </summary>
        /// <param name="questionPart"></param>
        /// <param name="name"></param>
        /// <param name="value"></param>
        /// <param name="language"></param>
        public void SetQuestionOption(QuestionPart questionPart, string name, string value, string language = null)
        {
            var option = questionPart.QuestionOptions.SingleOrDefault(o => o.Name == name);
            if (option != null)
            {
                if (language == null)
                {
                    option.QuestionOptionLabels.First().Label.Value = value;
                }
                else
                {
                    var optionLabel = option.QuestionOptionLabels.FirstOrDefault(v => v.Label.Language == language);
                    if (optionLabel == null)
                    {
                        option.QuestionOptionLabels.Add(new QuestionOptionLabel()
                        {
                            Label = new Label()
                            {
                                Language = language,
                                Value = value,


                            },
                            QuestionOption = option

                        });
                    }
                    else
                    {
                        optionLabel.Label.Value = value;
                    }
                }
            }
            else
            {
                option.QuestionOptionLabels.Add(new QuestionOptionLabel()
                {
                    Label = new Label()
                    {
                        Language = language,
                        Value = value,

                    },
                    QuestionOption = option

                });

                questionPart.QuestionOptions.Add(option);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="part"></param>
        /// <param name="name"></param>
        /// <param name="language"></param>
        public void AddQuestionOption(QuestionPart part, string name, string value, string language = null)
        {
            //check if the option has a value / allows multiple

            var definition = this._questions.QuestionTypeDefinitions.FirstOrDefault(d => d.TypeName == part.QuestionType);
            if (definition != null)
            {
                var hasOption = definition.QuestionOptions.Count(c => c.Key == name);

                if (definition.QuestionOptions.Keys.Contains(name))
                {
                    if (definition.QuestionOptions[name].IsMultipleAllowed)
                    {
                        part.QuestionOptions.Add(new QuestionOption()
                        {
                            Name = name
                        });
                    }
                    else if (part.QuestionOptions.Count(o => o.Name == name) == 0)
                    {
                        part.QuestionOptions.Add(new QuestionOption()
                        {
                            Name = name
                        });
                    }
                    else
                    {
                        throw new InvalidOperationException("Cannot asssign new question option, remove first.");
                    }
                }
                else
                {
                    throw new ArgumentException("Question Option does not exist for this question type.");
                }


            }

        }

        /// <summary>
        /// Removes a set question option from the specified question part
        /// </summary>
        /// <param name="part"></param>
        /// <param name="name"></param>
        /// <param name="language">Null to remove all instances, otherwise remove a specific label</param>
        public void RemoveQuestionOption(QuestionPart part, string name, string language = null)
        {
            var option = part.QuestionOptions.SingleOrDefault(c => c.Name == name);
            if (language == null)
            {
                part.QuestionOptions.Remove(option);
            }
            else
            {
                option.QuestionOptionLabels.Remove(option.QuestionOptionLabels.SingleOrDefault(v => v.Label.Language == language));
            }
        }

        /// <summary>
        /// Removes a configuration value (resets to default) from the specified QuestionPart.
        /// </summary>
        /// <param name="part"></param>
        /// <param name="name"></param>
        public void RemoveQuestionConfiguration(QuestionPart part, string name)
        {
            part.QuestionConfigurations.Remove(part.QuestionConfigurations.SingleOrDefault(c => c.Name == name));
        }

        /// <summary>
        /// Retrieves the list of question configurations associated with this question part. Only values that differ
        /// from default values will be returned (default values are not stored).
        /// </summary>
        /// <param name="questionPart"></param>
        /// <returns></returns>
        public IEnumerable<QuestionConfiguration> GetQuestionConfigurations(QuestionPart questionPart)
        {
            return questionPart.QuestionConfigurations;
        }

        /// <summary>
        /// Returns the set of question options associated with this question part.
        /// </summary>
        /// <param name="questionPart"></param>
        /// <param name="language">Specify a main label language</param>
        /// <returns></returns>
        public IEnumerable<QuestionOption> GetQuestionOptions(QuestionPart questionPart, string language = null)
        {
            return questionPart.QuestionOptions;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="view"></param>
        /// <param name="part"></param>
        /// <param name="position"></param>
        /// <returns></returns>
        public void AddQuestionPart(SurveyView view, QuestionPart part, QuestionTypeDefinition definition, int position = -1)
        {
            if (position >= 0)
            {
                part.Order = position;
                (view.QuestionParts as List<QuestionPart>).Insert(position, part);

            }
            else
            {
                view.QuestionParts.Add(part);
                part.Order = view.QuestionParts.Count - 1;
            }
            return;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="part"></param>
        /// <param name="definition"></param>
        /// <param name="position"></param>
        public void AddQuestionPartChild(QuestionPart part, QuestionTypeDefinition definition, int position)
        {
            part.Order = position;
            part.QuestionType = definition.TypeName;
            part.QuestionPartChildren.Add(part);
        }

        /// <summary>
        /// Sets a survey title for the specified language.
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="title"></param>
        /// <param name="language"></param>
        public void SetSurveyTitle(Survey survey, string title, string language)
        {
            //remove the label if it already exists
            survey.TitleLabel.Remove(survey.TitleLabel.SingleOrDefault(t => t.Language == language));
            
            survey.TitleLabel.Add(new Label()
            {
                Value = title,
                Language = language
            });
        }

    }
}