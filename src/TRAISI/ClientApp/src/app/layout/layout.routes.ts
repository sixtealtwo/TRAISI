import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
    { path: 'another-page', loadChildren: '../another/another.module#AnotherModule' },
    { path: 'account', loadChildren: '../user-info/user-info.module#UserInfoModule'},
    { path: 'preferences', loadChildren: '../user-preferences/user-preferences.module#UserPreferencesModule'}
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
