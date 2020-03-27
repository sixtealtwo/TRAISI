using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Questions;

namespace DAL.Repositories.Interfaces {
	public interface IQuestionPartViewRepository : IRepository<QuestionPartView> 
	{
		Task<QuestionPartView> GetQuestionPartViewWithStructureAsync (int? questionPartViewId);

        QuestionPartView GetQuestionPartViewWithStructure(int questionPartViewId);

        List<QuestionPartView> GetQuestionPartViewsWithParent(int questionPartViewParentId);

		Task<QuestionPartView> GetQuestionPartViewWithConditionals(int id);
	}
}