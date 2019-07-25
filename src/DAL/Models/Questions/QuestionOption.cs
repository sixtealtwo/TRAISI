using DAL.Models.Extensions;
using DAL.Models.Interfaces;
using DAL.Core;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DAL.Models.Questions
{
    public class QuestionOption : IQuestionOption, IEntity
    {
        [JsonIgnore]
        public int Id { get; set; }

        public string Name { get; set; }

		public string Code { get; set; }

        public LabelCollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

        public int Order { get; set; }

        public ICollection<QuestionOptionConditional> QuestionOptionConditionalsTarget { get; set; }

        public QuestionPart QuestionPartParent { get; set; }

        [JsonIgnore]
        [ForeignKey("QuestionPartParent")]
        public int QuestionPartParentId { get; set; }

        public QuestionOption()
        {
            QuestionOptionLabels = new LabelCollection<QuestionOptionLabel>();
        }

    }
}