using System;
using Microsoft;
using Microsoft.Extensions.CommandLineUtils;

namespace TRAISI.SDK.CLITool
{
    public class Program
    {
        public static void Main(string [] args)
        {
            CommandLineApplication cli = new CommandLineApplication();

            cli.Command("Init", (initCommand) =>
            { 
                initCommand.OnExecute(() =>
                {
                    Console.WriteLine("Init called");
                    return 0;
                });
            });

            cli.Execute(args);
        }
    }
}