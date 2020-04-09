using System;
using DAL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace TRAISI.Testing
{
    public class TRAISITestWebHostBuilder : WebHostBuilder
    {
        public TRAISITestWebHostBuilder() : base()
        {
            this.ConfigureServices(ConfigureTestServices);
        }

        private void ConfigureTestServices(IServiceCollection services)
        {
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

         
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlite("Data Source=testing.db;");

            });

              // Add cors
            services.AddCors();

            // Add framework services.
            services.AddMvc().AddJsonOptions(opts =>
            {
                // opts
                // opts.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                // opts.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                //  opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });



        }

    }
}