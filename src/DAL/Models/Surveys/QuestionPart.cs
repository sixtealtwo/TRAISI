using System.Collections.Generic;

namespace DAL.Models
{
    /**
     * 
     */
    public class QuestionPart
    {
        public int Id { get; set; }

        public ICollection<QuestionPart> QuestionPartChildren {get;set;}

    }
}