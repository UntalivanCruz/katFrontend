import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardian } from './api/services/login.guardian.service';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { 
    path: '',
    component: MenuComponent,
    canActivate:[LoginGuardian],
    children:[
      {path:'home', component:HomeComponent},
      {path:'invoice',component:InvoiceComponent}
    ]
},
{
  path:"**",component:ErrorComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
