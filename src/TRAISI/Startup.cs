using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Swashbuckle.AspNetCore.Swagger;
using TRAISI.Authorization;
using TRAISI.Helpers;
using TRAISI.SDK.Interfaces;
using TRAISI.Services;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels;
using AppPermissions = DAL.Core.ApplicationPermissions;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.Sqlite;
using OpenIddict.Abstractions;

namespace TRAISI
{
    public class Startup
    {
        private readonly IHostingEnvironment _hostingEnvironment;


        /// <summary>
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            _hostingEnvironment = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        /// <summary>
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                bool.TryParse(Configuration.GetSection("DevelopmentSettings").GetSection("UseSqliteDatabaseProvider").Value,
                    out var development);

                if (development)
                    options.UseSqlite("Data Source=dev.db;");
                else
                    options.UseNpgsql(Configuration["ConnectionStrings:DefaultConnection"],
                        b => b.MigrationsAssembly("TRAISI"));

                options.UseOpenIddict();
            });

            // add identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure Identity options and password complexity here
            services.Configure<IdentityOptions>(options =>
            {
                // User settings
                options.User.RequireUniqueEmail = true;

                //    //// Password settings
                //    //options.Password.RequireDigit = true;
                //    //options.Password.RequiredLength = 8;
                //    //options.Password.RequireNonAlphanumeric = false;
                //    //options.Password.RequireUppercase = true;
                //    //options.Password.RequireLowercase = false;

                //    //// Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            // IIS Integration
            services.Configure<IISOptions>(options => { });

            // Add cors
            services.AddCors();
            services.AddSignalR();

            // Register the OpenIddict services.
            services.AddOpenIddict().AddCore(options =>
            {


                options.UseEntityFrameworkCore().UseDbContext<ApplicationDbContext>();

                /*options.AddEntityFrameworkCoreStores<ApplicationDbContext>();
                options.AddMvcBinders();
                options.EnableTokenEndpoint("/connect/token");
                options.AllowPasswordFlow();
                options.AllowRefreshTokenFlow();
                //options.UseJsonWebTokens();

                if (_hostingEnvironment.IsDevelopment()) //Uncomment to only disable Https during development
                    options.DisableHttpsRequirement();

                //options.UseRollingTokens(); //Uncomment to renew refresh tokens on every refreshToken request
                // options.AddSigningKey(new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes(Configuration["STSKey"]))); */


            }).AddServer(options =>
            {
                // options.
                options.UseMvc();
                options.EnableTokenEndpoint("/connect/token");
                options.AllowPasswordFlow();
                options.AllowRefreshTokenFlow();
                if (_hostingEnvironment.IsDevelopment()) {//Uncomment to only disable Https during development
                    options.DisableHttpsRequirement();
                }

                //disables requiring client_id
                options.AcceptAnonymousClients();

                options.RegisterScopes(OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Phone,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles);

            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = OAuthValidationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OAuthValidationDefaults.AuthenticationScheme;
            }).AddOAuthValidation(options =>
            {
                options.Events = new OAuthValidationEvents
                {
                    OnRetrieveToken = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        if (!string.IsNullOrEmpty(accessToken) &&
                            (context.HttpContext.WebSockets.IsWebSocketRequest ||
                             context.Request.Headers["Accept"] == "text/event-stream"))
                            context.Token = accessToken;
                        return Task.CompletedTask;
                    }
                };

            });

            // Add framework services.
            services.AddMvc().AddJsonOptions(opts =>
            {
                opts.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                opts.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                opts.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                opts.SerializerSettings.Converters.Add(new StringEnumConverter
                {
                    CamelCaseText = true
                });
                //  opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });


            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });


            // Enforce https during production. To quickly enable ssl during development. Go to: Project Properties->Debug->Enable SSL
            if (!_hostingEnvironment.IsDevelopment())
                services.Configure<MvcOptions>(options => options.Filters.Add(new RequireHttpsAttribute()));


            //Todo: ***Using DataAnnotations for validation until Swashbuckle supports FluentValidation***
            services.AddMvc().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyMethod().AllowAnyHeader()
                        .AllowAnyOrigin()
                        .AllowCredentials();
                }));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "TRAISI API", Version = "v1" });

                c.AddSecurityDefinition("oauth2", new OAuth2Scheme
                {
                    Type = "oauth2",
                    Flow = "password",
                    TokenUrl = "/connect/token"
                });
                c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>> {
                    {"oauth2", new string[] { }}
                });
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.AccessAdminPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.AccessAdmin));

                options.AddPolicy(Policies.ViewAllUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewUsers));
                options.AddPolicy(Policies.ManageAllUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageUsers));
                options.AddPolicy(Policies.ManageAllGroupsPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroups));
                options.AddPolicy(Policies.ViewGroupUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewGroupUsers));
                options.AddPolicy(Policies.ManageGroupUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroupUsers));

                options.AddPolicy(Policies.ViewAllRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewRoles));
                options.AddPolicy(Policies.ViewRoleByRoleNamePolicy,
                    policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()));
                options.AddPolicy(Policies.ManageAllRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageRoles));

                options.AddPolicy(Policies.AssignAllowedRolesPolicy,
                    policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));

                options.AddPolicy(Policies.ViewAllSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewSurveys));
                options.AddPolicy(Policies.ManageAllSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageSurveys));
                options.AddPolicy(Policies.ViewGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewGroupSurveys));
                options.AddPolicy(Policies.ManageGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroupSurveys));
                options.AddPolicy(Policies.CreateGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.CreateGroupSurveys));

                options.AddPolicy(Policies.RespondToSurveyPolicy,
                policy => policy.Requirements.Add(new SurveyRespondentAuthorizationRequirement()));
            });

            Mapper.Initialize(cfg => { cfg.AddProfile<AutoMapperProfile>(); });

            // Configurations
            services.Configure<SmtpConfig>(Configuration.GetSection("SmtpConfig"));
            services.Configure<MailgunConfig>(Configuration.GetSection("MailgunConfig"));
            services.Configure<GeoConfig>(Configuration.GetSection("GeoConfig"));

            IList<CultureInfo> supportedCultures = new List<CultureInfo>
            {
                new CultureInfo("en-CA"),
                new CultureInfo("en"),
                new CultureInfo("fr")
            };

            services.Configure<RequestLocalizationOptions>(options =>
                        {
                            options.DefaultRequestCulture = new RequestCulture("en");
                            options.SupportedCultures = supportedCultures;
                            options.SupportedUICultures = supportedCultures;
                            options.RequestCultureProviders = new List<IRequestCultureProvider>
                                {
                                        new QueryStringRequestCultureProvider(),
                                        new CookieRequestCultureProvider()
                                };
                        });

            // Business Services
            services.AddScoped<IEmailer, Emailer>();

            // Survey Code Generation Services
            services.AddScoped<ICodeGeneration, CodeGenerationService>();

            // File Downloader Services
            services.AddScoped<IFileDownloader, FileDownloaderService>();

            // Repositories
            services.AddScoped<IUnitOfWork, HttpUnitOfWork>();
            services.AddScoped<IAccountManager, AccountManager>();

            // Auth Handlers
            services.AddSingleton<IAuthorizationHandler, ViewUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, ManageUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, ViewGroupUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, ManageGroupUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, ViewRoleAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, AssignRolesAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, SurveyRespondentAuthorizationHandler>();
            services.AddSingleton<IAuthorizationRequirement, SurveyRespondentAuthorizationRequirement>();
            services.AddSingleton<IQuestionTypeManager, QuestionTypeManager>();

            services.AddScoped<IRespondentGroupService, RespondentGroupService>();

            services.AddScoped<ISurveyViewerService, SurveyViewerService>();
            services.AddScoped<IResponderService, ResponderService>();

            // Persistent Business Services
            services.AddSingleton<IMailgunMailer, MailgunMailer>();
            services.AddSingleton<IGeoService, GeoService>();

            services.AddScoped<ISurveyBuilderService, SurveyBuilderService>();

            // DB Creation and Seeding
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();
            services.AddLocalization(options => options.ResourcesPath = "Resources/Localization");

            services.AddHangfire(config =>
            {
                config.UsePostgreSqlStorage(Configuration["ConnectionStrings:DefaultConnection"]);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory,
            IQuestionTypeManager questionTypeManager)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug(LogLevel.Debug);
            loggerFactory.AddFile(Configuration.GetSection("Logging"));

            Utilities.ConfigureLogger(loggerFactory);
            EmailTemplates.Initialize(env, Configuration);

            questionTypeManager.LoadQuestionExtensions();

            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }
            else {
                // Enforce https during production
                var rewriteOptions = new RewriteOptions()
                    .AddRedirectToHttps();
                app.UseRewriter(rewriteOptions);

                app.UseExceptionHandler("/Home/Error");
            }

            //Configure Cors
            app.UseCors("CorsPolicy");

            app.UseWebSockets();
            app.UseAuthentication();

            app.UseSignalR(routes => { routes.MapHub<NotifyHub>("/notify"); });

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseHangfireServer();
            app.UseHangfireDashboard();

            app.UseRequestLocalization();


            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "TRAISI API V1"); });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    "default",
                    "{controller}/{action=Index}/{id?}");
            });


            app.MapWhen(p => !p.Request.Path.StartsWithSegments("/survey"), adminApp =>
            {
                adminApp.UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp/";
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(599);
                    spa.Options.DefaultPage = "/admin/index.html";


                    if (env.IsDevelopment()) spa.UseAngularCliServer("start");
                });
            });

            app.MapWhen(p => p.Request.Path.StartsWithSegments("/survey"), surveyApp =>
            {
                surveyApp.UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp/";
                    spa.Options.DefaultPage = "/survey/index.html";
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(599);

                    if (env.IsDevelopment()) spa.UseAngularCliServer("start survey-viewer-app --watch --live-reload");
                });
            });
        }
    }
}