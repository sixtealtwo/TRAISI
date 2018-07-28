using System.Collections.Generic;
using DAL.Models.Surveys;
using DAL.Models.Interfaces;

namespace DAL.Models.Questions
{
    /// <summary>
    /// QuestionPartView model - container of QuestionParts 
    /// </summary>
    public class QuestionPartView : IQuestionPartView, IEntity
    {
        /// <summary>
        /// Id
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// Collection of Label objects for this view.
        /// </summary>
        /// <value></value>
        public ICollection<QuestionPartViewLabel> Labels { get; set; }

        /// <summary>
        /// The associated QuestionPart for this QuestionPartView
        /// </summary>
        /// <value></value>
        public QuestionPart QuestionPart { get; set; }


        public QuestionPartView ParentView { get; set; }

        /// <summary>
        /// The Survey View this question belongs to.
        /// </summary>
        /// <value></value>
        public SurveyView SurveyView { get; set; }

        public ICollection<QuestionPartView> QuestionPartViewChildren {get;set;}

        /// <summary>
        /// The order (position) of this question part view inside of its containing survey view.
        /// </summary>
        /// <value></value>
        public int Order {get;set;}

        public QuestionPartView()
        {
            this.Labels = new HashSet<QuestionPartViewLabel>();
        }



    }
}