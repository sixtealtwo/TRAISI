using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Models.Surveys;

namespace DAL.Models.Surveys {
    public class Survey : AuditableEntity, ISurvey {
        public int Id { get; set; }
        public int Code { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Group { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsOpen { get; set; }
        public string SuccessLink { get; set; }
        public string RejectionLink { get; set; }
        public string DefaultLanguage { get; set; }
        public string StyleTemplate { get; set; }
        public ICollection<SurveyView> SurveyViews { get; set; }
        public ICollection<SurveyPermission> SurveyPermissions { get; set; }
				public ICollection<GroupCode> GroupCodes { get; set; }
				public ICollection<Shortcode> Shortcodes { get; set; }


        public ICollection<Label> TitleLabel { get; set; }

        [NotMapped]
        public string Title {
            get {
                return TitleLabel.FirstOrDefault ()?.Text;
            }
            set {

            }
        }

        public Survey () {
            this.TitleLabel = new HashSet<Label> ();
        }

    }
}