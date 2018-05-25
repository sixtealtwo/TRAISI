using System;
using Microsoft;
using Microsoft.Extensions.CommandLineUtils;

namespace TRAISI.SDK.CLITool
{


	public class TraisiCLITool
	{
		public static void Main(string[] args)
		{
			CommandLineApplication cli = new CommandLineApplication();

			cli.Command("Init", (initCommand) =>
			{
				initCommand.OnExecute(() =>
				{
					Console.WriteLine("Init called");
					ReadAssemblyResources();
					return 0;
				});
			});

			cli.Execute(args);
		}

		/// <summary>
		/// 
		/// </summary>
		public static void ReadAssemblyResources()
		{
            var assembly = typeof(TraisiCLITool).Assembly;

			string [] names = assembly.GetManifestResourceNames();
			foreach(var name in names)
			{
				Console.WriteLine(name);
			}

		}
	}
}