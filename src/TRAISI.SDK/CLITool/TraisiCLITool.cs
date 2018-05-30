using System;
using System.IO;
using Microsoft;
using Microsoft.Extensions.CommandLineUtils;
using System.Diagnostics;
using System.Xml.Linq;
namespace TRAISI.SDK.CLITool
{


	public class TraisiCLITool
	{

		public void InitCommandLineApplication(string[] args)
		{
			CommandLineApplication cli = new CommandLineApplication();

			cli.Name = "TRAISI Question SDK CLI";
			cli.HelpOption("-?|-h|--help");


			cli.Command("Init", InitFunction);
			cli.Command("Build", BuildFunction);
			cli.Command("Question", AddQuestionDefinition);

			cli.Execute(args);
		}

		/// <summary>
		/// Creates an angular component representing a new question definition type.
		/// 
		/// </summary>
		/// <param name="addQuestionCommand"></param>
		private void AddQuestionDefinition(CommandLineApplication addQuestionCommand)
		{

			addQuestionCommand.OnExecute(() =>
			{
				return 0;
			});
		}

		/// <summary>
		/// Build command of the TRAISI CLI tool.
		/// This tool will run webpack on the front end code and
		/// will embed as a resource in the compiled assembly
		/// </summary>
		/// <param name="buildCommand"></param>
		private void BuildFunction(CommandLineApplication buildCommand)
		{

			buildCommand.OnExecute(() =>
			{

				ProcessStartInfo dotnetProcess = new ProcessStartInfo();
				dotnetProcess.FileName = "dotnet";
				dotnetProcess.Arguments = "build";
				Process.Start(dotnetProcess);

				var cmdProcess = new ProcessStartInfo
				{
					FileName = "cmd",
					RedirectStandardInput = true,
					WorkingDirectory = "."
				};
				var npmProcess = Process.Start(cmdProcess);
				npmProcess.StandardInput.WriteLine("npm i");
				npmProcess.StandardInput.WriteLine("npm run build");
				return 0;

			});

		}

		/// <summary>
		/// Init command of the TRAISI CLI tool.
		/// This command will extract and prepare current directory for
		/// building.
		/// </summary>
		/// <param name="initCommand"></param>
		private void InitFunction(CommandLineApplication initCommand)
		{

			//initCommand.Arguments

			var projectArgument = initCommand.Argument("project", 
			".csproj file to initialize.");



			initCommand.OnExecute(() =>
			{
				Console.WriteLine("Init called");

				if(!File.Exists(projectArgument.Value))
				{
					Console.Error.WriteLine("init requires the path to a valid .csproj file");
					return 1;

				}
				string[] resources = ReadAssemblyResources();

				foreach (string resource in resources)
				{
					Console.WriteLine("Extracting assembly resource: " + resource);
					ExtractAssemblyResource(resource);
				}
				return 0;
			});
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="args"></param>
		public static void Main(string[] args)
		{
			new TraisiCLITool().InitCommandLineApplication(args);
		}

		/// <summary>
		/// Reads embedded resources in the assembly
		/// </summary>
		public string[] ReadAssemblyResources()
		{
			var assembly = typeof(TraisiCLITool).Assembly;

			string[] names = assembly.GetManifestResourceNames();
			return names;

		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="resource"></param>
		public void ExtractAssemblyResource(string resource)
		{
			var assembly = typeof(TraisiCLITool).Assembly;

			using (Stream r = assembly.GetManifestResourceStream(resource))
			{
				if (!File.Exists(resource))
				{

					using (var file = new FileStream(resource, FileMode.Create, FileAccess.Write))
					{
						r.CopyTo(file);
					}
				}
				else
				{
					Console.WriteLine($"Unable to extract file: {resource}, file already exists at location.");
				}
			}

		}

		/// <summary>
		/// Uses the passed CSProj file to include necessary embedded resource tags
		/// </summary>
		private void UpdateCsProjFile(string file)
		{
			XDocument csprojDoc = XDocument.Parse(file);
			
		}



		public TraisiCLITool()
		{

		}
	}
}