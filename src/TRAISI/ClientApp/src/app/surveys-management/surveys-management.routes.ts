import { Routes, RouterModule } from '@angular/router';
import { SurveysManagementComponent } from './surveys-management.component';
// import { UsersManagementComponent } from './users-management/users-management.component';
// import { RolesManagementComponent} from './roles-management/roles-management.component';

const routes: Routes = [
  { path: '', component: SurveysManagementComponent, data: { title: 'Manage Surveys' } },
];

export const ROUTES = RouterModule.forChild(routes);
