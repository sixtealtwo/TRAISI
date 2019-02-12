using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces
{
	public interface ISurveyRespondentRepository : IRepository<SurveyRespondent>
	{

		Task<PrimaryRespondent> GetPrimaryRespondentForUserAsync(ApplicationUser user);

		Task<SurveyRespondent> GetSubRespondentAsync(int respondentId);

		Task<PrimaryRespondent> CreatePrimaryResponentForUserAsnyc(ApplicationUser user);

		Task<PrimaryRespondent> GetPrimaryRespondentForSurveyAsync(Survey survey);

	}
}