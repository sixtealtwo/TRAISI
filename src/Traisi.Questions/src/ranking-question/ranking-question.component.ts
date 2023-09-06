import { Component, OnInit, ViewChild } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	QuestionConfiguration,
	SurveyViewer,
	QuestionOption,
	ResponseValidationState,
	ResponseData,
} from 'traisi-question-sdk';
import templateString from './ranking-question.component.html';
import styleString from './ranking-question.component.scss';
import { NgForm } from '@angular/forms';
import { debounceTime, skip } from 'rxjs/operators';
@Component({
	selector: 'ranking-question',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class RankingQuestionComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor() {
		super();
	}

	public rowLabels: string[] = [];
	public columnLabels: string[] = [];

	public ngOnInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	public model = {};

	@ViewChild('matrixForm')
	public form: NgForm;

	public entryWidth: number = 0;
	public rowHeaderWidth: number = 0;

	private onSavedResponseData: (response: ResponseData<ResponseTypes.Json>[] ) => void = (
		response: ResponseData<ResponseTypes.Json>[] 
	) => {
		if (response.length > 0) {
			console.log("Loading saved data...");
			console.log(response);
			let model = JSON.parse(response[0]['value']);
			this.model = model[0];
		}

		let loadSubscription = this.form.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
			this.updateCheckedColumns("load");
			loadSubscription.unsubscribe();
		});
	};

	public onOptionsLoaded(options: QuestionOption[]): void {
		// this.options = options;
		for (let i of options) {
			if (i['name'] === 'Row Options') {
				this.rowLabels.push(i['label']);
			} else {
				this.columnLabels.push(i['label']);
			}
		}

		this.calculateDimensions();
	}

	public calculateDimensions(): void {
		this.rowHeaderWidth = 10;
		this.entryWidth = (100 - this.rowHeaderWidth) / this.columnLabels.length;
	}

	/**
	 * @param {*} event
	 * @param {*} id
	 */
	public changed(event, id): void {

		this.updateCheckedColumns(id);
	}

	public updateCheckedColumns(id) {
		var radioButtons = document.querySelectorAll("input[type=radio]");
		const checkedColumns = new Set();
		for (let i = 0; i < radioButtons.length; i++) {
			let radio = radioButtons[i];
			if ((radio as any).checked == true) {
				checkedColumns.add(radio.id.split("customRadio")[1].split("_")[1]);
			}
		}

		console.log("checking columns");
		console.log(checkedColumns);

		for (let i = 0; i < radioButtons.length; i++) {
			let radio = radioButtons[i];
			if (checkedColumns.has(radio.id.split("customRadio")[1].split("_")[1])) {
				//radio.parentElement.style.backgroundColor = "rgb(222, 222, 222)";
				//(radio as any).disabled = true;

				if (radio.id.split("customRadio")[1].split("_")[1] == id.split("_")[1] &&
					radio.id.split("customRadio")[1].split("_")[0] != id.split("_")[0]) {
					(radio as any).checked = false;
				}

			}
			else {
				(radio as any).disabled = false;
				if (parseInt(radio.id.split("customRadio")[1].split("_")[0]) % 2 != 0) {
					radio.parentElement.style.backgroundColor = "white";
				}
				else {
					radio.parentElement.style.backgroundColor = "rgb(238, 245, 252)";
				}
			}
		}

		if (checkedColumns.size != this.columnLabels.length){
			this.validationState.emit(ResponseValidationState.INVALID);
		}
		else if (this.form.valid) {
			this.response.emit(this.model);
			this.validationState.emit(ResponseValidationState.VALID);
		}
	}

	public clearAll(event): void {
		console.log("Clearing all radio buttons");
		for (let row = 0; row < this.rowLabels.length; row++) {
			for (let col = 0; col < this.columnLabels.length; col++) {
				if (row % 2 != 0) {
					document.getElementById(this.questionId + "-customRadio" + row + "_" + col).parentElement.style.backgroundColor = "white";
				}
				else {
					document.getElementById(this.questionId + "-customRadio" + row + "_" + col).parentElement.style.backgroundColor = "rgb(238, 245, 252)";
				}
				(document.getElementById(this.questionId + "-customRadio" + row + "_" + col) as any).checked = null;
				(document.getElementById(this.questionId + "-customRadio" + row + "_" + col) as any).disabled = false;
			}
		}

		this.validationState.emit(ResponseValidationState.INVALID);
		this.form.form.markAsPristine();
		this.form.form.markAsUntouched();
		this.form.form.updateValueAndValidity();
	}

	public traisiOnInit(): void {
		// this.validationState.emit(ResponseValidationState.VALID);
	}
}
