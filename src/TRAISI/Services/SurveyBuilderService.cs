using DAL;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using DAL.Models.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Helpers;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;
using TRAISI.Services.Interfaces;
using DAL.Core;

namespace TRAISI.Services
{

    /// <summary>
    /// Service for building surveys.
    /// </summary>
    public class SurveyBuilderService : ISurveyBuilderService
    {
        private IUnitOfWork _unitOfWork;

        private IQuestionTypeManager _questions;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="questions"></param>
        public SurveyBuilderService(IUnitOfWork unitOfWork, IQuestionTypeManager questions)
        {
            this._unitOfWork = unitOfWork;
            this._questions = questions;
        }


        /// <summary>
        /// Adds a new view to the specified survey
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="viewName"></param>
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
        public QuestionConfiguration SetQuestionConfiguration(QuestionPart questionPart, string name, object value)
        {
            var configuration = questionPart.QuestionConfigurations.SingleOrDefault(c => c.Name == name);

            if (configuration == null)
            {
                QuestionConfiguration qc = new QuestionConfiguration()
                {
                    Name = name,
                    Value = value.ToString()
                };
                questionPart.QuestionConfigurations.Add(qc);
                return qc;
            }

            configuration.Value = value.ToString();
            return configuration;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="qpv"></param>
        /// <param name="text"></param>
        /// <param name="language"></param>
        public void SetQuestionPartViewLabel(QuestionPartView qpv, string text, string language = null)
        {
            qpv.Labels[language] = new QuestionPartViewLabel()
            {
                Language = language ?? "en",
                Value = text,
                QuestionPartView = qpv
            };


        }

        public void UpdateQuestionPartViewOptions(QuestionPartView qpv, bool isOptional, bool isHousehold, bool isRepeat)
        {
            qpv.isHousehold = isHousehold;
            qpv.isOptional = isOptional;
            qpv.isRepeat = isRepeat;
        }

        public void UpdateQuestionPartName(int surveyId, QuestionPart qp, string newName)
        {
            //name update doesn't require any other updates (with part ID being used for question reference)
            if (qp != null)
            {
                if (this._unitOfWork.Surveys.QuestionNameIsUnique(surveyId, newName, qp.Name))
                {
                    qp.Name = newName;
                }
                else
                {
                    throw new ArgumentException("Question name must be unique.");
                }
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
        public QuestionOption SetQuestionOptionLabel(QuestionPart questionPart, int id, string name, string value, string language = null)
        {
            var option = questionPart.QuestionOptions.SingleOrDefault(o => o.Id == id);
            if (option != null)
            {
                if (language == null)
                {
                    option.QuestionOptionLabels.First().Value = value;
                }
                else
                {
                    var optionLabel = option.QuestionOptionLabels.FirstOrDefault(v => v.Language == language);
                    if (optionLabel == null)
                    {
                        option.QuestionOptionLabels.Add(new QuestionOptionLabel()
                        {
                            Language = language,
                            Value = value,
                            QuestionOption = option
                        });
                    }
                    else
                    {
                        var allLabels = questionPart.QuestionOptions.Where(q => q.Name == name).SelectMany(o => o.QuestionOptionLabels.Where(q => q.Language == language).Select(l => l.Value));
                        if (!allLabels.Contains(value))
                        {
                            optionLabel.Value = value;
                        }
                        else
                        {
                            throw new ArgumentException("Cannot have duplicate options");
                        }
                    }
                }
                return option;
            }
            else
            {
                return this.AddQuestionOption(questionPart, name, value, language);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="part"></param>
        /// <param name="name"></param>
        /// <param name="language"></param>
        public QuestionOption AddQuestionOption(QuestionPart part, string name, string value, string language = null)
        {
            //check if the option has a value / allows multiple

            var definition =
                this._questions.QuestionTypeDefinitions[part.QuestionType];
            if (definition != null)
            {
                var hasOption = definition.QuestionOptions.Count(c => c.Key == name);

                if (definition.QuestionOptions.Keys.Contains(name))
                {
                    var allLabels = part.QuestionOptions.Where(q => q.Name == name).SelectMany(o => o.QuestionOptionLabels.Where(q => q.Language == language).Select(l => l.Value));
                    if (allLabels.Contains(value))
                    {
                        throw new ArgumentException("Cannot have duplicate options");
                    }
                    var newOption = new QuestionOption()
                    {
                        Name = name,
                        Order = part.QuestionOptions.Count(o => o.Name == name),
                        QuestionOptionLabels = new LabelCollection<QuestionOptionLabel>()
                            {
                                new QuestionOptionLabel()
                                {
                                    Language = language ?? "en",
                                    Value = value
                                }
                            }
                    };
                    if (definition.QuestionOptions[name].IsMultipleAllowed)
                    {
                        part.QuestionOptions.Add(newOption);
                    }
                    else if (newOption.Order == 0)
                    {
                        part.QuestionOptions.Add(newOption);
                    }
                    else
                    {
                        throw new InvalidOperationException("Cannot assign new question option, remove first.");
                    }
                    return newOption;
                }
                else
                {
                    throw new ArgumentException("Question Option does not exist for this question type.");
                }
            }
            else
            {
                throw new ArgumentException("Question Type does not exist.");
            }
        }

        /// <summary>
        /// Removes a set question option from the specified question part
        /// </summary>
        /// <param name="part"></param>
        /// <param name="name"></param>
        /// <param name="language">Null to remove all instances, otherwise remove a specific label</param>
        public void RemoveQuestionOption(QuestionPart part, int optionId, string language = null)
        {
            var option = part.QuestionOptions.SingleOrDefault(c => c.Id == optionId);
            bool removed = false;
            if (language == null)
            {
                part.QuestionOptions.Remove(option);
                removed = true;
            }
            else
            {
                option?.QuestionOptionLabels.Remove(
                    option.QuestionOptionLabels.SingleOrDefault(v => v.Language == language));
                if (option?.QuestionOptionLabels.Count == 0)
                {
                    part.QuestionOptions.Remove(option);
                    removed = true;
                }
            }
            //Update order if fully removed
            if (removed)
            {
                foreach (var remainingOption in part.QuestionOptions)
                {
                    if (remainingOption.Order > option.Order)
                    {
                        remainingOption.Order--;
                    }
                }
            }
        }

        public void ReOrderOptions(QuestionPart part, List<QuestionOption> newOrder)
        {
            Dictionary<int, int> newOrderDict = newOrder.ToDictionary(r => r.Id, r => r.Order);
            foreach (var option in part.QuestionOptions)
            {
                if (newOrderDict.ContainsKey(option.Id))
                {
                    option.Order = newOrderDict[option.Id];
                }
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
        /// Adds a page to a survey
        /// </summary>
        /// <param name="view"></param>
        /// <param name="newPage"></param>
        public void AddSurveyPage(SurveyView view, QuestionPartView newPage)
        {
            view.QuestionPartViews.Add(newPage);
            newPage.Order = view.QuestionPartViews.Count - 1;
        }

        /// <summary>
        /// Removes a page from a survey
        /// </summary>
        /// <param name="view"></param>
        /// <param name="pageId"></param>
        public void RemoveSurveyPage(SurveyView view, int pageId)
        {
            List<QuestionPartView> pages = view.QuestionPartViews as List<QuestionPartView>;
            QuestionPartView toDelete = null;
            int pageIndex = Int32.MaxValue;
            for (int i = 0; i < pages.Count; i++)
            {
                if (pages[i].Order > pageIndex)
                {
                    pages[i].Order--;
                }
                else if (pages[i].Id == pageId)
                {
                    toDelete = pages[i];
                    pageIndex = toDelete.Order;
                }
            }

            //remove children question part views (to trigger question part deletes)
            var pageData = this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructure(toDelete.Id);
            var childIds = pageData.QuestionPartViewChildren.Select(q => q.Id).ToList();
            childIds.ForEach(id => this.RemoveQuestionPartView(pageData, id, false));
            view.QuestionPartViews.Remove(toDelete);
        }

        public void ReOrderPages(SurveyView view, List<QuestionPartView> newOrder)
        {
            Dictionary<int, int> newOrderDict = newOrder.ToDictionary(r => r.Id, r => r.Order);
            foreach (var qpartView in view.QuestionPartViews)
            {
                qpartView.Order = newOrderDict[qpartView.Id];
            }
        }

        /// <summary>
        /// Adds a question to a page/question part
        /// </summary>
        /// <param name="view"></param>
        /// <param name="newPage"></param>
        public void AddQuestionPartView(QuestionPartView ParentQuestionPartView, QuestionPartView ChildQuestionPartView)
        {
            //update orders for existing questions
            foreach (var question in ParentQuestionPartView.QuestionPartViewChildren)
            {
                if (question.Order >= ChildQuestionPartView.Order)
                {
                    question.Order++;
                }
            }
            ParentQuestionPartView.QuestionPartViewChildren.Add(ChildQuestionPartView);
        }

        /// <summary>
        /// Removes a question/question part from a survey
        /// </summary>
        /// <param name="questionPartView"></param>
        /// <param name="childQuestionPartViewId"></param>
        public void RemoveQuestionPartView(QuestionPartView questionPartView, int childQuestionPartViewId, bool transfer)
        {
            if (questionPartView != null)
            {
                var childQuestions = questionPartView.QuestionPartViewChildren.OrderBy(q => q.Order);
                QuestionPartView toDelete = null;
                int questionIndex = Int32.MaxValue;
                foreach (var childQuestion in childQuestions)
                {
                    if (childQuestion.Order > questionIndex)
                    {
                        childQuestion.Order--;
                    }
                    else if (childQuestion.Id == childQuestionPartViewId)
                    {
                        toDelete = childQuestion;
                        questionIndex = toDelete.Order;
                    }
                }
                questionPartView.QuestionPartViewChildren.Remove(toDelete);
                //delete question part if no other part and not a transfer
                if (toDelete.QuestionPart != null && !transfer)
                {
                    int priorParentViewCount = this._unitOfWork.QuestionParts.GetNumberOfParentViews(toDelete.QuestionPart.Id);
                    if (priorParentViewCount == 1)
                    {
                        this._unitOfWork.QuestionParts.Remove(toDelete.QuestionPart);
                    }
                }
                else if (toDelete.QuestionPart == null && !transfer)
                {
                    //repeat for children (calling recursively)
                    var deleteStructure = this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructure(toDelete.Id);
                    var children = deleteStructure.QuestionPartViewChildren.ToList();
                    foreach (var child in children)
                    {
                        this.RemoveQuestionPartView(toDelete, child.Id, false);
                    }
                }
            }
        }

        /// <summary>
        /// Reorder question within question part
        /// </summary>
        /// <param name="questionPartView"></param>
        /// <param name="newOrder"></param>
        public void ReOrderQuestions(QuestionPartView questionPartView, List<QuestionPartView> newOrder, int questionPartViewMovedId)
        {
            Dictionary<int, int> newOrderDict = newOrder.ToDictionary(r => r.Id, r => r.Order);
            foreach (var qpartView in questionPartView.QuestionPartViewChildren)
            {
                qpartView.Order = newOrderDict[qpartView.Id];
            }
        }

        /// <summary>
        /// Cleans up conditionals, removing any that are invalid (source question now after original)
        /// </summary>
        /// <param name="modifiedViews"></param>
        public void ValidateConditionals(SurveyView structure, int questionPartViewMovedId)
        {
            List<int> questionPartIdsBefore = new List<int>();
            List<int> questionPartIdsAfter = new List<int>();

            int questionPartId = 0;

            bool foundQuestion = false;

            structure.QuestionPartViews.OrderBy(q => q.Order).ToList().ForEach(page => {
                page.QuestionPartViewChildren.OrderBy(q => q.Order).ToList().ForEach(firstLayerQuestion => {
                    if (firstLayerQuestion.QuestionPart != null)
                    {
                        if (firstLayerQuestion.Id == questionPartViewMovedId)
                        {
                            foundQuestion = true;
                            questionPartId = firstLayerQuestion.QuestionPart.Id;
                        }
                        else
                        {
                            if (!foundQuestion)
                            {
                                questionPartIdsBefore.Add(firstLayerQuestion.QuestionPart.Id);
                            }
                            else
                            {
                                questionPartIdsAfter.Add(firstLayerQuestion.QuestionPart.Id);
                            }
                        }
                    }
                    else
                    {
                        firstLayerQuestion.QuestionPartViewChildren.OrderBy(q => q.Order).ToList().ForEach(secondLayerQuestion => {
                            if (secondLayerQuestion.Id == questionPartViewMovedId)
                            {
                                foundQuestion = true;
                                questionPartId = secondLayerQuestion.QuestionPart.Id;
                            }
                            else
                            {
                                if (!foundQuestion)
                                {
                                    questionPartIdsBefore.Add(secondLayerQuestion.QuestionPart.Id);
                                }
                                else
                                {
                                    questionPartIdsAfter.Add(secondLayerQuestion.QuestionPart.Id);
                                }
                            }
                        });
                    }
                });
            });

            // call repository functions to remove conditionals that don't belong for the specific question
            this._unitOfWork.QuestionConditionals.ValidateSourceConditionals(questionPartId, questionPartIdsAfter);
            this._unitOfWork.QuestionOptionConditionals.ValidateSourceConditionals(questionPartId, questionPartIdsAfter);
            this._unitOfWork.QuestionConditionals.ValidateTargetConditionals(questionPartId, questionPartIdsBefore);
            this._unitOfWork.QuestionOptionConditionals.ValidateTargetConditionals(questionPartId, questionPartIdsBefore);
        }

        /// <summary>
        /// Adds a question part to the specified SurveyView - this creates a new QuestionPartView from the part
        /// </summary>
        /// <param name="view"></param>
        /// <param name="part"></param>
        /// <param name="position">0-index order, position of the qustion</param>
        /// <returns>A reference to the created QuestionPartView</returns>
        public QuestionPartView AddQuestionPart(SurveyView view, QuestionPart part, QuestionTypeDefinition definition,
            int position = -1)
        {
            QuestionPartView questionPartView = new QuestionPartView
            {
                QuestionPart = part
            };
            if (position >= 0)
            {
                questionPartView.Order = position;
                (view.QuestionPartViews as List<QuestionPartView>)?.Insert(position, questionPartView);
            }
            else
            {
                (view.QuestionPartViews as List<QuestionPartView>)?.Add(questionPartView);
                questionPartView.Order = view.QuestionPartViews.Count - 1;
            }

            return questionPartView;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="part"></param>
        /// <param name="definition"></param>
        public void AddQuestionPartChild(QuestionPart part, QuestionTypeDefinition definition)
        {
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
            survey.TitleLabels[language] = new TitlePageLabel
            {
                Language = language,
                Value = title
            };
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="view"></param>
        /// <param name="part"></param>
        /// <param name="definition"></param>
        /// <param name="position"></param>
        public QuestionPartView AddQuestion(SurveyView view, QuestionTypeDefinition definition, int position = -1)
        {
            QuestionPartView qpv = new QuestionPartView();
            qpv.QuestionPart = new QuestionPart()
            {
                QuestionType = definition.TypeName
            };
            if (position < 0)
            {
                view.QuestionPartViews.Add(qpv);
            }
            else
            {
                ((List<QuestionPartView>)view.QuestionPartViews).Insert(position, qpv);
            }

            //add more question part views
            if (definition.QuestionPartSlots.Count > 0)
            {
                foreach (var slot in definition.QuestionPartSlots)
                {
                    var questionSlot = new QuestionPartView();
                    questionSlot.ParentView = qpv;
                    questionSlot.QuestionPart = new QuestionPart()
                    {
                        QuestionType = definition.TypeName
                    };
                    qpv.QuestionPartViewChildren.Add(questionSlot);
                }
            }

            return qpv;
        }

        public void SetQuestionConditionals(QuestionPart question, List<QuestionConditional> conditionals)
        {
            List<QuestionConditional> newSource = new List<QuestionConditional>();
            List<QuestionConditional> updateSource = new List<QuestionConditional>();
            List<QuestionConditional> newTarget = new List<QuestionConditional>();
            List<QuestionConditional> updateTarget = new List<QuestionConditional>();

            conditionals.ForEach(conditional => {
                if (conditional.SourceQuestionId == question.Id)
                {
                    if (conditional.Id == 0)
                    {
                        newSource.Add(conditional);
                    }
                    else
                    {
                        updateSource.Add(conditional);
                    }
                }
                else if (conditional.TargetQuestionId == question.Id)
                {
                    if (conditional.Id == 0)
                    {
                        newTarget.Add(conditional);
                    }
                    else
                    {
                        updateTarget.Add(conditional);
                    }
                }
            });

            this._unitOfWork.QuestionConditionals.DeleteSourceConditionals(question.Id, updateSource.Select(c => c.Id).ToList());
            this._unitOfWork.QuestionConditionals.DeleteTargetConditionals(question.Id, updateTarget.Select(c => c.Id).ToList());

            this._unitOfWork.QuestionConditionals.AddRange(newSource);
            this._unitOfWork.QuestionConditionals.AddRange(newTarget);
            this._unitOfWork.QuestionConditionals.UpdateRange(updateSource);
            this._unitOfWork.QuestionConditionals.UpdateRange(updateTarget);
        }

        public void SetQuestionOptionConditionals(QuestionPart question, List<QuestionOptionConditional> conditionals)
        {
            List<QuestionOptionConditional> newSource = new List<QuestionOptionConditional>();
            List<QuestionOptionConditional> updateSource = new List<QuestionOptionConditional>();
            List<QuestionOptionConditional> newTarget = new List<QuestionOptionConditional>();
            List<QuestionOptionConditional> updateTarget = new List<QuestionOptionConditional>();

            conditionals.ForEach(conditional => {
                if (conditional.SourceQuestionId == question.Id)
                {
                    if (conditional.Id == 0)
                    {
                        newSource.Add(conditional);
                    }
                    else
                    {
                        updateSource.Add(conditional);
                    }
                }
                else
                {
                    if (conditional.Id == 0)
                    {
                        newTarget.Add(conditional);
                    }
                    else
                    {
                        updateTarget.Add(conditional);
                    }
                }
            });

            this._unitOfWork.QuestionOptionConditionals.DeleteSourceConditionals(question.Id, updateSource.Select(c => c.Id).ToList());
            this._unitOfWork.QuestionOptionConditionals.DeleteTargetConditionals(question.Id, updateTarget.Select(c => c.Id).ToList());

            this._unitOfWork.QuestionOptionConditionals.AddRange(newSource);
            this._unitOfWork.QuestionOptionConditionals.AddRange(newTarget);
            this._unitOfWork.QuestionOptionConditionals.UpdateRange(updateSource);
            this._unitOfWork.QuestionOptionConditionals.UpdateRange(updateTarget);
        }

        public List<QuestionPartView> GetPageStructureWithOptions(int surveyId, string surveyViewName)
        {
            return this._unitOfWork.SurveyViews.GetSurveyViewQuestionAndOptionStructure(surveyId, surveyViewName).QuestionPartViews.OrderBy(q => q.Order).ToList();
        }
    }
}