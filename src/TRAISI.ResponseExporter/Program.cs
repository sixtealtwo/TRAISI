using System;
using CommandLine;
namespace Traisi.ResponseExporter {
	public class Options {
		[Option ('v', "verbose", Required = false, HelpText = "Set output to verbose messages.")]
		public bool Verbose { get; set; }
	}
	class Program {
		static void Main (string[] args) {
			Parser.Default.ParseArguments<Options> (args)
				.WithParsed<Options> (o => {
					if (o.Verbose) {
						Console.WriteLine ($"Verbose output enabled. Current Arguments: -v {o.Verbose}");
						Console.WriteLine ("TRAISI - Response Exporter -  App is in Verbose mode!");
					} else {
						Console.WriteLine ($"Current Arguments: -v {o.Verbose}");
						Console.WriteLine ("TRAISI - Response Exporter");
					}
				});
		}
	}
}