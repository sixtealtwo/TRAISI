using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http.Headers;
using TRAISI.Helpers;
using TRAISI.ViewModels;

namespace TRAISI.Controllers
{
    [Produces("application/json")]
    [Authorize]
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private IFileDownloader _fileHelper;

        public UploadController(IHostingEnvironment hostingEnvironment, IFileDownloader fileHelper)
        {
            _hostingEnvironment = hostingEnvironment;
            _fileHelper = fileHelper;
        }

        [HttpPost, DisableRequestSizeLimit, Produces(typeof(UploadPathViewModel))]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName, this.User.Identity.Name);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string extension = Path.GetExtension(fileName);
                    fileName = _fileHelper.CodeFunction() + extension;
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    string uploadPath = $"/{folderName}/{this.User.Identity.Name}/{fileName}";
                    
                    return Json(new UploadPathViewModel() { Link = uploadPath });
                }
                else
                {
                    return Json("Upload Failed: ");
                }
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        [HttpPost("delete")]
        public IActionResult DeleteUploadedFile([FromBody] UploadPathViewModel uploadPath)
        {
            try
            {
                var fileSrc = uploadPath.Link.Replace("/", @"\");
                string webRootPath = _hostingEnvironment.WebRootPath;
                string filePath  =webRootPath + fileSrc;
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}