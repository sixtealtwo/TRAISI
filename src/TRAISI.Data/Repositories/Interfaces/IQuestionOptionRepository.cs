using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Data.Repositories.Interfaces
{
    public interface IQuestionOptionRepository  : IRepository<QuestionOption> {

	    Task<IEnumerable<QuestionOption>> GetQuestionOptionsFullAsync(int questionId);

        Task<IEnumerable<QuestionOptionConditional>> GetQuestionOptionConditionalsAsync(int optionId);
    }
}