import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { PayumoneyComponent } from './payumoney/payumoney.component';
import { StripeComponent } from './stripe/stripe.component';
import { PaypalComponent } from './paypal/paypal.component';
import { ToastrModule } from 'ng6-toastr-notifications';
@NgModule({
  declarations: [
    AppComponent,
    RazorpayComponent,
    PayumoneyComponent,
    StripeComponent,
    PaypalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, ToastrModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
