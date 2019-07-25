using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using NpgsqlTypes;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class PathResponse : ResponseValue, IPathResponse
    {


        [Column("Path")]
        public NpgsqlPath NPath { get; set; }

        [NotMapped]
        public IPath Path
        {
            get
            {
                return (IPath)(object)(NPath);
            }
            set
            {
                this.NPath.Clear();

                foreach (var p in value.Points)
                {
                    NPath.Add(new NpgsqlPoint(p.X, p.Y));
                }
            }
        }

        public PathResponse()
        {
            
        }
    }
}