/**
 * Scheduler configurationion interface
 */
export interface TravelDiarySchedulerConfiguration {
	mode: Array<{
		label: string;
		icon: string;
		id: string;
	}>;
	purpose: Array<{
		label: string;
		icon: string;
		id: string;
	}>;
	schoolLocations: Array<{
		id: string;
		label: string;
		value: string;
	}>;
	workLocations: Array<{
		id: string;
		label: string;
		value: string;
	}>;
}
