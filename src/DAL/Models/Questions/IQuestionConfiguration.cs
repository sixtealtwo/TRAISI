namespace DAL.Models.Surveys
{
    /// <summary>
    /// Stores a single configuration value that belongs to a question configuration
    /// </summary>
    public interface IQuestionConfiguration
    {
        
        int Id { get; set; }

        /// <summary>
        /// They key that specifies this configuration option.
        /// </summary>
        /// <returns></returns>
        string Key {get ;set;}

        /// <summary>
        /// Raw data of this configuration
        /// </summary>
        /// <returns></returns>
        byte [] Value { get; set;}
    }
}