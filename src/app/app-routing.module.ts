import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { PayumoneyComponent } from './payumoney/payumoney.component';
import { PaypalComponent } from './paypal/paypal.component';
import { StripeComponent } from './stripe/stripe.component';


const routes: Routes = [
  {
    path: 'razorpay', component: RazorpayComponent
   },
   {
     path: 'payumoney', component: PayumoneyComponent

   },
   {
     path: 'paypal', component: PaypalComponent

   },
   {
     path: 'stripe', component: StripeComponent

   },
   {
     path: '', component: RazorpayComponent

   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
