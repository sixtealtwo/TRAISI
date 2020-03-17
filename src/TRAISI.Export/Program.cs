using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using OfficeOpenXml;
using TRAISI.Helpers;

namespace TRAISI.Export
{
    class Program
    {
        private static void Main(string[] args)
        {
            // connect to the database
            var contextFactory = new DesignTimeDbContextFactory();
            var context = contextFactory.CreateDbContext(args);
            var questionTypeManager = new QuestionTypeManager(null, new NullLoggerFactory());
            questionTypeManager.LoadQuestionExtensions();
            var questionExporter = new QuestionTableExporter(context, questionTypeManager);
            var responseTableExporter = new ResponseTableExporter(context, questionTypeManager);
            var responderTableExporter = new ResponderTableExporter(context);

            // Read survey name
            var survey = context.Surveys
                .Where(s => string.Equals(s.Code, "SMTO", StringComparison.CurrentCultureIgnoreCase))
                .Include(s => s.SurveyViews).ThenInclude(v => v.QuestionPartViews)
                .First();

            var view = survey.SurveyViews.FirstOrDefault();
            
            Console.WriteLine("Gathering Questions");
            if (view == null) return;
            var questionPartViews = view.QuestionPartViews.OrderBy(p => p.Order).ToList();
            var questionPartViewTasks =
                questionPartViews.Select(questionExporter.QuestionPartsList).ToList();
            Task.WhenAll(questionPartViewTasks).Wait();
            questionPartViews = questionPartViewTasks
                .SelectMany(nl => nl.Result)
                .ToList();
            
            Console.WriteLine("Getting Responses");
            var responses = responseTableExporter.ResponseList(questionPartViews);
            Console.WriteLine("Finding Respondents");
            var respondents = responderTableExporter.GetSurveyRespondents(survey);
            var questionParts = questionPartViews.Select(qpv => qpv.QuestionPart).ToList();


            //test excel creation
            var fi = new FileInfo(@"..\..\test.xlsx");
            using (var eXp = new ExcelPackage(fi))
            {
                // initalize a sheet in the workbood
                var workbook = eXp.Workbook;
                Console.WriteLine("Writing question sheet");
                var questionsSheet = workbook.Worksheets.Add("Questions");
                questionExporter.BuildQuestionTable(questionPartViews, questionsSheet);
                Console.WriteLine("Wrting Response Sheet");
                var responseSheet = workbook.Worksheets.Add("Responses");
                responseTableExporter.ResponseListToWorksheet(responses, responseSheet);
                Console.WriteLine("Writing Response Pivot Sheet");
                var responsePivotSheet = workbook.Worksheets.Add("Response Pivot");
                responseTableExporter.ResponsesPivot(questionParts, responses, respondents, responsePivotSheet);
                eXp.Save();
            }
        }
    }
}