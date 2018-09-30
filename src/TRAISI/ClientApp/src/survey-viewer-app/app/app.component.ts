import { setTheme } from 'ngx-bootstrap/utils';
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'traisi-survey-viewer';

	constructor() {
		setTheme('bs4');
	}
}
