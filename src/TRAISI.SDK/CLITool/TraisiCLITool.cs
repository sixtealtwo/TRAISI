using System;
using System.IO;
using Microsoft;
using Microsoft.Extensions.CommandLineUtils;
using System.Diagnostics;
using System.Xml.Linq;
using System.Linq;
using System.Collections;
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
            cli.Command("Resource", AddQuestionResource);

            cli.Execute(args);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="addResourceComand"></param>
        private void AddQuestionResource(CommandLineApplication addResourceComand)
        {

            addResourceComand.HelpOption("-?|-h|--help");

            var projectArgument = addResourceComand.Argument("project",
            ".csproj file to add resource to.");

            var resourceNameArgument = addResourceComand.Argument("resource",
            "name or key to provide the resource");

            var resourceFileArgument = addResourceComand.Argument("file",
            "the path to the resource file");

            addResourceComand.OnExecute(() =>
            {

                if(!File.Exists(resourceFileArgument.Value))
                {
                    Console.Error.WriteLine("Specified resource file does not exist.");
                    return -1;
                }

                if (!File.Exists(projectArgument.Value)) {
                    Console.Error.WriteLine("init requires the path to a valid .csproj file");
                    return 1;
                }
                else
                {
                    AddResourceToProjectCsFile(projectArgument.Value,resourceNameArgument.Value, resourceFileArgument.Value);
                }

                return 0;
            });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="file"></param>
        /// <param name="resourceName"></param>
        /// <param name="resourceFile"></param>
        private void AddResourceToProjectCsFile(string file, string resourceName, string resourceFile)
        {
            XDocument csprojDoc = XDocument.Parse(File.ReadAllText(file));

            var xmlElement = new XElement("EmbeddedResource");
            xmlElement.Add(new XAttribute("Include", resourceFile));
            xmlElement.Add(new XAttribute("LogicalName", resourceName));

            var itemGroup = new XElement("ItemGroup");
            itemGroup.Add(xmlElement);

            csprojDoc.Root.Add(itemGroup);
            csprojDoc.Save(File.OpenWrite(file));
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

            CommandOption projectName = initCommand.Option("-n |--name <name>",
            "A custom name for generated modules and files",
            CommandOptionType.SingleValue);

            string project = "";

            initCommand.OnExecute(() =>
            {
                Console.WriteLine("Initializing...");

                if (projectName.HasValue()) {
                    project = projectName.Value();
                }
                else {
                    project = Path.GetFileName(Environment.CurrentDirectory);
                }


                if (!File.Exists(projectArgument.Value)) {
                    Console.Error.WriteLine("init requires the path to a valid .csproj file");
                    return 1;

                }
                string[] resources = ReadAssemblyResources();

                foreach (string resource in resources) {
                    Console.WriteLine("Extracting assembly resource: " + resource);
                    ExtractAssemblyResource(resource, project);
                }


                Console.WriteLine("Updating .csproj file...");
                UpdateCsProjFile(projectArgument.Value);

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
        public void ExtractAssemblyResource(string resource, string projectName)
        {
            var assembly = typeof(TraisiCLITool).Assembly;

            using (Stream r = assembly.GetManifestResourceStream(resource)) {
                if (!File.Exists(resource)) {
                    var reader = new StreamReader(r);
                    string contents = reader.ReadToEnd();

                    contents = contents.Replace("$(ProjectName)", projectName);

                    File.WriteAllText(resource, contents);
                }
                else {
                    Console.WriteLine($"Unable to extract file: {resource}, file already exists at location.");
                }
            }

        }

        /// <summary>
        /// Uses the passed CSProj file to include necessary embedded resource tags
        /// </summary>
        private void UpdateCsProjFile(string file)
        {

            try {
                XDocument csprojDoc = XDocument.Parse(File.ReadAllText(file));

                var xmlElement = new XElement("EmbeddedResource");
                xmlElement.Add(new XAttribute("Include", "dist/*.module.js"));

                var itemGroup = new XElement("ItemGroup");
                itemGroup.Add(xmlElement);

                var itemGroupElements = from n in csprojDoc.Descendants("ItemGroup") select n;

                var matched = false;
                foreach (var element in itemGroupElements) {
                    if (XNode.DeepEquals(itemGroup, element)) {
                        matched = true;
                        break;
                    }
                }
                //add element only if not previously existing
                if (!matched) {
                    csprojDoc.Root.Add(itemGroup);
                }

                csprojDoc.Save(File.OpenWrite(file));
            }
            catch (Exception e) {

                throw e;
            }


        }

        public TraisiCLITool()
        {

        }
    }
}