import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DailyPage } from "./daily/pages/daily/daily.page";
import { WelcomePage } from "./navigation/pages/welcome/welcome.page";

const routes: Routes = [
    { path: '', component: WelcomePage },
    {
        path: 'daily',
        loadChildren: () => import('./daily/daily.module').then(module => module.DailyModule)
    },
    {
        path: 'items',
        loadChildren: () => import('./items/items.module').then(module => module.ItemsModule)
    },
    {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(module => module.ProjectsModule)
    },
    {
        path: 'communication',
        loadChildren: () => import('./communication/communication.module').then(module => module.CommunicationModule)
    },
    {
        path: 'other',
        loadChildren: () => import('./other/other.module').then(module => module.OtherModule)
    },
    {
        path: 'setup',
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
