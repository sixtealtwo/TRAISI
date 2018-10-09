using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Surveys;

namespace TRAISI.Services.Interfaces
{
    public interface IRespondentGroupService
    {

		/// <summary>
		/// Add the list of respondents to the respondent group
		/// </summary>
		/// <param name="group"></param>
		/// <param name="respondents"></param>
        void AddRespondentGroupMembers(SurveyRespondentGroup group, List<SubRespondent> respondents);


		/// <summary>
		/// 
		/// </summary>
		/// <param name="group"></param>
		/// <param name="respondent"></param>
		void AddRespondent(SurveyRespondentGroup group, SubRespondent respondent);

    }
}