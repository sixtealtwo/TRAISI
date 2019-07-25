using System.Collections.Generic;
using AutoMapper;
using DAL.Models.Interfaces;
using DAL.Models.Questions;

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
            return AutoMapper.Mapper.Map<TDest>(source,opts =>
            
             opts.Items["Language"] = language);
        }
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="source"></param>
        /// <param name="language"></param>
        /// <typeparam name="TDest"></typeparam>
        /// <returns></returns>
        public static TDest ToLocalizedModel<TDest,T>(this ICollection<T> source, string language)  where T : IEntity
        {
            return AutoMapper.Mapper.Map<TDest>(source,opts =>
            
                opts.Items["Language"] = language);
        }
       
    }
}