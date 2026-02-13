import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { MenuComponent } from './features/menu/menu.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './features/about/about.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminInventoryComponent } from './features/admin/admin-inventory/admin-inventory.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent }, 
            { path: 'menu', component: MenuComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'admin/login', component: LoginComponent },
           {
                path: 'admin',
                canActivate: [authGuard], 
                children: [
                    { path: '', component: AdminOrdersComponent },
                    { path: 'inventory', component: AdminInventoryComponent } 
                ]
            },

            { path: '**', redirectTo: '' }
        ]
    }
];
