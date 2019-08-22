
using Microsoft.AspNetCore.Http;

namespace TRAISI.SDK.Interfaces
{


    public interface TraisiIAuthorizationHandler
    {

        bool ShouldAuthorize(HttpContext s);
    }
}