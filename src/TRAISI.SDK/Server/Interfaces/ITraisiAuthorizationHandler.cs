
using Microsoft.AspNetCore.Http;

namespace TRAISI.SDK.Interfaces
{
    public interface ITraisiIAuthorizationHandler
    {

        bool ShouldAuthorize(HttpContext s);
    }
}