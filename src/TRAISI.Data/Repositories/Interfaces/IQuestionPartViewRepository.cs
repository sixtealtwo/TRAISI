using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Data.Repositories.Interfaces {
	public interface IQuestionPartViewRepository : IRepository<QuestionPartView> 
	{
		Task<QuestionPartView> GetQuestionPartViewWithStructureAsync (int? questionPartViewId);

        QuestionPartView GetQuestionPartViewWithStructure(int questionPartViewId);

        List<QuestionPartView> GetQuestionPartViewsWithParent(int questionPartViewParentId);

		Task<QuestionPartView> GetQuestionPartViewWithConditionals(int id);
	}
}