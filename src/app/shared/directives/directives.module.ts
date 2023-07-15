import { NgModule } from "@angular/core";
import { DisableMatFabButtonDirective } from "./disable-control.directive";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        DisableMatFabButtonDirective
    ],
    exports: [
        DisableMatFabButtonDirective
    ],
    imports: [
        ReactiveFormsModule
    ]
})
export class DirectivesModule { }