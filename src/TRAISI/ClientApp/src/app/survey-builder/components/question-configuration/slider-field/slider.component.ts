import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SliderComponent implements OnInit {

	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;
	public sliding: boolean = false;
	public sliderValue: number = 10;
	public min: number = 0;
	public max: number = 100;
	public interval: number = 1;


	constructor() {}

	ngOnInit() {
	}

	getValue(){
		return JSON.stringify({value: this.sliderValue});
	}

	change(value: any) {
		this.sliderValue = value.newValue;
	}

	stopSlide(event: any) {
		this.sliding = false;
	}

	startSlide(event: any) {
		this.sliding = true;
	}
}
