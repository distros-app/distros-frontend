import { AfterViewInit, Component, HostListener, inject, OnInit, ViewContainerRef } from '@angular/core';
import { MatCommonModule, MatOptionModule, MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FindInfluencersService } from './find-influencers.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddInfluencerToListComponent } from '../add-influencer-to-list/add-influencer-to-list.component';
//import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { AllFiltersComponent } from '../all-filters/all-filters.component';
import { MatMenuModule} from '@angular/material/menu';
import { TitlecaseNamePipe } from '../actions/titlecase-name.pipe';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/model/common.model';
import { HideInfluencerComponent } from '../hide-influencer/hide-influencer.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { debounce } from 'lodash';

let self: any;
@Component({
  selector: 'app-find-influencers',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatFormFieldModule, MatSelectModule, FormsModule,
            ReactiveFormsModule, NgFor, NgIf, MatMenuModule, NgClass, InfiniteScrollModule, TitlecaseNamePipe],
  templateUrl: './find-influencers.component.html',
  styleUrls: ['./find-influencers.component.scss']
})
export class FindInfluencersComponent implements OnInit {
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault(); // optional, prevents default form submission
    this.fetchAllInfluencers(true);
  }

  toastrService = inject(ToastrService);
  authService = inject(AuthService);
  keywordSearch: string = '';
  showToast: boolean = false;
  nextPeriod: any;
  isLoading: boolean = false;
  isFooterVisible: boolean = true;
  hasMoreData: boolean = true;
  sortColumn = '';  // The column currently being sorted
  sortDirection = 'asc';  // Default sort direction
  allInfluencers: Array<any> = [];
  displayedInfluencers: any = []; // Data to be shown on the table
  pageSize = 10; // Number of items to load per scroll
  currentPage = 0;
  emailsViewed!: number;
  emailViewLimit!: number;
  user!: User;
  platformDropdownSelected: string = 'Platform';
  followersDropdownSelected: string = 'Followers';
  categoryDropdownSelected: string = 'Category';
  excludeHiddenDropdownSelected: boolean = true;
  excludeInListDropdownSelected: boolean = true;
  isPageLoaded: boolean = false
  nextPeriodStartTime!: string;
  csvColumns: Array<string> = ['Name', 'Category', 'Platform', 'Followers', 'Engagement', /*'Location'*/];
  countries: Array<string> = ["United States", "Canada", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and/or Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France, Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States minor outlying islands", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City State", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zaire", "Zambia", "Zimbabwe"];
  query: any = {
    page: 1,
    limit: 10, //change to 20 later
    userId: '',
    platform: '',
    followers: '',
    category: '',
    country: '',
    keywords: '',
    excludesInfluencersInLists: true,
    excludeHiddenInfluencers: true
  }
  
  constructor(private FindInfluencersService: FindInfluencersService,
              public _viewContainerRef: ViewContainerRef,
              public _dialog: MatDialog,
              private _toastr: ToastrService,
              private router: Router
  ) {
    self = this;
    this.onScroll = debounce(this.onScroll.bind(this), 200); // Debounce to 200ms
  }

  ngOnInit() {
     //token=apify_api_6eUggFxip0w6sGQbbX7T0jjFctbRsF47xxJn (Apify API token)
    this.platformDropdownSelected = 'Instagram'; //TEMPORARY (WE'LL ADD NEW PLATFORMS LATER)
    this.query.platform = 'Instagram'; //TEMPORARY (WE'LL ADD NEW PLATFORMS LATER)
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.query.userId = this.user?._id;

        this.emailsViewed = Number(this.user.influencersEmailViewedCount);
        if(this.user.tempViewLimit) {
          this.emailViewLimit = this.user.tempViewLimit;
        } else {
          if(this.user.subscription.type === 'FREE') this.emailViewLimit = 25;
          if(this.user.subscription.type === 'PRO') this.emailViewLimit = 500;
          if(this.user.subscription.type === 'SCALE') this.emailViewLimit = 2000;
        }
        this.nextPeriod = this.user?.nextPaymentDate?.split(',')[0];

        const dateObj = new Date(this.user?.nextPaymentDate);
        // Extract hours and minutes
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        // Convert 24-hour format to 12-hour format
        hours = hours % 12 || 12;
        this.nextPeriodStartTime = `${hours}:${minutes} ${ampm}`;

        const savedFilters = localStorage.getItem('filters');
        if (savedFilters) {
          const filters = JSON.parse(savedFilters);
          this.query.excludesInfluencersInLists = filters[0].checked;
          this.query.excludeHiddenInfluencers = filters[1].checked;
        }

        this.isPageLoaded = true;
        this.isLoading = false;
      }
    })
  }

  canResetEmailViews() {
    const today = new Date().toLocaleString(); // Get current date in local time
    const todaysDate = today.split(',')[0];
    const nextPaymentDate = this.user?.nextPaymentDate?.split(',')[0];
    if(todaysDate == nextPaymentDate || todaysDate > nextPaymentDate) {
      let resetCountQuery = {
        user: this.user
      }

      this.authService.resetViewCount(resetCountQuery).subscribe({
        next: (response: any) => {
          this.emailsViewed = 0;
          return true;
        }
      })
    }
    return false;
  }

  onScroll(event: any): void {
    if(this.emailsViewed != this.emailViewLimit) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight -10 && !this.isLoading && this.hasMoreData) {
        this.fetchAllInfluencers();
      }
    }
  }

  viewEmail(influencer: any) {
    if(!this.user.influencersEmailViewed.includes(influencer._id)) {
      let updateCountQuery = {
        userId: this.user._id,
        influencerId: influencer._id,
        requestId: ''
      }
      
      this.authService.updateViewCount(updateCountQuery).subscribe({
        next: (response: any) => {
          this.user = response.data;
          this.emailsViewed = response.data.influencersEmailViewedCount;
        }
      })
    }
  }

  openInfluencerDetailsModal() {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.hasBackdrop = true;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.minWidth = '90vw';
    config.maxWidth = '90vw';
    config.minHeight = '70vh';
    config.maxHeight = '70vh';
    //self.dialogRef = this._dialog.open(FindInfluencersModalComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
       
        if (result) {
          
        }
      });
  }

  onUpgrade() {
    this.router.navigate(['/membership']);
  }

  closeFooter() {
    this.isFooterVisible = false;
  }

  openHideInfluencerModal(influencer: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '35vw';
    config.maxWidth = '35vw';
    config.minHeight = '48vh';
    config.maxHeight = '48vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(HideInfluencerComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.influencer = influencer;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
      
        }
      });
  }

  openAddToListModal(influencer: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '35vw';
    config.maxWidth = '35vw';
    config.minHeight = '60vh';
    config.maxHeight = '60vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(AddInfluencerToListComponent, config);
    self.dialogRef.componentInstance.data = [];
    self.dialogRef.componentInstance.newInfluencer = influencer;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          this.isLoading = true;
          this.fetchAllInfluencers(true);
        }
      });
  }

  onKeywordSearch(keywords: any) {
    this.query.keywordSearch = keywords;
  }

  // Sort function that sorts the influencers based on the column
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Toggle sort direction if clicking the same column again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set sort direction to ascending when changing columns
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform the sorting based on the column and direction
    this.allInfluencers.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  unhideInfluencer(index: number) {
    let unhideQuery = { _id: this.allInfluencers[index]._id, userId: this.user._id };

    this.FindInfluencersService.unhideInfluencer(unhideQuery).subscribe((response: any) => {
      if(response) {
        _.pull(this.allInfluencers[index].hideFromUsers, this.user._id);
      }
    });
  }

  hideInfluencer(index: number) {
    const itemToRemove = document.getElementById(`item-${index}`);
    let hideQuery = { _id: this.allInfluencers[index]._id, userId: this.user._id };
    
    if (itemToRemove) {
      // Apply animation class
      itemToRemove.classList.add("poof-effect");
      
      // Remove element after animation completes
      setTimeout(() => {
        this.allInfluencers.splice(index, 1); // Remove item from array
        this.FindInfluencersService.hideInfluencer(hideQuery).subscribe((response: any) => {
          this.isLoading = false;
        });
      }, 500); // Match animation duration
    } 
  }

  dropdownSelected(menu: string, item: any) {
    let sortItem = _.clone(item);
    //document.getElementById(menu)!.innerHTML = sortItem.length > 12 ? sortItem.slice(0, 12) + '...' : sortItem;

    switch(menu) {
      case 'dropdownMenuLink':
        this.platformDropdownSelected = item;
        this.query.platform = item;
        break;
      case 'dropdownMenuLink1':
        this.followersDropdownSelected = item;
        this.query.followers = item;
        break;
      case 'dropdownMenuLink2':
        this.categoryDropdownSelected = item;
        this.query.category = item;
        break;
      default:
        break;
    }
  }

  fetchAllInfluencers(reset: boolean = false) {
    this.isLoading = true;
    if(reset) {
      this.query.page = 1;
      this.allInfluencers = [];
    }
    this.cleanupQueryData();
    this.FindInfluencersService.fetchAllInfluencers(this.query).subscribe((response: any) => {
      if(response.data?.length) {
        setTimeout(() => {
          this.allInfluencers = _.concat(this.allInfluencers, response.data);
          this.query.page++;
          this.isLoading = false;
          this.hasMoreData = true;
        }, 250);
      } else {
        this.isLoading = false;
        this.hasMoreData = false;
      }
    });
  }

  cleanupQueryData() {
    if(this.query.category === 'Dating') this.query.category = 'Dating Coach';
    if(this.query.category === 'Fitness') this.query.category = 'Fitness Coach';
    if(this.query.category === 'Sales') this.query.category = 'Sales Coach';
    if(this.query.category === 'Real Estate') this.query.category = 'Real Estate Coach';
    if(this.query.category === 'H & W') this.query.category = 'Health & Wellness Coach';

    if(this.query.followers === 'Nano') this.query.followers = '1,000 - 9,999';
    if(this.query.followers === 'Micro') this.query.followers = '10,000 - 99,999';
    if(this.query.followers === 'Macro') this.query.followers = '100,000 - 999,999';
  }

  copyEmail(email: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        console.log('Email copied to clipboard:', email);
        // Optionally show a toast or snack bar here
        // this.toastService.success('Email copied!');
      }).catch(err => {
        console.error('Failed to copy email:', err);
        // Optionally show an error toast
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Email copied to clipboard (fallback):', email);
        // this.toastService.success('Email copied!');
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textarea);
    }
  }

  onSubmit() {
    this.fetchAllInfluencers(true);
  }

  onClearFilters() {
    //this.query.platform = '';
    this.query.followers = '';
    this.query.category = '';
    //this.platformDropdownSelected = 'Platform';
    this.followersDropdownSelected  = 'Followers';
    this.categoryDropdownSelected = 'Category';
  }
  
  openMoreFiltersModal() {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '30vw';
    config.maxWidth = '30vw';
    config.minHeight = '36vh';
    config.maxHeight = '36vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(AllFiltersComponent, config);
    self.dialogRef.componentInstance.filter1 = this.query.excludesInfluencersInLists;
    self.dialogRef.componentInstance.filter2 = this.query.excludeHiddenInfluencers;
    self.dialogRef.componentInstance.data = [];
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          if(!result[0].checked) this.query.excludesInfluencersInLists = false;
          if(!result[1].checked) this.query.excludeHiddenInfluencers = false;
        }
      });
  }

  downloadRecords() {
    let excelForm: any = [];
    this.allInfluencers.forEach(influencer => {
      const form = {
        name: influencer.name,
        category: influencer.category,
        platform: influencer.platform,
        followers: influencer.followers,
        engagement: influencer.engagement,
        location: influencer.location,
      };
      excelForm.push(form);
    });

    let headers = this.csvColumns;
    /*
    new Angular5Csv(excelForm, 'Influencers', {
      showLabels: true,
      headers,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.'
    });
    */
  }

  /*
  openSendEmailModal(influencer: any) {
    const config = new MatDialogConfig();

    config.autoFocus = false;
    config.disableClose = false;
    config.viewContainerRef = this._viewContainerRef;
    config.hasBackdrop = true;
    config.minWidth = '58vw';
    config.maxWidth = '58vw';
    config.minHeight = '82vh';
    config.maxHeight = '82vh';
    config.panelClass = 'custom-dialog-container';
    self.dialogRef = this._dialog.open(SendEmailComponent, config);
    self.dialogRef.componentInstance.influencer = influencer;
    self.dialogRef
      .afterClosed()
      .subscribe((result: any) => {
        self.dialogRef = null;
        if (result) {
          
        }
      });
  }
      */
}
