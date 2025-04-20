import { Routes } from '@angular/router';
import { Tab1Page } from './tab1/tab1.page';
import { Tab3Page } from './tab3/tab3.page';
import { Tab2Page } from './tab2/tab2.page'; // 确保路径正确

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Tab1Page
  },
  {
    path: 'help',
    component: Tab3Page,
  },
  {
    path: 'add',
    component: Tab2Page
  },
  {
    path: 'edit/:name',
    component: Tab2Page  // 必须与导入的类名一致
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
