using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.Surveys;
using TRAISI.Services.Interfaces;

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

        public void RemoveRespondent(SurveyRespondentGroup group, int respondentId)
        {
            var index = group.GroupMembers.FindIndex(r => r.Id == respondentId);
            group.GroupMembers.RemoveAt(index);

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