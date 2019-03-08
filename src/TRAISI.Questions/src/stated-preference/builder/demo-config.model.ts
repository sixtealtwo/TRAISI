import { StatedPreferenceConfig } from '../stated-preference-config.model';

let demoConfig: StatedPreferenceConfig = {
	headers: ["Choice A", "Choice B", "Choice C"],
	choices: [
		{
			items: [{
				label: 'Inner TextA',
				viewCondition: ''
			}, {
				label: 'Inner TextA',
				viewCondition: ''
			}, {
				label: 'Inner TextA',
				viewCondition: ''
			}
			]
		}, {
			items: [{
				label: 'Inner TextB',
				viewCondition: ''
			}, {
				label: 'Inner TextB',
				viewCondition: ''
			}, {
				label: 'Inner TextB',
				viewCondition: ''
			}
			]
		},
		{
			items: [{
				label: 'Inner TextC',
				viewCondition: ''
			}, {
				label: 'Inner TextC',
				viewCondition: ''
			}, {
				label: 'Inner TextC',
				viewCondition: ''
			}
			]
		}

	]
};

export default demoConfig;
