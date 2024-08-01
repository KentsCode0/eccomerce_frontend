import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/user/login/login.component';
import { RegisterComponent } from './core/pages/user/register/register.component';
import { ProductListComponent } from './core/pages/main/product-list/product-list.component';
import { CartListComponent } from './core/pages/main/cart-list/cart-list.component';
import { PaymentComponent } from './core/pages/main/payment/payment.component';
import { ProductItemComponent } from './core/pages/main/product-item/product-item.component';
import { HandleproductsComponent } from './core/pages/handleproducts/handleproducts.component';
import { AdminComponent } from './core/pages/admin/admin.component';
import { ProfileComponent } from './core/pages/user/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'product-list',
        component: ProductListComponent
    },
    {
        path: 'cart',
        component: CartListComponent
    },
    {
        path: 'payment',
        component: PaymentComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'handle-products',
        component: HandleproductsComponent
    },
];
