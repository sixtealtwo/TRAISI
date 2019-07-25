
using Microsoft.AspNetCore.Http;

namespace TRAISI.SDK.Interfaces
{


    public interface IAuthorizationHandler
    {

        bool ShouldAuthorize(HttpContext s);
    }
}