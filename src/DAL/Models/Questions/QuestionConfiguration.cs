namespace DAL.Models.Surveys {
    public class QuestionConfiguration : IQuestionConfiguration {
        public int Id { get; set; }
        public string Key { get; set; }
        public byte[] Value { get; set; }

    }
}