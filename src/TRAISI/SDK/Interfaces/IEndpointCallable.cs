using System.Collections.Generic;

namespace TRAISI.SDK.Interfaces
{
    public interface IEndpointCallable
    {
        ICollection<QuestionEndpoint> QuestionEndpoints { get; set; }
    }
}