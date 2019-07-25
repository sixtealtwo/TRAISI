using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Questions;

namespace DAL.Repositories.Interfaces
{
    public interface IQuestionOptionRepository  : IRepository<QuestionOption> {

	    Task<IEnumerable<QuestionOption>> GetQuestionOptionsFullAsync(int questionId);

        Task<IEnumerable<QuestionOptionConditional>> GetQuestionOptionConditionalsAsync(int optionId);
    }
}