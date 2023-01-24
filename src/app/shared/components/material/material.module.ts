import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatExpansionModule,
        MatChipsModule,
        MatListModule,
        MatCardModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatExpansionModule,
        MatChipsModule,
        MatListModule,
        MatCardModule
    ]
})
export class MaterialModule { }