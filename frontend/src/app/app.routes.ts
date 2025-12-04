import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/task1',
    pathMatch: 'full'
  },
  {
    path: 'task1',
    loadComponent: () => import('./pages/chart-browser/chart-browser.component').then(m => m.ChartBrowserComponent)
  },
  {
    path: 'task2',
    loadComponent: () => import('./pages/chart-calculator/chart-calculator.component').then(m => m.ChartCalculatorComponent)
  },
  {
    path: 'update-chart/:id',
    loadComponent: () => import('./pages/update-chart/update-chart.component').then(m => m.UpdateChartComponent)
  },
];

