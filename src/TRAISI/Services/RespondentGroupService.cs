using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.Surveys;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels.SurveyViewer;
using System.Linq;
namespace TRAISI.Services
{
    public class RespondentGroupService : IRespondentGroupService
    {
        private IUnitOfWork _unitOfWork;

        ///
        public RespondentGroupService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="group"></param>
        /// <param name="respondent"></param>
        public void AddRespondent(SurveyRespondentGroup group, SubRespondent respondent)
        {
            respondent.SurveyRespondentGroup = group;
            group.GroupMembers.Add(respondent);

        }


        public async void RemoveRespondent(SurveyRespondentGroup group, SurveyRespondent respondent)

        {
            var responses = await this._unitOfWork.SurveyResponses.ListQuestionResponsesForRespondentAsync(respondent.Id, "");

            this._unitOfWork.SurveyResponses.RemoveRange(responses);

            group.GroupMembers.Remove(respondent);

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentModel"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> UpdateRespondent(SurveyRespondentViewModel respondentModel, ApplicationUser user)
        {
            if (respondentModel.Id >= 0) {
                var respondent = await this._unitOfWork.SurveyRespondents.GetSubRespondentAsync(respondentModel.Id);

                if (respondent == null) {
                    return false;
                }

                respondent.Relationship = respondentModel.Relationship;
                respondent.Name = respondentModel.Name;

                return true;
            }
            else if (respondentModel.Id == -1) {

                var primary = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);

                primary.Name = respondentModel.Name;


                return true;
            }


            return false;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="group"></param>
        /// <param name="respondents"></param>
        public void AddRespondentGroupMembers(SurveyRespondentGroup group, List<SubRespondent> respondents)
        {

            group.GroupMembers.Clear();

            group.GroupMembers.AddRange(respondents);


        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<SurveyRespondentGroup> GetSurveyRespondentGroupForUser(ApplicationUser user)
        {
            var primary = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);

            if (primary != null) {
                if (primary.SurveyRespondentGroup == null) {
                    primary.SurveyRespondentGroup = new SurveyRespondentGroup();

                }
                return primary.SurveyRespondentGroup;
            }
            else {
                return null;
            }
        }

    }
}