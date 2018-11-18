

namespace TRAISI.SDK.Interfaces
{
    /// <summary>
    /// Stores a single configuration value that belongs to a question configuration
    /// </summary>
    public interface IQuestionConfiguration
    {

        int Id { get; set; }

        string Name { get; set; }


        string Value { get; set; }

        bool IsResourceOnly { get; set; }





    }
}