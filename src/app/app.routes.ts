import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/account/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/dashboard-layout').then(m => m.DashboardLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'employees',
        loadComponent: () => import('./modules/employee/list/employee-list').then(m => m.EmployeeList)
      },
      {
        path: 'employees/add',
        loadComponent: () => import('./modules/employee/create/add-employee').then(m => m.AddEmployee)
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./modules/employee/view/employee-detail').then(m => m.EmployeeDetail)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
