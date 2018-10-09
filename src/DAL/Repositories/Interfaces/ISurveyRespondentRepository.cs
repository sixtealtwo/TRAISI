using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;

namespace DAL.Repositories.Interfaces {
	public interface ISurveyRespondentRepository : IRepository<SurveyRespondent> 
    {

		Task<PrimaryRespondent> GetPrimaryRespondentForUserAsync(ApplicationUser user);

        Task<SubRespondent> GetSubRespondentAsync(int respondentId);

        Task <PrimaryRespondent> CreatePrimaryResponentForUserAsnyc(ApplicationUser user);

    }
}