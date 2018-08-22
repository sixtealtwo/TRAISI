using DAL.Models;
using DAL.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;


namespace DAL.Repositories.Interfaces {
	public interface IQuestionPartRepository : IRepository<QuestionPart> {

        Task<QuestionPart> GetQuestionPartWithConfigurationsAsync(int id);
				Task<QuestionPart> GetQuestionPartWithOptionsAsync(int id);
        Task<IEnumerable<QuestionConfiguration>> GetQuestionPartConfigurationsAsync(int id);
        Task<IEnumerable<QuestionOption>> GetQuestionPartOptionsAsync(int id);
				Task<int> GetNumberOfParentViewsAsync(int id);
				int GetNumberOfParentViews(int id);
	}
}