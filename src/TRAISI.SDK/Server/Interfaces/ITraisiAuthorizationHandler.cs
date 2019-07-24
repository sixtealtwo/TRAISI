
using Microsoft.AspNetCore.Http;

namespace TRAISI.SDK.Interfaces
{


    public interface ITraisiAuthorizationHandler
    {

        bool ShouldAuthorize(HttpContext s);
    }
}