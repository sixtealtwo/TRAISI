import { ElementRef } from "../node_modules/@angular/core";
import { ComponentFactory } from "../node_modules/@angular/core/src/render3";

import { ResponseTypes, SurveyQuestion } from "./survey-question";

export class SurveyModule
{

    /**
     * 
     */
    public traisiBootstrap<T extends ResponseTypes>(component: SurveyQuestion<T>): void
    {

    }
}