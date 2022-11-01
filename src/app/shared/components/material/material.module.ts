import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatExpansionModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatExpansionModule
    ]
})
export class MaterialModule { }