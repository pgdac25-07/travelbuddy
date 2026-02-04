
using FeedbackService.Data;
using FeedbackService.Repositories;
using FeedbackService.Services;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;

namespace FeedbackService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CORS (React dev server)
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("FrontendCors", policy =>
            //    {
            //        policy
            //            .WithOrigins(
            //                "http://localhost:3000",
            //                "http://127.0.0.1:3000"
            //            )
            //            .AllowAnyHeader()
            //            .AllowAnyMethod();
            //    });
            //});
            // Add Steeltoe Discovery Client
            builder.Services.AddDiscoveryClient(builder.Configuration);





            // DbContext
            builder.Services.AddDbContext<AppDbContext>(options =>
                        options.UseMySql(
                          builder.Configuration.GetConnectionString("DefaultConnection"),
                          ServerVersion.AutoDetect(
                          builder.Configuration.GetConnectionString("DefaultConnection")
        )
    )
);

            builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            builder.Services.AddScoped<IFeedbackServiceA, FeedbackServiceA>();

            var app = builder.Build();

            // Use Steeltoe Discovery Client
            app.UseDiscoveryClient();
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();

            app.UseCors("FrontendCors");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
