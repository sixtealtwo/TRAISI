
using System.Security.Claims;
using System.Threading.Tasks;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Castle.Core.Logging;
using TRAISI.SDK.Interfaces;
using Microsoft.AspNetCore.SpaServices.AngularCli;
namespace TRAISI.Testing
{
    public class TestStartup
    {

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ApplicationDbContext context)
        {
            app.UseCors(builder => builder
              .AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());

            app.UseStaticFiles();
            //app.UseSpaStaticFiles();
            app.UseAuthentication();

            context.Database.EnsureCreated();

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
                //spa.Options.StartupTimeout = TimeSpan.FromSeconds(259);

            });
        }
    }
}