using DAL;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using System.Linq;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
{
    public class SurveyBuilderService : ISurveyBuilderService
    {
        private IUnitOfWork _unitOfWork;
        public SurveyBuilderService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }


        /// <summary>
        /// Adds a new view to the specified survey
        /// </summary>
        /// <param name="survey"></param>
        public void AddSurveyView(Survey survey, string viewName)
        {
            var surveyView = new SurveyView()
            {
                ViewName = viewName
            };
            survey.SurveyViews.Add(surveyView);
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
        public void SetQuestionConfigfuration(QuestionPart questionPart, string name, string value)
        {
            var configuration = questionPart.QuestionConfigurations.SingleOrDefault(c => c.Name == name);

            if (configuration == null)
            {
                questionPart.QuestionConfigurations.Add(new QuestionConfiguration());
            }
            else
            {
                configuration.Value = value;
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
                    option.Values.First().Value = value;
                }
                else
                {
                    var label = option.Values.FirstOrDefault(v => v.Language == language);
                    if (label == null)
                    {
                        option.Values.Add(new Label()
                        {
                            Language = language,
                            Value = value

                        });
                    }
                    else
                    {
                        label.Value = value;
                    }
                }
            }
            else
            {
                option.Values.Add(new Label()
                {
                    Language = language,
                    Value = value

                });
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
                option.Values.Remove(option.Values.SingleOrDefault(v => v.Language == language));
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
    }
}