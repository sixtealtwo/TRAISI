using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.Data.Repositories.Interfaces
{
	public interface ISurveyRespondentRepository : IRepository<SurveyRespondent>
	{

		Task<PrimaryRespondent> GetPrimaryRespondentForUserAsync(ApplicationUser user);

		Task<SurveyRespondent> GetSubRespondentAsync(int respondentId);

		Task<PrimaryRespondent> CreatePrimaryResponentForUserAsnyc(ApplicationUser user);

		Task<PrimaryRespondent> GetPrimaryRespondentForSurveyAsync(Survey survey);

		Task<SurveyRespondent> GetSurveyRespondentAsync(int respondentId);

		Task<PrimaryRespondent> GetPrimaryRespondentForSurveyAndTraisiUserAsync(TraisiUser user, Survey survey);

	}
}