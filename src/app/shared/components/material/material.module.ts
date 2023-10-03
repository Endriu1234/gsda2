import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgrxMatSelectViewAdapter } from "./mat-select-view-adapter";
import { CustomErrorStateMatcherDirective } from "./error-state-matcher";
import { MatListOptionFixDirective } from "./mat-list-option-fix";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatExpansionModule,
        MatChipsModule,
        MatListModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTabsModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        DragDropModule,
        MatTooltipModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule
    ],
    declarations: [
        NgrxMatSelectViewAdapter,
        CustomErrorStateMatcherDirective,
        MatListOptionFixDirective
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatExpansionModule,
        MatChipsModule,
        MatListModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTabsModule,
        MatCheckboxModule,
        NgrxMatSelectViewAdapter,
        CustomErrorStateMatcherDirective,
        MatListOptionFixDirective,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        DragDropModule,
        MatTooltipModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { float: 'always' } },
    ],
})
export class MaterialModule { }