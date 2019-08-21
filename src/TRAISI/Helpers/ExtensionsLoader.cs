using Microsoft.Extensions.Logging;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Helpers
{

    public class ExtensionsLoader : IExtensionsLoader
    {

        private ILogger<ExtensionsLoader> _logger;

        
        public ExtensionsLoader(ILogger<ExtensionsLoader> logger)
        {

            this._logger = logger;
        }

    }
}