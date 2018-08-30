using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models.Questions;

namespace DAL.Repositories.Interfaces
{
    public interface IQuestionOptionRepository  : IRepository<QuestionOption> {
	    /// <summary>
	    /// 
	    /// </summary>
	    /// <param name="questionId"></param>
	    /// <returns></returns>
	    Task<IEnumerable<QuestionOption>> GetQuestionOptionsFullAsync(int questionId);
    }
}