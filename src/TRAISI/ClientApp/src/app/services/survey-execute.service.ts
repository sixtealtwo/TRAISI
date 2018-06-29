import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {forkJoin as observableForkJoin,  Observable ,  Subject } from 'rxjs';
import { SurveyExecuteEndpointService } from './survey-execute-endpoint.service';
import { CodeGenerator } from '../models/code-generator.model';
import { ShortCode } from '../models/short-code.model';
import { GroupCode } from '../models/group-code.model';

@Injectable({ providedIn: 'root'})
export class SurveyExecuteService {


	constructor(private _surveyExecuteEndpointService: SurveyExecuteEndpointService) {}


	public listSurveyShortCodes(id: number, page: number, pageSize: number) {
		return this._surveyExecuteEndpointService.getSurveyShortCodesEndpoint<ShortCode[]>(id, page, pageSize);
	}

	public listSurveyGroupCodes(id: number, page: number, pageSize: number) {
		return this._surveyExecuteEndpointService.getSurveyGroupCodesEndpoint<GroupCode[]>(id, page, pageSize);
	}

	public createSurveyShortCodes(codeGenParams: CodeGenerator) {
		return this._surveyExecuteEndpointService.getCreateSurveyShortCodesEndpoint<CodeGenerator>(codeGenParams);
	}

	public createSurveyGroupCodes(codeGenParams: CodeGenerator) {
		return this._surveyExecuteEndpointService.getCreateSurveyGroupCodesEndpoint<CodeGenerator>(codeGenParams);
	}

}
