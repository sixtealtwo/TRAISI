namespace DAL.Models.ResponseTypes {
    public class LocationResponse : IResponseType<object> {
        public int Id { get; set; }

        public object Value { get; set; }

    }
}