using System.Collections.Generic;

namespace TRAISI.SDK
{
    public interface IEndpointCallable
    {
        ICollection<QuestionEndpoint> QuestionEndpoints { get; set; }
    }
}