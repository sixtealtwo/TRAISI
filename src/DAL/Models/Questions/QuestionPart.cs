using System.Collections.Generic;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    /**
     * 
     */
    public class QuestionPart : IQuestionPart
    {

		public QuestionPart()
		{
			TextLabels = new HashSet<Label>();
			QuestionPartChildren = new HashSet<QuestionPart>();
		}

		public int Id { get;set;}
		public string Text { get;set; }
		public ICollection<Label> TextLabels { get;set; }
		public ICollection<QuestionPart> QuestionPartChildren {get;set; }
	}
}