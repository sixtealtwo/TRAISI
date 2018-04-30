import { Component, ViewEncapsulation, OnInit, Injector, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';

import { Select2OptionData } from 'ng2-select2';

@Component({
    selector: 'app-surveys-management',
    templateUrl: './surveys-management.component.html',
    styleUrls: ['./surveys-management.component.scss'],
})
export class SurveysManagementComponent implements OnInit {


    ngOnInit(): void {
        console.log('ngOnInit');
    }
}
