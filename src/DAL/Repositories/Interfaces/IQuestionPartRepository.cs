using DAL.Models;
using DAL.Models.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;


namespace DAL.Repositories.Interfaces {
	public interface IQuestionPartRepository : IRepository<QuestionPart> {

        Task<QuestionPart> GetQuestionPartWithConfigurations(int id);
        Task<IEnumerable<QuestionConfiguration>> GetQuestionPartConfigurations(int id);
        Task<IEnumerable<QuestionOption>> GetQuestionPartOptions(int id);
	}
}