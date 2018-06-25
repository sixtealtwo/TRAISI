using System;
using DAL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace TRAISI.Testing
{
    public class TRAISITestWebHostBuilder : WebHostBuilder
    {
        public TRAISITestWebHostBuilder() : base()
        {
            this.ConfigureServices( ConfigureTestServices);
        }

        private void ConfigureTestServices(IServiceCollection services)
        {
             var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlite("Data Source=dev.db;");
                
            });
            


        }

    }
}