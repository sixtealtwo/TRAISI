using System.Collections.Generic;
using DAL.Models.Questions;

namespace TRAISI.ViewModels.Questions
{
    public class QuestionConditionalOperatorViewModel
    {
        public QuestionConditionalViewModel Lhs { get; set; }

        public QuestionConditionalViewModel Rhs { get; set; }

        public int Id { get; set; }

        public int Order { get; set; }

        public int TargetQuestionId { get; set; }

        public QuestionCondtionalOperatorType OperatorType { get; set; }

    }
}