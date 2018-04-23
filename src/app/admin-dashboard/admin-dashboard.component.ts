import { ToastrService } from './../http-services/toastr.service';
import { loginForm } from './../data-model/data-model';
import { NativeService } from './../http-services/native.services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  addCategoryForm: FormGroup;
  @ViewChild('sidebar') sidebar: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('profilePicHolder') profilePicHolder: ElementRef;

  addCio: boolean = true;
  searchShow: boolean = false;
  addCompany: boolean = false;
  addCategory: boolean = false;
  loading: boolean;
  addCioForm: FormGroup;
  // searchCategory = ['name', 'email', 'country'];
  searchCategory = [];
  addCompanyForm: FormGroup;
  errorMessage: any;
  showResult: boolean;
  user;
  searchResult: any;
  searchForm: FormGroup;
  file;

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router, private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.user = localStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);

    this.addCioForm = this.fb.group({
      'firstName': [''],
      'lastName': [''],
      'emailAddress': [''],
      'headline': [''],
      'pictureUrl': [''],
      'publicProfileUrl': [''],
      'password': [''],
      'age': [''],
      'country': [''],
      'industry': [''],
      'experience': [''],
      'degree': [''],
      'achievements': [''],
      'hobbies': [''],
    });

    this.searchForm = this.fb.group({
      'searchBy': ['', [Validators.required]],
      'searchValue': ['', [Validators.required]]
    });

    this.addCategoryForm = this.fb.group({
      'newCategoryValue': ['', [Validators.required]]
    });

    this.addCompanyForm = this.fb.group({
      'profilePic': [''],
      'companyName': ['', Validators.required],
      'companyDescription': ['', Validators.required]
    })

  }

  deleteUser(userEmail) {
    let cio = {};
    cio["email"] = userEmail;
    this.httpService.deleteCio(cio)
      .subscribe(
        result => {
          this.toastr.success(""+result);
        },
        error => {
          this.toastr.error("something went wrong, Try Again.");
        }
      );
  }

  addNewCio() {
    this.loading = true;
    let newCio = Object.assign({}, this.addCioForm.value)
    console.log(newCio);
    this.httpService.addNewCio(newCio)
      .subscribe(
        result => {
          this.loading = false;
          this.addCioForm.reset();
          alert(result);
        },
        error => {
          this.loading = false;
          alert("something went wrong, Try Again.");
        }
      );
  }

  addNewCategory(){
    this.loading = true;
    let newCat = Object.assign({}, this.addCategoryForm.value)
    console.log(newCat);
    this.httpService.addCategory(newCat)
      .subscribe(
        result => {
          this.loading = false;
          this.addCategoryForm.reset();
          alert(result);
        },
        error => {
          this.loading = false;
          alert("something went wrong, Try Again.");
        }
      );
  }

  search() {
    if (this.searchForm.dirty && this.searchForm.valid) {
      let searchQ = Object.assign({}, this.searchForm.value)
      this.httpService.searchByCategory(searchQ) // method called need to be changed later
        .subscribe(
          result => {
            this.searchResult = result;
            // this.searchForm.reset();
            if (this.searchResult) {
              // further action or navigation to be added here
              this.showResult = true;
            }
          },
          error => {
            this.errorMessage = <any>error;
            if (this.errorMessage) {
              console.log(this.errorMessage);
            }
          }
        );
    }
  }

  getCategories() {
    this.httpService.getSearchOptions()
      .subscribe(
        (result) => {
          console.log("search categories we recieved ", result);
          this.searchCategory = result;
        },
        (error) => {
          console.log("error occured in fetching search category", error);
        }
      )
  }

  onFileChange(event) {
    let profilePicHolder = this.profilePicHolder.nativeElement;
    if (typeof (FileReader) != "undefined") {
      if (profilePicHolder.childNodes[0]) {
        profilePicHolder.removeChild(profilePicHolder.childNodes[0]);
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        let image = document.createElement('img');
        // image.classList.add('profilePicBox');
        image.style.width = "200px";
        image.style.height = "200px";
        image.style.border = "3px solid black";
        image.style.borderRadius = "3%";
        image.style.boxShadow = "2px 2px 2px 1px slategrey";
        image.setAttribute('src', e.target['result']);
        profilePicHolder.appendChild(image);
      }
      // profilePicHolder.style.display = "block";
    } else {
      console.log("Your browser does not support FileReader.");
    }
    reader.readAsDataURL(event.target.files[0]);
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      //this.addCompanyForm.get('profilePic').setValue(file);
    }
  }

  prepareSave(): any {
    let input: FormData = new FormData();
    input.append('profilePic', this.fileInput.nativeElement.files[0]);
    input.append('companyName', this.addCompanyForm.get('companyName').value);
    input.append('companyDescription', this.addCompanyForm.get('companyDescription').value);
    // console.log("after  appending ",input.get('profilePic'));
    // console.log("after  appending ",input.get('companyName'));
    // console.log("after  appending ",input.get('companyDescription'));
    return input;
  }

  clearFile() {
    let profilePicHolder = this.profilePicHolder.nativeElement;
    this.addCompanyForm.get('profilePic').setValue(null);
    if (profilePicHolder.childNodes[0]) {
      profilePicHolder.removeChild(profilePicHolder.childNodes[0]);
    }
    this.fileInput.nativeElement.value = '';
  }

  createCompany() {
    const companyDetail = this.prepareSave();
    this.loading = true;
    this.httpService.addNewCompany(companyDetail)
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

  changeToAddCategory() {
    this.addCategory = true;
    this.addCio = false;
    this.searchShow = false;
    this.addCompany = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }

  changeToAddCio() {
    this.addCio = true;
    this.addCategory = false;
    this.searchShow = false;
    this.addCompany = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }

  changeToCompany() {
    this.addCompany = true;
    this.addCategory = false;
    this.addCio = false;
    this.searchShow = false;
    this.sidebar.nativeElement.classList.remove('showSidebar');
  }

  changeToSearch() {
    this.addCompany = false;
    this.addCategory = false;
    this.addCio = false;
    this.searchShow = true;
    this.sidebar.nativeElement.classList.remove('showSidebar');
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

}
