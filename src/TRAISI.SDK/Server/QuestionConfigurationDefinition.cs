using TRAISI.SDK.Enums;

namespace TRAISI.SDK {
	public class QuestionConfigurationDefinition {
		public string Name { get; set; }

		public string Description { get; set; }

		public ConfigurationValueType ValueType { get; set; }

		public QuestionBuilderType BuilderType { get; set; }

		public object TypeId { get; set; }

		public object DefaultValue { get; set; }

		public string SharedResource { get; set; }

		public byte[] ResourceData { get; set; }

		public bool IsTranslatable { get; set; }
	}
}