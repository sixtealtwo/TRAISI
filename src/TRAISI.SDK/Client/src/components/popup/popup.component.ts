import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'traisi-popup',
	styleUrls: ['./popup.component.css'],
	templateUrl: './popup.component.html'
})
export class PopupComponent {
	public constructor() {
		console.log('test'); 
	}
}
