using System.Collections.Generic;
using TRAISI.SDK.Enums;
namespace TRAISI.SDK.Interfaces
{
    public interface IPath
    {

        List<IPoint> Points { get; set; }
    }
}