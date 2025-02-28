import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LayoutComponent } from './layout/layout.component';
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
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReportBugOrRequestFeatureComponent } from './report-bug-or-request-feature/report-bug-or-request-feature.component';
import { CreateNewEventComponent } from './create-new-event/create-new-event.component';
import { CreateNewTaskComponent } from './create-new-task/create-new-task.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { ToastrModule } from 'ngx-toastr';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AddInfluencerToListComponent } from './add-influencer-to-list/add-influencer-to-list.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule, // Import browser animations
    ToastrModule.forRoot({ 
      closeButton: true, 
      positionClass: 'toast-bottom-right', 
      timeOut: 3000 
    }) // Configure Toastr
  ],
  providers: [importProvidersFrom(HttpClientModule), provideHttpClient(withInterceptors([httpInterceptor])), provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
