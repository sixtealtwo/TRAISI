// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DAL {
    public interface IDatabaseInitializer {
        Task SeedAsync ();
    }

    public class DatabaseInitializer : IDatabaseInitializer {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer (ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger) {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync () {
            await _context.Database.MigrateAsync ().ConfigureAwait (false);

            if (!await _context.Users.AnyAsync ()) {
                _logger.LogInformation ("Generating inbuilt accounts");

                const string adminRoleName = "super administrator";
                const string groupAdminRoleName = "group administor";
                const string userRoleName = "user";

                await EnsureRoleAsync (adminRoleName, "Super administrator", ApplicationPermissions.GetAllPermissionValues ());
                await EnsureRoleAsync (groupAdminRoleName, "Group administrator", ApplicationPermissions.GetAllGroupPermissionValues ());
                await EnsureRoleAsync (userRoleName, "Basic user", new string[] { });

                await CreateUserAsync ("admin", "tempP@ss123", "Inbuilt Administrator", "admin@traisi.dmg.utoronto.ca", "+1 (123) 000-0000", new string[] { adminRoleName });
                await CreateUserAsync ("user", "tempP@ss123", "Inbuilt Standard User", "user@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });
                await CreateUserAsync ("smto", "tempP@ss123", "Inbuilt Standard User", "smto@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });
                await CreateUserAsync ("tts", "tempP@ss123", "Inbuilt Standard User", "tts@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });

                _logger.LogInformation ("Inbuilt account generation completed");
            }

            if (!await _context.UserGroups.AnyAsync ()) {
                _logger.LogInformation ("Seeding initial data");

                UserGroup TTS = new UserGroup () {
                    Name = "TTS",
                    Members = new List<GroupMember> ()
                };

                UserGroup SMTO = new UserGroup () {
                    Name = "StudentMove",
                    Members = new List<GroupMember> ()
                };

                _context.UserGroups.Add (TTS);
                _context.UserGroups.Add (SMTO);
                await _context.SaveChangesAsync ();

                _logger.LogInformation ("Seeding initial data completed");
            }
        }

        private async Task EnsureRoleAsync (string roleName, string description, string[] claims) {
            if ((await _accountManager.GetRoleByNameAsync (roleName)) == null) {
                ApplicationRole applicationRole = new ApplicationRole (roleName, description);

                var result = await this._accountManager.CreateRoleAsync (applicationRole, claims);

                if (!result.Item1)
                    throw new Exception ($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");
            }
        }

        private async Task<ApplicationUser> CreateUserAsync (string userName, string password, string fullName, string email, string phoneNumber, string[] roles) {
            ApplicationUser applicationUser = new ApplicationUser {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await _accountManager.CreateUserAsync (applicationUser, roles, password);

            if (!result.Item1)
                throw new Exception ($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");

            return applicationUser;
        }
    }
}