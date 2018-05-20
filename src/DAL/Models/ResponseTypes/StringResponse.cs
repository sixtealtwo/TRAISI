namespace DAL.Models.ResponseTypes {
    public class StringResponse : IResponseType<string> {
        public int Id { get; set; }

        public string Value { get; set; }
    }
}