using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using OfficeOpenXml;
using TRAISI.Helpers;
using System.Data;
using System.Collections.Generic;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Export
{
    class Program
    {

        public static void Main(string[] args)
        {
            // connect to the database
            var contextFactory = new DesignTimeDbContextFactory();
            var context = contextFactory.CreateDbContext(args);
            var questionTypeManager = new QuestionTypeManager(null, new NullLoggerFactory());
            questionTypeManager.LoadQuestionExtensions("../TRAISI/extensions");
            var questionExporter = new QuestionTableExporter(context, questionTypeManager);
            var responseTableExporter = new ResponseTableExporter(context, questionTypeManager);
            var responderTableExporter = new ResponderTableExporter(context);

            // Read survey name
            var survey = context.Surveys
            .AsQueryable()
            .Where(s => string.Equals(s.Code, args[0]))
            .Include(s => s.SurveyViews)
            .ThenInclude(v => v.QuestionPartViews)
            .FirstOrDefault();

            //var view = context.SurveyViews.FirstOrDefault();
            Console.WriteLine("Gathering Questions");
            var view = survey.SurveyViews.FirstOrDefault();
            if (view == null) return;

            /* var questionPartViews = view.QuestionPartViews.OrderBy(p => p.Order).ToList();
            var questionPartViewTasks =
                questionPartViews.Select(questionExporter.QuestionPartsList).ToList();
            Task.WhenAll(questionPartViewTasks).Wait();
            questionPartViews = questionPartViewTasks
                .SelectMany(nl => nl.Result)
                .ToList(); */

            List<QuestionPartView> questionPartViews = new List<QuestionPartView>();
            foreach (var page in view.QuestionPartViews)
            {
                context.Entry(page).Collection(c => c.QuestionPartViewChildren).Load();
                foreach (var q in page.QuestionPartViewChildren)
                {
                    context.Entry(q).Collection(c => c.Labels).Load();
                    context.Entry(q).Reference(r => r.QuestionPart).Load();
                    context.Entry(q).Collection(c => c.QuestionPartViewChildren).Load();
                    foreach (var q2 in q.QuestionPartViewChildren)
                    {
                        context.Entry(q2).Collection(c => c.Labels).Load();
                        context.Entry(q2).Reference(r => r.QuestionPart).Load();
                        context.Entry(q2).Collection(c => c.QuestionPartViewChildren).Load();
                        questionPartViews.Add(q2);
                    }

                }
                continue;
            }


            Console.WriteLine("Getting Responses");
            var responses = responseTableExporter.ResponseList(questionPartViews);
            Console.WriteLine("Finding Respondents");
            var respondents = responderTableExporter.GetSurveyRespondents(survey);
            var questionParts = questionPartViews.Select(qpv => qpv.QuestionPart).ToList();


            //test excel creation
            var fi = new FileInfo(@"..\..\src\TRAISI.Export\surveyexportfiles\test.xlsx");
            if (fi.Exists)
            {
                fi.Delete();
            }
            using (var eXp = new ExcelPackage(fi))
            {
                // initalize a sheet in the workbook
                var workbook = eXp.Workbook;
                Console.WriteLine("Writing question sheet");
                var questionsSheet = workbook.Worksheets.Add("Questions");
                questionExporter.BuildQuestionTable(questionPartViews, questionsSheet);
                Console.WriteLine("Writing Response Sheet");
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