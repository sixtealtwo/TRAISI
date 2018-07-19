using AutoMapper;
using DAL.Models.Interfaces;

namespace TRAISI.ViewModels.Extensions
{

    public static class AutoMapperExtensions
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="source"></param>
        /// <typeparam name="TDest"></typeparam>
        /// <returns></returns>
        public static TDest ToLocalizedModel<TDest>(this IEntity source, string language)
        {
            return AutoMapper.Mapper.Map<TDest>(source,opts => opts.Items["Language"] = language);
        }
       
    }
}