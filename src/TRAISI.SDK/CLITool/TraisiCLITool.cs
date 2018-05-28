using System;
using System.IO;
using Microsoft;
using Microsoft.Extensions.CommandLineUtils;

namespace TRAISI.SDK.CLITool
{


	public class TraisiCLITool
	{

		public void InitCommandLineApplication(string[] args)
		{
			CommandLineApplication cli = new CommandLineApplication();


			cli.Command("Init", InitFunction);
			cli.Command("Build", BuildFunction);

			cli.Execute(args);
		}

		/// <summary>
		/// Build command of the TRAISI CLI tool.
		/// This tool will run webpack on the front end code and
		/// will embed as a resource in the compiled assembly
		/// </summary>
		/// <param name="buildCommand"></param>
		private void BuildFunction(CommandLineApplication buildCommand)
		{

			buildCommand.OnExecute(() => {

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

			initCommand.OnExecute(() =>
			{
				Console.WriteLine("Init called");
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

		public void ExtractAssemblyResource(string resource)
		{
			var assembly = typeof(TraisiCLITool).Assembly;

			using (Stream r = assembly.GetManifestResourceStream(resource))
			{
				using (var file = new FileStream(resource, FileMode.Create, FileAccess.Write))
				{
					r.CopyTo(file);
				}
			}

		}



		public TraisiCLITool()
		{

		}
	}
}