import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
    { path: 'another-page', loadChildren: '../another/another.module#AnotherModule' },
    { path: 'account', loadChildren: '../user-info/user-info.module#UserInfoModule'}
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
