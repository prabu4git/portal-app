import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';


import { fakeBackendProvider } from './_helpers';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { UserComponent } from './user/user.component';
import { ProjectDetailComponent } from './project/project-details.component';
import {AddUserComponent} from './user/add-user.component';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, ProjectService} from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { HeaderComponent } from './shared';
import { FooterComponent } from './shared';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupAnchorDirective } from './modules/popup.anchor-target.directive';
import {ProjectComponent} from './project/project.component';




@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ProjectDetailComponent,
    AddUserComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    ProjectComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    PopupAnchorDirective

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownListModule,
    PopupModule,
    InputsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ProjectService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
