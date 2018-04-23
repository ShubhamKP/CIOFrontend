import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { NativeService } from './../http-services/native.services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../http-services/toastr.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  friendRequests: any[];
  blogForm: FormGroup;

  @ViewChild('sidebar') sidebar: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('imageFileInput') imageFileInput: ElementRef;
  @ViewChild('follow') followBtn: ElementRef;
  @ViewChild('addFriend') addFriendBtn: ElementRef;
  @ViewChild('userInfo') userInfo: ElementRef;
  @ViewChild('postInput') postInput: ElementRef;

  searchForm: FormGroup;
  updateMeForm: FormGroup;
  newCategoryForm: FormGroup;
  postForm: FormGroup;
  // searchCategory = ['name', 'email', 'country'];
  searchCategory = [];
  user;
  searchResult;
  errorMessage: any;
  showResult: boolean;
  loading: boolean;
  home: boolean = true;
  post: boolean = false;
  blog: boolean = false;
  update: boolean = false;

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router, private toast: ToastrService
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);
    console.log("from homepage: ", this.user);

    this.searchForm = this.fb.group({
      'searchBy': ['', [Validators.required]],
      'searchValue': ['', [Validators.required]]
    });

    this.updateMeForm = this.fb.group({
      'firstName': [''],
      'lastName': [''],
      'emailAddress': [''],
      'headline': [''],
      'profilePicture': [''],
      'profileUrl': [''],
      'age': [''],
      'country': [''],
      'industry': [''],
      'experience': [''],
      'degree': [''],
      'achievements': [''],
      'hobbies': [''],
    })

    this.newCategoryForm = this.fb.group({
      'newCategoryValue': ['', Validators.required]
    });

    this.postForm = this.fb.group({
      'text': ['', Validators.required]
      // 'imageSelect': ['']
    });
    this.blogForm = this.fb.group({
      'text': ['', Validators.required]
      // 'imageSelect': ['']
    });

    this.getCategories();
    this.getFriendReq();

    this.populateUpdateMeForm();
  }

  getCategories() {
    this.httpService.getSearchOptions()
      .subscribe(
        (result) => {
          console.log("search actegories we recieved ", result);
          this.searchCategory = result;
        },
        (error) => {
          console.log("error occured in fetching search category", error);
        }
      )
  }

  getFriendReq() {
    this.httpService.getAllFriendReq()
      .subscribe(
        (result) => {
          console.log("friend requests we recieved ", result);
          this.friendRequests = result;
        },
        (error) => {
          console.log("error occured in fetching friend requests", error);
        }
      )
  }

  acceptRequest(reqFrom) {
    let acceptCio = {};
    acceptCio["name"] = reqFrom.name;
    acceptCio["id"] = reqFrom.id;

    this.httpService.acceptTheReq(acceptCio)
      .subscribe(
        (result) => {
          this.toast.success(""+result)
        },
        (error) => {
          this.toast.error("error occured in accepting friend requests", error);
        }
      )

  }

  search() {
    console.log("search in");
    this.router.navigate(['userDashboard/searchResult'],
      {
        queryParams:
          {
            criteria: this.searchForm.get('searchBy').value,
            query: this.searchForm.get('searchValue').value
          }
      });

    this.searchForm.reset();

  }

  addNewCategory() {
    if (this.newCategoryForm.dirty && this.newCategoryForm.valid) {
      let newCategory = Object.assign({}, this.newCategoryForm.value);
      this.httpService.addCategory(newCategory)
        .subscribe(
          (result) => {
            alert(result);
            this.newCategoryForm.reset();
            this.getCategories();
          },
          (error) => {
            console.log("error occured in adding new category", error);
          }
        );
    }
  }

  populateUpdateMeForm() {
    this.updateMeForm.patchValue({
      'firstName': this.user.firstName,
      'lastName': this.user.lastName,
      'emailAddress': this.user.emailAddress,
      'headline': this.user.headline,
      'profileUrl': this.user.publicProfileUrl,
      'age': this.user.age,
      'country': this.user.country,
      'industry': this.user.industry,
      'experience': this.user.experience,
      'degree': this.user.degree,
      'achievements': this.user.achievements,
      'hobbies': this.user.hobbies,
    })
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.updateMeForm.get('profilePicture').setValue(file);
    }
  }

  onImageSelect(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.postForm.get('imageSelect').setValue(file);
    }
  }

  prepareSave(forBlock): any {
    let input;
    if (forBlock === "proUpdate") {
      input = new FormData();
      input.append('firstName', this.updateMeForm.get('firstName').value);
      input.append('lastName', this.updateMeForm.get('lastName').value);
      input.append('emailAddress', this.updateMeForm.get('emailAddress').value);
      input.append('headline', this.updateMeForm.get('headline').value);
      input.append('profilePicture', this.updateMeForm.get('profilePicture').value);
      input.append('profileUrl', this.updateMeForm.get('profileUrl').value);
    } else if (forBlock === "post") {
      input = new FormData();
      input.append('text', this.postForm.get('text').value);
      input.append('imageSelect', this.postForm.get('imageSelect').value);
    }
    return input;
  }

  addNewPost() {
    // const postDetail = this.prepareSave("post");
    this.loading = true;
    this.httpService.addPost(this.postForm.value)
      .subscribe(
        (result) => {
          this.loading = false;
          alert(result);
          this.postForm.reset();
        },
        (error) => {
          console.log("error occured in adding new post", error);
        }
      );
  }

  addNewBlog() {
    // const postDetail = this.prepareSave("post");
    this.loading = true;
    this.httpService.addBlog(this.blogForm.value)
      .subscribe(
        (result) => {
          this.loading = false;
          alert(result);
          this.blogForm.reset();
        },
        (error) => {
          console.log("error occured in adding new post", error);
        }
      );
  }

  clearFile() {
    this.updateMeForm.get('profilePicture').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.postForm.get('imageSelect').setValue(null);
    this.imageFileInput.nativeElement.value = '';
  }

  updateProfile() {
    const updateMe = this.prepareSave("proUpdate");
    this.loading = true;
    this.httpService.updateProfile(updateMe)
      .subscribe(
        result => {
          this.loading = false;
          alert(result);
        },
        error => {
          alert("something went wrong, Try Again.");
        }
      );
  }

  logout() {
    this.httpService.logout();
    this.router.navigate(['/home']);
  }

  toggleSidebar(event) {
    if (event.target.id === "menuBtn" || event.target.classList.contains("fa-bars")) {
      if (this.sidebar.nativeElement.classList.contains('showSidebar')) {
        this.sidebar.nativeElement.classList.remove('showSidebar');
      } else {
        this.sidebar.nativeElement.classList.add('showSidebar');
      }
    }
  }

  postFocused(event) {
    this.userInfo.nativeElement.style.display = "block";
  }

  postUnfocused() {
    let val = this.postInput.nativeElement.value;
    if (val === "" || val == null) {
      this.userInfo.nativeElement.style.display = "none";
    }
  }

  editProfile() {
    this.home = false;
    this.blog = false;
    this.post = false;
    this.update = true;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }
  changeToHome() {
    this.home = true;
    this.blog = false;
    this.post = false;
    this.update = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }
  changeToPost() {
    this.home = false;
    this.blog = false;
    this.post = true;
    this.update = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }
  changeToBlog() {
    this.home = false;
    this.blog = true;
    this.post = false;
    this.update = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }

}
