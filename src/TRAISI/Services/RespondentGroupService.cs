using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
{
    public class RespondentGroupService : IRespondentGroupService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="group"></param>
        /// <param name="respondent"></param>
        public void AddRespondent(SurveyRespondentGroup group, SubRespondent respondent)
        {
            group.GroupMembers.Add(respondent);
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

    }
}