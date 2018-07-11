using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using DAL;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Hosting;
using CsvHelper;

namespace TRAISI.Helpers
{
    public interface IFileDownloader
    {
			string CodeFunction();
			void WriteShortcodeFile(string code, string userName, string mode, Survey survey);
			void WriteGroupCodeFile(string code, string userName, string mode, Survey survey);
      
    }

    public class FileDownloaderService : IFileDownloader
    {
        private IUnitOfWork _unitOfWork;
				private IHubContext<NotifyHub> _notifyHub;
        private readonly Random _randomGen;
				private IHostingEnvironment _hostingEnvironment;

        public FileDownloaderService(IUnitOfWork unitOfWork, IHubContext<NotifyHub> notifyHub, Random Random, IHostingEnvironment hostingEnvironment)
        {
            this._unitOfWork = unitOfWork;
						this._notifyHub = notifyHub;
            this._randomGen = new Random();
						this._hostingEnvironment = hostingEnvironment;
        }

				public string CodeFunction()
        {
            string code = Guid.NewGuid().ToString("N").Substring(0, 10);
            return code.ToUpper();
        }

				public void WriteShortcodeFile(string code, string userName, string mode, Survey survey)
				{
						Task.Run (() => {
							var shortcodes = this._unitOfWork.Shortcodes.GetShortcodesForSurvey(survey.Id, mode=="test");

							string folderName = "Download";
							string webRootPath = _hostingEnvironment.WebRootPath;
							string newPath = Path.Combine(webRootPath, folderName, userName, code);
							string fileName = Path.Combine(newPath, $"ShortcodeList_{survey.Name}_{mode}");
							if (!Directory.Exists(newPath))
							{
									Directory.CreateDirectory(newPath);
							}

							// Write shortcodes to csv
							using (var sw = new StreamWriter(fileName))
							{
								var writer = new CsvWriter(sw);
								writer.WriteRecords(shortcodes);
							}


						});
				}

				public void WriteGroupCodeFile(string code, string userName, string mode, Survey survey)
				{
						Task.Run (() => {
							var shortcodes = this._unitOfWork.GroupCodes.GetGroupCodesForSurvey(survey.Id, mode=="test");

							string folderName = "Download";
							string webRootPath = _hostingEnvironment.WebRootPath;
							string newPath = Path.Combine(webRootPath, folderName, userName);
							string fileName = Path.Combine(newPath, $"ShortcodeList_{survey.Name}_{mode}");
							if (!Directory.Exists(newPath))
							{
									Directory.CreateDirectory(newPath);
							}

						});
				}


    }

}