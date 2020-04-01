using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using TRAISI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TRAISI
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            Mapper.Reset();
            IConfigurationRoot configuration;
            var cb = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())

                .AddJsonFile("appsettings.json");

            if (File.Exists("appsettings.local.json"))
            {
                cb.AddJsonFile("appsettings.local.json");
            }
            else
            {
                cb.AddJsonFile("appsettings.json", optional: true);
            }
            configuration = cb.Build();
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            Boolean.TryParse(configuration.GetSection("DevelopmentSettings").GetSection("UseSqliteDatabaseProvider").Value, out bool development);

            if (development)
            {
                builder.UseSqlite("Data Source=dev.db;");
            }
            else
            {
                builder.UseNpgsql(configuration["ConnectionStrings:DefaultConnection"], b =>
                {
                    b.MigrationsAssembly("TRAISI");
                    b.UseNetTopologySuite();
                }
                );
            }
            builder.UseOpenIddict();



            return new ApplicationDbContext(builder.Options);
        }

    }


}