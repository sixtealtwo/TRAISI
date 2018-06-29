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

namespace TRAISI.Helpers
{
	public interface ICodeGeneration
	{
      string generateCodeByLength(int surveyId, int codeLength);
			string generateCodeByPattern(int surveyId, string pattern);
			void generateShortCodes(CodeGeneration parameters, Survey survey);
			void generateGroupCodes(CodeGeneration parameters, Survey survey);
	}

    public class CodeGenerationService: ICodeGeneration
    {
        private IUnitOfWork _unitOfWork;

				public CodeGenerationService(IUnitOfWork unitOfWork)
				{
					this._unitOfWork = unitOfWork;
				}

				public void generateShortCodes(CodeGeneration parameters, Survey survey) 
				{
					for(int i = 0; i < parameters.NumberOfCodes; i++)
					{
						string codeString;
						if(parameters.UsePattern)
						{
							codeString = generateCodeByPattern(parameters.SurveyId, parameters.Pattern);
						}
						else
						{
							codeString = generateCodeByLength(parameters.SurveyId, parameters.CodeLength);
						}

						Shortcode newCode = new Shortcode()
						{
								Survey = survey,
								Code = codeString,
								IsTest = parameters.IsTest,
								CreatedDate  = DateTime.UtcNow
						};
						_unitOfWork.Shortcodes.Add(newCode);
					}	
				}

				public void generateGroupCodes(CodeGeneration parameters, Survey survey)
				{
					string codeString;
					if(parameters.UsePattern)
					{
						codeString = generateCodeByPattern(parameters.SurveyId, parameters.Pattern);
					}
					else
					{
						codeString = generateCodeByLength(parameters.SurveyId, parameters.CodeLength);
					}

					GroupCode newCode = new GroupCode()
					{
								Survey = survey,
								Code = codeString,
								Name = parameters.GroupName,
								IsTest = parameters.IsTest,
								CreatedDate  = DateTime.UtcNow
					};
					_unitOfWork.GroupCodes.Add(newCode);
				}

				public string generateCodeByLength(int surveyId, int codeLength)
				{
					bool uniqueCodeFound = false;
					string code;
					do {
							code = codeFunction(codeLength);
							if(this._unitOfWork.GroupCodes.isUniqueGroupCodeForSurvey(surveyId, code) && this._unitOfWork.Shortcodes.UniqueShortCodeForSurvey(surveyId, code))
							{
								uniqueCodeFound = true;
							}
					} while (uniqueCodeFound);
					return code;
				}

				public string generateCodeByPattern(int surveyId, string pattern)
				{
					bool uniqueCodeFound = false;
					string code;
					do{
							code = codePatternFunction(pattern);
							if(this._unitOfWork.GroupCodes.isUniqueGroupCodeForSurvey(surveyId, code) && this._unitOfWork.Shortcodes.UniqueShortCodeForSurvey(surveyId, code))
							{
								uniqueCodeFound = true;
							}
						}while (uniqueCodeFound);
					return code;
				}


				private string codeFunction(int codeLength)
				{
					string code = Path.GetRandomFileName().Substring(0,codeLength);
					return code.ToUpper();
				}

				private string codePatternFunction(string pattern)
				{
					char[] patternArray = pattern.ToUpper().ToCharArray();
					patternArray = patternArray.Select(c => c=='C'?randomLetter(): c=='#'?randomNumber():'-').ToArray();
					return new string(patternArray);
				}

				private char randomLetter()
				{
					string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					Random rand = new Random();
					int num = rand.Next(0, chars.Length -1);
					return chars[num];
				}

				private char randomNumber()
				{
					Random random = new Random();  
    			int randomNumber = random.Next(0, 9);
					char gen = '0';
					gen += (char)randomNumber;
					return gen;
				}
    }

}