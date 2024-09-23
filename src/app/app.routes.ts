import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client/client-home/client-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { CategoryListComponent } from './admin/admin-category/category-list/category-list.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CategoryAddComponent } from './admin/admin-category/category-add/category-add.component';
import { ProductListComponent } from './admin/admin-product/product-list/product-list.component';
import { ProductAddComponent } from './admin/admin-product/product-add/product-add.component';
import { ProductUpdateComponent } from './admin/admin-product/product-update/product-update.component';
import { ClientCategoryProductComponent } from './client/client-category-product/client-category-product.component';
import { ClientProductDetailComponent } from './client/client-product-detail/client-product-detail.component';
import { ProductDetailUpdateComponent } from './admin/admin-product/product-detail-update/product-detail-update.component';
import { CommentListComponent } from './admin/admin-comment/comment-list/comment-list.component';
import { CommentUpdateComponent } from './admin/admin-comment/comment-update/comment-update.component';
import { AuthComponent } from './auth/auth.component';
import { BasketComponent } from './features/basket/basket.component';
import { OrderComponent } from './features/order/order.component';
import { PaymentComponent } from './features/payment/payment.component';
import { OrderHistoryComponent } from './features/order/order-history/order-history.component';
import { UserMessageComponent } from './features/user-message/user-message.component';
import { AuthGuard } from './admin/auth-guard/auth.guard';
import { CheckoutComponent } from './features/order/checkout/checkout.component';


export const routes: Routes = [
  { path: '', component: ClientHomeComponent,
      children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: CatalogComponent },
          { path:'home/category-product/:id', component:ClientCategoryProductComponent },
          { path:'home/product-detail/:id', component:ClientProductDetailComponent },
          { path:'auth', component:AuthComponent },
          { path:'basket', component:BasketComponent, canActivate: [AuthGuard]},
          { path:'order', component:OrderComponent, canActivate: [AuthGuard]},
          { path:'order/payment', component:PaymentComponent, canActivate: [AuthGuard]},
          { path:'orderHistory', component:OrderHistoryComponent, canActivate: [AuthGuard]},
          { path:'checkout', component:CheckoutComponent, canActivate: [AuthGuard]}
        ]
   },
  {
    path: 'admin',component: AdminHomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'category-list', component: CategoryListComponent, canActivate: [AuthGuard] },
      { path: 'category-add', component: CategoryAddComponent, canActivate: [AuthGuard] },
      { path: 'product-list', component: ProductListComponent, canActivate: [AuthGuard] },
      { path: 'product-add', component: ProductAddComponent, canActivate: [AuthGuard] },
      { path: "product-list/product-update/:id", component:ProductUpdateComponent, canActivate: [AuthGuard] },
      { path: "product-list/product-detail-update/:id", component:ProductDetailUpdateComponent, canActivate: [AuthGuard] },
      { path: 'comment-list', component: CommentListComponent, canActivate: [AuthGuard]},
      { path: "comment-list/comment-update/:id", component: CommentUpdateComponent, canActivate: [AuthGuard]},
      { path: 'message-list', component: UserMessageComponent, canActivate: [AuthGuard]}
    ]
  }
];
