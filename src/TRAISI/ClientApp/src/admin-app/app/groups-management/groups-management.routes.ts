import { Routes, RouterModule } from '@angular/router';
import { GroupsManagementComponent } from './groups-management.component';


const GroupManagementRoute: Routes = [
	{ path: '', component: GroupsManagementComponent, data: { title: 'Manage Groups' } },
];

export const GroupManagementRouteModule = RouterModule.forChild(GroupManagementRoute);
