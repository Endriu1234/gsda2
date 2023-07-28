import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DailyPage } from "./daily/pages/daily/daily.page";
import { WelcomePage } from "./navigation/pages/welcome/welcome.page";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    { path: '', component: WelcomePage },
    {
        path: 'daily',
        canActivate: [AuthGuard],
        loadChildren: () => import('./daily/daily.module').then(module => module.DailyModule)
    },
    {
        path: 'items',
        canActivate: [AuthGuard],
        loadChildren: () => import('./items/items.module').then(module => module.ItemsModule)
    },
    {
        path: 'projects',
        canActivate: [AuthGuard],
        loadChildren: () => import('./projects/projects.module').then(module => module.ProjectsModule)
    },
    {
        path: 'communication',
        canActivate: [AuthGuard],
        loadChildren: () => import('./communication/communication.module').then(module => module.CommunicationModule)
    },
    {
        path: 'other',
        canActivate: [AuthGuard],
        loadChildren: () => import('./other/other.module').then(module => module.OtherModule)
    },
    {
        path: 'setup',
        canActivate: [AuthGuard],
        loadChildren: () => import('./setup/setup.module').then(module => module.SetupModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
