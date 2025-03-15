import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FindInfluencersComponent } from './find-influencers/find-influencers.component';
import { InfluencerListsComponent } from './influencer-lists/influencer-lists.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotesComponent } from './notes/notes.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MembershipComponent } from './membership/membership.component';
import { ContactSupportComponent } from './contact-support/contact-support.component';
import { AdminComponent } from './admin/admin.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'}, //may need to change redirectTo dashboard
  { path: 'login', canActivate: [guestGuard], component: LoginComponent},
  { path: 'register', component: SignupComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {
      path: '', 
      component: LayoutComponent,
      children: [
          {
              path: 'dashboard',
              canActivate: [authGuard],
              component: DashboardComponent,
              title: 'Dashboard'
          },
          {
              path: 'calendar',
              component: CalendarComponent,
              title: 'Calendar'
          },
          {
              path: 'find-influencers',
              component:FindInfluencersComponent,
              title: 'Find Influencers'
          },
          {
              path: 'influencer-lists',
              component: InfluencerListsComponent,
              title: 'Influencer Lists'
          },
          {
              path: 'tasks',
              component: TasksComponent,
              title: 'Tasks'
          },
          {
              path: 'notes',
              component: NotesComponent,
              title: 'Notes'
          },
          {
              path: 'campaigns',
              component: CampaignsComponent,
              title: 'Campaigns'
          },
          {
              path: 'my-profile',
              component: MyProfileComponent,
              title: 'My Profile'
          },
          {
              path: 'membership',
              component: MembershipComponent,
              title: 'Membership'
          },
          {
              path: 'contact-support',
              component: ContactSupportComponent,
              title: 'Contact Support'
          },
          {
              path: 'admin',
              component: AdminComponent,
              title: 'Admin'
          }       
      ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }  // Use HashLocationStrategy here
  ]
})
export class AppRoutingModule { }