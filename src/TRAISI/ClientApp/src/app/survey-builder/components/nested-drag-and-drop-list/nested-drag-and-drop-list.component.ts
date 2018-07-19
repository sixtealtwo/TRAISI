import { Component, OnInit } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';

@Component({
	selector: 'app-nested-drag-and-drop-list',
	templateUrl: './nested-drag-and-drop-list.component.html',
	styleUrls: ['./nested-drag-and-drop-list.component.scss']
})
export class NestedDragAndDropListComponent implements OnInit {

	public testTargets = [];
	public qPartQuestions: Map<number, any[]> = new Map<number, any[]>(); 
	private elementUniqueIndex: number = 0;

	constructor() {
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
	}

	ngOnInit() {
	}

	addQuestionTypeToList(qType) {

		//this.alertService.showDialog('Are you sure you want to add the question?', DialogType.confirm, () =>
		if (qType.typeName === 'Survey Part') {
			qType.partId = this.elementUniqueIndex;
			this.qPartQuestions.set(this.elementUniqueIndex++,[]);
		}
		this.testTargets.push(qType)
		//);

	}

	getQuestionPayload(index) {
		return this.testTargets[index];
	}

	getQuestionInPartPayload(partId:number) {
		return (index) => {
			return this.qPartQuestions.get(partId)[index];
		}
	}

	onDrop(dropResult:any) {
		
		if (dropResult.payload.typeName === 'Survey Part' && dropResult.removedIndex === null) {
			if (dropResult.payload.partId === undefined) {
				dropResult.payload.partId = this.elementUniqueIndex++;
			}
			if (!this.qPartQuestions.has(dropResult.payload.partId)){
				this.qPartQuestions.set(dropResult.payload.partId,[]);
			}
		}
		this.testTargets = this.applyDrag(this.testTargets, dropResult);
	}

	onDropInPart(partId:number, dropResult: any) {
		if (partId !== dropResult.payload.partId) {
			//if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
				let questionParts = this.qPartQuestions.get(partId);
				questionParts = this.applyDrag(questionParts,dropResult);
				this.qPartQuestions.set(partId, questionParts);
			//}
		} else {
			/*if (dropResult.addedIndex !== null) {
				this.testTargets.push(dropResult.payload);
			}*/
		}
	}

	shouldAcceptDrop(sourceContainerOptions, payload) {
		return true;
	}

	shouldAcceptDropPart(sourceContainerOptions, payload) {
		if (payload.typeName === 'Survey Part') {
			return false;
		}
		else {
			return true;
		}
		
		/*let thisContainer: any = this;
		
		let groupName: string = thisContainer.groupName;
		if (groupName.startsWith('builder-part-')) {
			let split: string[] = groupName.split('-');
			let partNum: number = +split[split.length -1];
			if (partNum === payload.partId) {
				return false;
			}
		}
		return true;*/

		/*if (sourceContainerOptions.groupName === 'builder-questions' || sourceContainerOptions.groupName === thisContainer) {
			return true;
		}
		return false;
*/
	}

	applyDrag = (arr, dragResult) => {
		const { removedIndex, addedIndex, payload } = dragResult;
		if (removedIndex === null && addedIndex === null) return arr;
	
		const result = [...arr];
		let itemToAdd = payload;
	
		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}
	
		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}
	
		return result;
	}

}
