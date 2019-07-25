using System;

namespace TRAISI.SDK
{
    public class QuestionEndpoint
    {
        /// <summary>
        /// 
        /// </summary>
        string EndpointName
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        private Action EndpointAction
        {
            get;
            set;
        }
    }
}