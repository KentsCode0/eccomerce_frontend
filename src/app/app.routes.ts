import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/user/login/login.component';
import { RegisterComponent } from './core/pages/user/register/register.component';
import { ProductListComponent } from './core/pages/main/product-list/product-list.component';
import { CartListComponent } from './core/pages/main/cart-list/cart-list.component';
import { PaymentComponent } from './core/pages/main/payment/payment.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
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
];
