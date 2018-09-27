import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss']
})
export class Header1Component implements OnInit {

	public quillModules = {
		blotFormatter: { },
		toolbar: [
			['image'],
			[{ align: [] }]
		],

	};

	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

	updateContent(contentInfo: any) {
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
