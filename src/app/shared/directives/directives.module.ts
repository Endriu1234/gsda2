import { NgModule } from "@angular/core";
import { DisableMatFabButtonDirective } from "./disable-control.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { DragAndDropDirective } from './drag-and-drop.directive';

@NgModule({
    declarations: [
        DisableMatFabButtonDirective,
        DragAndDropDirective
    ],
    exports: [
        DisableMatFabButtonDirective,
        DragAndDropDirective
    ],
    imports: [
        ReactiveFormsModule
    ]
})
export class DirectivesModule { }