using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Models.Groups;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DAL.Models.Questions;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }

    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            /* if (!await _context.QuestionConfigurations.AnyAsync ()) {
                 QuestionConfiguration qc = new QuestionConfiguration ();
                 qc.Value = "{\"some\": \"value\"}";
                 await _context.QuestionConfigurations.AddAsync (qc);
             } */

            ApplicationUser smto = null;
            ApplicationUser tts = null;

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts");

                const string adminRoleName = "super administrator";
                const string groupAdminRoleName = "group administrator";
                const string userRoleName = "user";
								const string respondentRoleName = "respondent";

                await EnsureRoleAsync(adminRoleName, "Super administrator", 0, ApplicationPermissions.GetAllPermissionValues());
                await EnsureRoleAsync(groupAdminRoleName, "Group administrator", 1, ApplicationPermissions.GetAllGroupPermissionValues());
                await EnsureRoleAsync(userRoleName, "Basic user", 2,  ApplicationPermissions.GetAdministrativePermissionValues());
								await EnsureRoleAsync(respondentRoleName, "Survey Respondent", 3, new string[] {});

                await CreateUserAsync("admin", "tempP@ss789", "Inbuilt Administrator", "admin@traisi.dmg.utoronto.ca", "+1 (123) 000-0000", new string[] { adminRoleName });
                await CreateUserAsync("user", "tempP@ss789", "Inbuilt Standard User", "user@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });
				await CreateUserAsync("respondent", "tempP@ss789", "Respondent User", "respondent@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { respondentRoleName });
                smto = await CreateUserAsync("smto", "tempP@ss789", "Inbuilt Standard User", "smto@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });
                tts = await CreateUserAsync("tts", "tempP@ss789", "Inbuilt Standard User", "tts@traisi.dmg.utoronto.ca", "+1 (123) 000-0001", new string[] { userRoleName });

                _logger.LogInformation("Inbuilt account generation completed");
            }

            if (!await _context.UserGroups.AnyAsync())
            {
                _logger.LogInformation("Seeding initial data");

                UserGroup TTS = new UserGroup()
                {
                    Name = "TTS",
                    Members = new List<GroupMember>(),
                    ApiKeySettings = new ApiKeys() { MailgunApiKey = "TTSMail", GoogleMapsApiKey = "TTSGoogle", MapBoxApiKey = "TTSMapbox" }
                };

                UserGroup SMTO = new UserGroup()
                {
                    Name = "StudentMove",
                    Members = new List<GroupMember>(),
                    ApiKeySettings = new ApiKeys() { MailgunApiKey = "SMTOMail", GoogleMapsApiKey = "SMTOGoogle", MapBoxApiKey = "SMTOMapbox" }
                };

                _context.UserGroups.Add(TTS);
                _context.UserGroups.Add(SMTO);

                Survey TestSurvey = new Survey()
                {
                    Name = "Test",
                    Owner = "tts",
                    Group = "StudentMove",
                    StartAt = DateTime.Now,
                    EndAt = DateTime.Now.Add(TimeSpan.FromDays(1)),
                    IsActive = true,
                    IsOpen = true,
                    SuccessLink = "",
                    RejectionLink = "",
                    DefaultLanguage = "en",
                };
                
                TestSurvey.PopulateDefaults();
                

                TestSurvey.SurveyPermissions = new List<SurveyPermission>();

                SurveyPermission test = new SurveyPermission()
                {
                    Permissions = new string[] { "survey.view", "survey.modify", "survey.interview" },
                    User = smto
                };

                TestSurvey.SurveyPermissions.Add(test);


                _context.Surveys.Add(TestSurvey);



                await _context.SaveChangesAsync();

                _logger.LogInformation("Seeding initial data completed");
            }
        }

        private async Task EnsureRoleAsync(string roleName, string description, int level, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                ApplicationRole applicationRole = new ApplicationRole(roleName, description, level);
								
                var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

                if (!result.Item1)
                    throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {
            ApplicationUser applicationUser = new ApplicationUser
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

            if (!result.Item1)
                throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");

            return applicationUser;
        }



    }
}