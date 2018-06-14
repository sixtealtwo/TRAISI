
// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Interfaces;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DAL {
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string> {
        public string CurrentUserId { get; set; }

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyPermission> SurveyPermissions { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }

        public DbSet<QuestionPart> QuestionParts { get; set; }

        public DbSet<QuestionConfiguration> QuestionConfigurations{get;set;}

        public ApplicationDbContext (DbContextOptions options) : base (options) { }

        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            builder.Entity<ApplicationUser> ().HasMany (u => u.Claims).WithOne ().HasForeignKey (c => c.UserId).IsRequired ().OnDelete (DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser> ().HasMany (u => u.Roles).WithOne ().HasForeignKey (r => r.UserId).IsRequired ().OnDelete (DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole> ().HasMany (r => r.Claims).WithOne ().HasForeignKey (c => c.RoleId).IsRequired ().OnDelete (DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole> ().HasMany (r => r.Users).WithOne ().HasForeignKey (r => r.RoleId).IsRequired ().OnDelete (DeleteBehavior.Cascade);

            builder.Entity<Survey> ().Property (s => s.Name).IsRequired ().HasMaxLength (100);
            builder.Entity<Survey> ().HasIndex (s => s.Name);
            builder.Entity<Survey> ().ToTable ($"{nameof(this.Surveys)}");

            builder.Entity<SurveyPermission> ().ToTable ($"{nameof(this.SurveyPermissions)}");

            builder.Entity<UserGroup> ().Property (g => g.Name).IsRequired ().HasMaxLength (100);
            builder.Entity<UserGroup> ().HasIndex (g => g.Name);
            builder.Entity<UserGroup> ().ToTable ($"{nameof(this.UserGroups)}");

            builder.Entity<GroupMember> ().ToTable ($"{nameof(this.GroupMembers)}");

        }

        public override int SaveChanges () {
            UpdateAuditEntities ();
            return base.SaveChanges ();
        }

        public override int SaveChanges (bool acceptAllChangesOnSuccess) {
            UpdateAuditEntities ();
            return base.SaveChanges (acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync (CancellationToken cancellationToken = default (CancellationToken)) {
            UpdateAuditEntities ();
            return base.SaveChangesAsync (cancellationToken);
        }

        public override Task<int> SaveChangesAsync (bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default (CancellationToken)) {
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