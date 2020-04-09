using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TRAISI.Data.Models.Interfaces;
using Newtonsoft.Json;

namespace TRAISI.Data.Models.Surveys
{
    public class ExtensionConfiguration : IExtensionConfiguration, IEntity
    {
        [JsonIgnore]
        public int Id { get; set; }


        public Survey Survey { get; set; }

        [Required]
        public string ExtensionName { get; set; }

        [Required]
        [Column(TypeName = "jsonb")]
        public string Configuration { get; set; }
    }
}
