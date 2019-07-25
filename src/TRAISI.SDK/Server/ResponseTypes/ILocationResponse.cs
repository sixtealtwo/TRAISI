namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface ILocationResponse : IResponseType
    {
        double Latitude { get; set; }

        double Longitude { get; set; }

        string Address { get; set; }
    }
}