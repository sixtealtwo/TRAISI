using System.Collections.Generic;
using System.Linq;
using DAL.Models.Surveys;

namespace DAL.Models.Extensions
{
    /// <summary>
    /// Utility class for containing label collections.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class LabelCollection<T> : HashSet<T> where T : Label
    {
        public T this[string key]
        {
            get { return this.FirstOrDefault(t => t.Language == key); }
            set
            {
                RemoveWhere(t => t.Language == key);
                Add(value);
            }
        }
    }
}