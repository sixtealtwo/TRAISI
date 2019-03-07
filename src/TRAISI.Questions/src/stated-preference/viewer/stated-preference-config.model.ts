export interface StatedPreferenceChoice {
	label: string;
	viewCondition: string;
}

export interface StatedPreferenceConfig {
	headers: Array<string>;
	choices: Array<StatedPreferenceChoice>;
}
