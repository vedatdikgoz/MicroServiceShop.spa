import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client/client-home/client-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { CategoryListComponent } from './admin/admin-category/category-list/category-list.component';
import { ClientCarouselComponent } from './client/client-carousel/client-carousel.component';


export const routes: Routes = [
    { path: '', component: ClientHomeComponent,
        children: [
            { path: 'carousel', component: ClientCarouselComponent }
          ]
     },
    {
      path: 'admin',component: AdminHomeComponent,
      children: [
        { path: 'category', component: CategoryListComponent }
      ]
    }
];
