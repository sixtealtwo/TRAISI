using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Groups;
using DAL.Models.Interfaces;
using DAL.Models.Questions;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace DAL {
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string> {
        public ApplicationDbContext (string currentUserId) {
            this.CurrentUserId = currentUserId;

        }
        public string CurrentUserId { get; set; }

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyPermission> SurveyPermissions { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<ApiKeys> ApiKeys { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<SiteSurveyTemplate> SiteSurveyTemplates { get; set; }
        public DbSet<Shortcode> Shortcodes { get; set; }
        public DbSet<GroupCode> GroupCodes { get; set; }
        public DbSet<QuestionPart> QuestionParts { get; set; }

        public DbSet<QuestionConfiguration> QuestionConfigurations { get; set; }

        public DbSet<QuestionOption> QuestionOptions { get; set; }

				public DbSet<QuestionOptionLabel> QuestionOptionLabels { get; set; }

        public DbSet<ResponseValue> ResponseValues { get; set; }
        public DbSet<SurveyView> SurveyViews { get; set; }
        public DbSet<WelcomePageLabel> WelcomePageLabels { get; set; }
        public DbSet<ThankYouPageLabel> ThankYouPageLabels { get; set; }
        public DbSet<TermsAndConditionsPageLabel> TermsAndConditionsPageLabels { get; set; }

        public DbSet<TitlePageLabel> TitlePageLabels { get; set; }

        public DbSet<QuestionPartView> QuestionPartViews { get; set; }

        public DbSet<QuestionPartViewLabel> QuestionPartViewLabels { get; set; }
        
        public DbSet<PrimaryRespondent> PrimaryRespondents {get;set;}

        public ApplicationDbContext (DbContextOptions options) : base (options) { }

        public ApplicationDbContext () { }

        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            builder.Entity<ApplicationUser> ().HasMany (u => u.Claims).WithOne ().HasForeignKey (c => c.UserId).IsRequired ().OnDelete (DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser> ().HasMany (u => u.Roles).WithOne ().HasForeignKey (r => r.UserId).IsRequired ().OnDelete (DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole> ().HasMany (r => r.Claims).WithOne ().HasForeignKey (c => c.RoleId).IsRequired ().OnDelete (DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole> ().HasMany (r => r.Users).WithOne ().HasForeignKey (r => r.RoleId).IsRequired ().OnDelete (DeleteBehavior.Cascade);

            builder.Entity<Survey> ().Property (s => s.Name).IsRequired ().HasMaxLength (100);
            builder.Entity<Survey> ().HasIndex (s => s.Name);
						builder.Entity<Survey> ().HasMany (s => s.SurveyViews).WithOne (k => k.Survey).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<Survey> ().HasMany (s => s.SurveyPermissions).WithOne(k => k.Survey).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<Survey> ().HasMany (s => s.GroupCodes).WithOne(k => k.Survey).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<Survey> ().HasMany (s => s.Shortcodes).WithOne(sc => sc.Survey).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<Survey> ().HasMany (s => s.TitleLabels).WithOne(t => t.Survey).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Survey> ().ToTable ($"{nameof(this.Surveys)}");

						builder.Entity<SurveyView> ().Property (s => s.ViewName).IsRequired().HasMaxLength (100);
						builder.Entity<SurveyView> ().HasMany (s => s.QuestionPartViews).WithOne(qv => qv.SurveyView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<SurveyView> ().HasMany (s => s.WelcomePageLabels).WithOne(qv => qv.SurveyView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<SurveyView> ().HasMany (s => s.TermsAndConditionsLabels).WithOne(qv => qv.SurveyView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<SurveyView> ().HasMany (s => s.ThankYouPageLabels).WithOne(qv => qv.SurveyView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<SurveyView> ().ToTable ($"{nameof(this.SurveyViews)}");
            
						builder.Entity<SurveyPermission> ().ToTable ($"{nameof(this.SurveyPermissions)}");

            builder.Entity<UserGroup> ().Property (g => g.Name).IsRequired ().HasMaxLength (100);
            builder.Entity<UserGroup> ().HasIndex (g => g.Name);
            builder.Entity<UserGroup> ().HasOne (g => g.ApiKeySettings).WithOne (k => k.Group).OnDelete (DeleteBehavior.Cascade);
            builder.Entity<UserGroup> ().HasMany (g => g.EmailTemplates).WithOne (k => k.Group).OnDelete (DeleteBehavior.Cascade);
            builder.Entity<UserGroup> ().ToTable ($"{nameof(this.UserGroups)}");

            builder.Entity<ApiKeys> ().ToTable ($"{nameof(this.ApiKeys)}");

            builder.Entity<EmailTemplate> ().ToTable ($"{nameof(this.EmailTemplates)}");

            builder.Entity<SiteSurveyTemplate> ().ToTable ($"{nameof(this.SiteSurveyTemplates)}");

            builder.Entity<GroupMember> ().ToTable ($"{nameof(this.GroupMembers)}");

            builder.Entity<Shortcode> ().ToTable ($"{nameof(this.Shortcodes)}");

            builder.Entity<GroupCode> ().ToTable ($"{nameof(this.GroupCodes)}");

						builder.Entity<QuestionOptionLabel> ().ToTable ($"{nameof(this.QuestionOptionLabels)}");

						builder.Entity<WelcomePageLabel> ().ToTable ($"{nameof(this.WelcomePageLabels)}");

						builder.Entity<ThankYouPageLabel> ().ToTable ($"{nameof(this.ThankYouPageLabels)}");

						builder.Entity<TitlePageLabel> ().ToTable ($"{nameof(this.TitlePageLabels)}");

						builder.Entity<TermsAndConditionsPageLabel> ().ToTable ($"{nameof(this.TermsAndConditionsPageLabels)}");
            
						builder.Entity<QuestionPartViewLabel>().ToTable($"{nameof(this.QuestionPartViewLabels)}");
						
						builder.Entity<QuestionPart> ().HasMany (q => q.QuestionConfigurations).WithOne().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<QuestionPart> ().HasMany (q => q.QuestionOptions).WithOne().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<QuestionPart>().ToTable($"{nameof(this.QuestionParts)}");

						builder.Entity<QuestionPartView> ().HasMany (s => s.Labels).WithOne(l => l.QuestionPartView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<QuestionPartView> ().HasMany (qp => qp.QuestionPartViewChildren).WithOne(qc => qc.ParentView).OnDelete(DeleteBehavior.Cascade);
						builder.Entity<QuestionPartView>().ToTable($"{nameof(this.QuestionPartViews)}");

            
            builder.Entity<QuestionOption> ().HasMany (o => o.QuestionOptionLabels);

            builder.Entity<ResponseValue> ().ToTable ("ResponseValues").HasDiscriminator<int> ("ResponseType")
                .HasValue<StringResponse> (1)
                .HasValue<DecimalResponse> (2)
                .HasValue<LocationResponse> (3)
                .HasValue<IntegerResponse> (4)
                .HasValue<OptionListResponse> (5)
                .HasValue<JsonResponse> (6);

            builder.Entity<SurveyResponse> ().HasOne (s => s.ResponseValue).WithOne (v => v.SurveyResponse).HasForeignKey<SurveyResponse> (s => s.ResponseValueId);

            builder.Entity<PrimaryRespondent>().ToTable("PrimaryRespondents").HasOne(s => s.User);

        }

        public override int SaveChanges () {
            UpdateAuditEntities ();
            return base.SaveChanges ();
        }

        public override int SaveChanges (bool acceptAllChangesOnSuccess) {
            UpdateAuditEntities ();
            return base.SaveChanges (acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync (CancellationToken cancellationToken = default) {
            UpdateAuditEntities ();
            return base.SaveChangesAsync (cancellationToken);
        }

        public override Task<int> SaveChangesAsync (bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default) {
            UpdateAuditEntities ();
            return base.SaveChangesAsync (acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities () {
            var modifiedEntries = ChangeTracker.Entries ()
                .Where (x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in modifiedEntries) {
                var entity = (IAuditableEntity) entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added) {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                } else {
                    base.Entry (entity).Property (x => x.CreatedBy).IsModified = false;
                    base.Entry (entity).Property (x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}