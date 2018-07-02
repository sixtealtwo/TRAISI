using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using AspNet.Security.OAuth.Validation;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Swagger;
using TRAISI.Authorization;
using TRAISI.Helpers;
using TRAISI.ViewModels;
using AppPermissions = DAL.Core.ApplicationPermissions;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;
using FluentValidation.AspNetCore;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Authentication.JwtBearer;


namespace TRAISI
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        private readonly IHostingEnvironment _hostingEnvironment;



        /// <summary>
        /// 
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            _hostingEnvironment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                Boolean.TryParse(Configuration.GetSection("DevelopmentSettings").GetSection("UseSqliteDatabaseProvider").Value, out bool development);

                if (development)
                {
                    options.UseSqlite("Data Source=dev.db;");
                }
                else
                {
                    options.UseNpgsql(Configuration["ConnectionStrings:DefaultConnection"],
                        b => b.MigrationsAssembly("TRAISI"));
                }

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
                //    //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                //    //options.Lockout.MaxFailedAccessAttempts = 10;

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            // IIS Integration
            services.Configure<IISOptions>(options =>
            {
            });

            // Add cors
            services.AddCors();
            services.AddSignalR();

            // Register the OpenIddict services.
            services.AddOpenIddict(options =>
            {
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();
                options.AddMvcBinders();
                options.EnableTokenEndpoint("/connect/token");
                options.AllowPasswordFlow();
                options.AllowRefreshTokenFlow();
                //options.UseJsonWebTokens();

                if (_hostingEnvironment.IsDevelopment()) //Uncomment to only disable Https during development
                    options.DisableHttpsRequirement();

                //options.UseRollingTokens(); //Uncomment to renew refresh tokens on every refreshToken request
               // options.AddSigningKey(new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes(Configuration["STSKey"])));
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = OAuthValidationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OAuthValidationDefaults.AuthenticationScheme;
            }).AddOAuthValidation(options =>
            {
                options.Events = new OAuthValidationEvents()
                {
                    OnRetrieveToken = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        if (!string.IsNullOrEmpty(accessToken) &&
                            (context.HttpContext.WebSockets.IsWebSocketRequest || context.Request.Headers["Accept"] == "text/event-stream"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });


            // Add framework services.
            services.AddMvc().AddJsonOptions(opts =>
            {
                opts.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                opts.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
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
                c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
                {
                        { "oauth2", new string[] { } }
                });

            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Authorization.Policies.ViewAllUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewUsers));
                options.AddPolicy(Authorization.Policies.ManageAllUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageUsers));
                options.AddPolicy(Authorization.Policies.ManageAllGroupsPolicy,
                        policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroups));
                options.AddPolicy(Authorization.Policies.ViewGroupUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewGroupUsers));
                options.AddPolicy(Authorization.Policies.ManageGroupUsersPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroupUsers));

                options.AddPolicy(Authorization.Policies.ViewAllRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewRoles));
                options.AddPolicy(Authorization.Policies.ViewRoleByRoleNamePolicy,
                    policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()));
                options.AddPolicy(Authorization.Policies.ManageAllRolesPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageRoles));

                options.AddPolicy(Authorization.Policies.AssignAllowedRolesPolicy,
                    policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));

                options.AddPolicy(Authorization.Policies.ViewAllSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewSurveys));
                options.AddPolicy(Authorization.Policies.ManageAllSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageSurveys));
                options.AddPolicy(Authorization.Policies.ViewGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ViewGroupSurveys));
                options.AddPolicy(Authorization.Policies.ManageGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.ManageGroupSurveys));
                options.AddPolicy(Authorization.Policies.CreateGroupSurveysPolicy,
                    policy => policy.RequireClaim(CustomClaimTypes.Permission, AppPermissions.CreateGroupSurveys));
            });

            Mapper.Initialize(cfg => { cfg.AddProfile<AutoMapperProfile>(); });

            // Configurations
            services.Configure<SmtpConfig>(Configuration.GetSection("SmtpConfig"));
            services.Configure<MailgunConfig>(Configuration.GetSection("MailgunConfig"));
            services.Configure<GeoConfig>(Configuration.GetSection("GeoConfig"));

            // Business Services
            services.AddScoped<IEmailer, Emailer>();

            // Survey Code Generation Services
            services.AddScoped<ICodeGeneration, CodeGenerationService>();

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
            services.AddSingleton<IQuestionTypeManager, QuestionTypeManager>();

            // Persistent Business Services
            services.AddSingleton<IMailgunMailer, MailgunMailer>();
            services.AddSingleton<IGeoService, GeoService>();

            // DB Creation and Seeding
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();
            services.AddLocalization(options => options.ResourcesPath = "Resources/Localization");




        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IQuestionTypeManager questionTypeManager)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug(LogLevel.Trace);
            loggerFactory.AddFile(Configuration.GetSection("Logging"));

            Utilities.ConfigureLogger(loggerFactory);
            EmailTemplates.Initialize(env, Configuration);

            questionTypeManager.LoadQuestionExtensions();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
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

            app.UseSignalR(routes =>
{
    routes.MapHub<NotifyHub>("/chat");
});

            app.UseStaticFiles();
            app.UseSpaStaticFiles();


            var supportedCultures = new[]
            {
                new CultureInfo("en-CA"),
                new CultureInfo("en"),
                new CultureInfo("fr")
            };

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            });


            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "TRAISI API V1"); });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";
                spa.Options.StartupTimeout = TimeSpan.FromSeconds(599);

                if (env.IsDevelopment())
                {
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}