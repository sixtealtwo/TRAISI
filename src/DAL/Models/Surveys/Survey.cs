using System;
using System.Collections.Generic;
using DAL.Models.Extensions;
using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    public class Survey : AuditableEntity, ISurvey, IEntity
    {
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

        public LabelCollection<TitlePageLabel> TitleLabels { get; set; }

        public void PopulateDefaults()
        {
            DefaultLanguage = "en";
            TitleLabels = new LabelCollection<TitlePageLabel>
            {
                [DefaultLanguage] = new TitlePageLabel
                {
                    Value = "Default Welcome", Survey = this
                }
            };


            SurveyPermissions = new HashSet<SurveyPermission>();
            SurveyViews = new List<SurveyView>
            {
                new SurveyView
                {
                    ViewName = "Standard",
                    Survey = this,
                    WelcomePageLabels = new LabelCollection<WelcomePageLabel>
                    {
                        [DefaultLanguage] =
                            new WelcomePageLabel
                            {
                                Value = "Default Welcome"
                            },
                        ["fr"] =
                            new WelcomePageLabel
                            {
                                Value = "Bonjour"
                            }
                    },
                    ThankYouPageLabels = new LabelCollection<ThankYouPageLabel>
                    {
                        [DefaultLanguage] =
                            new ThankYouPageLabel
                            {
                                Value = "Default Thanks"
                            }
                    },
                    TermsAndConditionsLabels = new LabelCollection<TermsAndConditionsPageLabel>
                    {
                        [DefaultLanguage] =
                            new TermsAndConditionsPageLabel
                            {
                                // language is set on the object with the helper
                                Value = "Default Terms and Conditions"
                            }
                    }
                }
            };
        }
    }
}