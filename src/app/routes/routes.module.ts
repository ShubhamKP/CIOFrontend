import { LibraryListComponent } from './../library-list/library-list.component';
import { LibraryViewComponent } from './../library-view/library-view.component';
import { UploadDocComponent } from './../upload-doc/upload-doc.component';
import { ProfessionalPagesComponent } from './../professional-pages/professional-pages.component';
import { CompaniesPageComponent } from './../companies-page/companies-page.component';
import { AuthGuard } from './../guards/auth.guard';
import { UserWelcomeComponent } from './../user-welcome/user-welcome.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { HomeComponent } from './../home/home.component';
import { CreatePasswordComponent } from './../create-password/create-password.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { ForgotPassComponent } from './../forgot-pass/forgot-pass.component';
import { UserEditProfileComponent } from '../user-edit-profile/user-edit-profile.component';
import { UserMessagesComponent } from '../user-messages/user-messages.component';
import { UserBlogPostComponent } from '../user-blog-post/user-blog-post.component';
import { UserSearchResultComponent } from '../user-search-result/user-search-result.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'createPassword',
    component: CreatePasswordComponent
  },
  {
    path: 'userDashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'welcome', component: UserWelcomeComponent },
      { path: 'editProfile', component: UserEditProfileComponent },
      { path: 'messages', component: UserMessagesComponent },
      { path: 'blogPost', component: UserBlogPostComponent },
      { path: 'searchResult', component: UserSearchResultComponent },
      { path: 'uploadDoc', component: UploadDocComponent },
      { path: 'library', component: LibraryViewComponent },
      { path: 'userProfile/:id', component: UserProfileComponent },
      { path: 'library/:type/:section', component: LibraryListComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' }
    ]
  },
  {
    path: 'adminDashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgotPassword',
    component: ForgotPassComponent
  },
  {
    path: 'companies',
    component: CompaniesPageComponent
  },
  {
    path: 'professionals',
    component: ProfessionalPagesComponent
  }
  // {
  //   path: 'mens',
  //   component: MensComponent,
  //   // canActivate: [StaffGuard]
  // },
  // {
  //   path: 'contacts',
  //   component: ContactsComponent,
  //   // canActivate: [StaffGuard]
  // },
  /*{
    path: '404',
    component: NFComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash:true})
  ],
  exports: [ RouterModule],
  declarations: []
})
export class RoutesModule { }
