namespace DAL.Models.Surveys
{
    public interface IExtensionConfiguration
    {
        int Id { get; set; }

        string ExtensionName { get; set; }

        string Configuration { get; set; }

    }
}