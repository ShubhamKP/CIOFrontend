import { AuthGuard } from './guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr/ng2-toastr';

import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { NativeService } from "./http-services/native.services";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OpentokService } from './common/opentok.service';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RoutesModule } from './routes/routes.module';
import { HomeComponent } from './home/home.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component'
import { bind } from '@angular/core/src/render3/instructions';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';
import { UserEditProfileComponent } from './user-edit-profile/user-edit-profile.component';
import { UserBlogPostComponent } from './user-blog-post/user-blog-post.component';
import { UserMessagesComponent } from './user-messages/user-messages.component';
import { UserSearchResultComponent } from './user-search-result/user-search-result.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ToastrService } from './http-services/toastr.service';
import { CompaniesPageComponent } from './companies-page/companies-page.component';
import { ProfessionalPagesComponent } from './professional-pages/professional-pages.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { LibraryViewComponent } from './library-view/library-view.component';
import { LibraryListComponent } from './library-list/library-list.component';
import { WebinarSubscriberComponent } from './webinar-subscriber/webinar-subscriber.component';
import { WebinarPublisherComponent } from './webinar-publisher/webinar-publisher.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    CreatePasswordComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    ForgotPassComponent,
    UserWelcomeComponent,
    UserEditProfileComponent,
    UserBlogPostComponent,
    UserMessagesComponent,
    UserSearchResultComponent,
    UserProfileComponent,
    CompaniesPageComponent,
    ProfessionalPagesComponent,
    UploadDocComponent,
    LibraryViewComponent,
    LibraryListComponent,
    WebinarSubscriberComponent,
    WebinarPublisherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LinkedInSdkModule,
    ReactiveFormsModule,
    HttpModule,
    RoutesModule,
    ToastModule
  ],
  providers: [
    NativeService,
    ToastrService,
    AuthGuard,
    ToastsManager,
    ToastOptions,
    OpentokService,
    // Inject apiKey and, optionally, authorize to integrate with LinkedIN official API
    { provide: 'apiKey', useValue: '819wq9dc77z5sn' },
    { provide: 'authorize', useValue: 'true' }, // OPTIONAL by default: false
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
