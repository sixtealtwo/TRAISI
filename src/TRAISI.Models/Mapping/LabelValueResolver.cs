using System.Collections.Generic;
using AutoMapper;
using Traisi.Data.Models.Extensions;
using Traisi.Data.Models.Surveys;

namespace Traisi.Models.Mapping
{
    /// <summary>
    /// 
    /// </summary>
    public class LabelValueResolver : IMemberValueResolver<object, object, string, LabelCollection<Label>>
    {
        public LabelCollection<Label> Resolve(object source, object destination, string sourceMember, LabelCollection<Label> destMember, ResolutionContext context)
        {
           // destMember[context.Items["Language"] as string].Value = sourceMember;
            return destMember;
        }

    }

    
}