import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../core/interceptor/custom-http-interceptor';


/* Inner Component */
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { Login2Component } from './login2.component';
import { Login3Component } from './login3.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    LoginComponent
  ],
  declarations: [
    Login2Component,
    Login3Component
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    { provide: COMPOSITION_BUFFER_MODE, useValue: false},
    LoginService
  ],
  exports: [
    LoginComponent,
    Login2Component,
    Login3Component
  ]
})
export class LoginModule { }
