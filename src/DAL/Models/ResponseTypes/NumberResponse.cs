namespace DAL.Models.ResponseTypes {
    public class NumberResponse : IResponseType<double> {
        public int Id { get; set; }

        public double Value { get; set; }

    }
}