using System.Collections.Generic;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface IPathResponse : IResponseType
    {
        IPath Path { get; set; }
    }
}