using AutoMapper;

namespace TRAISI.ViewModels.Extensions {

    public static class AutoMapperExtensions {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mapper"></param>
        /// <param name="source"></param>
        /// <param name="language"></param>
        /// <typeparam name="TDest"></typeparam>
        /// <returns></returns>
        public static TDest MapWithLanguage<TDest> (this Mapper mapper, object source, string language) {
            return AutoMapper.Mapper.Map<TDest> (source);
        }
    }
}