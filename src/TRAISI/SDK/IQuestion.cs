using System.Collections.Generic;

namespace TRAISI.SDK
{
    /// <summary>
    /// IQuestion interface, separate from the QuestionPart interface
    /// </summary>
    public interface IQuestion
    {
        /// <summary>
        /// Name of the Quesion Type
        /// </summary>
        string QuestionTypeName { get; set; }

        /// <summary>
        /// Declare all question slots
        /// </summary>
        ICollection<IQuestion> QuestionSlots {get;set; }

    }
    
    
    
    
}