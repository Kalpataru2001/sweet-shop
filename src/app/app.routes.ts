import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { MenuComponent } from './features/menu/menu.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './features/about/about.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent }, // Default route loads Home
      // We will add 'menu' and 'contact' here later
      { path: 'menu', component: MenuComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'checkout', component: CheckoutComponent },
    ]
  }
];
