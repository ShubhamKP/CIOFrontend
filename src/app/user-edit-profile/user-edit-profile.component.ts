import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NativeService } from '../http-services/native.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.css']
})
export class UserEditProfileComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  searchQ: { 'searchBy': string, 'searchValue': string } = { 'searchBy': '', 'searchValue': '' };
  updateMeForm: FormGroup;
  user;
  searchResult;
  errorMessage: any;
  loading: boolean = false;
  filesToUpload;

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router) {


  }

  ngOnInit() {

    this.user = localStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);
    this.searchQ.searchBy = "email";
    this.searchQ.searchValue = this.user.email;
    console.log("fetching full user data ", this.searchQ);
    this.search();

    this.updateMeForm = this.fb.group({
      'firstName': [''],
      'lastName': [''],
      'email': [''],
      'headline': [''],
      'pictureUrl': [''],
      'profileUrl': [''],
      'age': [''],
      'country': [''],
      'industry': [''],
      'experience': [''],
      'degree': [''],
      'achievements': [''],
      'hobbies': [''],
    });

    
  }
  
  search() {
    this.httpService.searchByCategory(this.searchQ) // method called need to be changed later
    .subscribe(
      result => {
        this.searchResult = result;
        console.log("searchresult ", this.searchResult);
        this.populateUpdateMeForm();
        },
        error => {
          this.errorMessage = <any>error;
          if (this.errorMessage) {
            console.log(this.errorMessage);
          }
        }
      );
  }

  populateUpdateMeForm() {
    this.updateMeForm.patchValue({
      'firstName': this.searchResult.firstName,
      'lastName': this.searchResult.lastName,
      'email': this.searchResult.email,
      'headline': this.searchResult.headline,
      'profileUrl': this.searchResult.profileUrl,
      'age': this.searchResult.age,
      'country': this.searchResult.country,
      'industry': this.searchResult.industry,
      'experience': this.searchResult.experience,
      'degree': this.searchResult.degree,
      'achievements': this.searchResult.achievements,
      'hobbies': this.searchResult.hobbies,
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      // this.updateMeForm.get('profilePicture').setValue(file);
      this.filesToUpload = file;
    }
  }

  prepareSave(): any {
    let input;
    input = new FormData();
    input.append('firstName', this.updateMeForm.get('firstName').value);
    input.append('lastName', this.updateMeForm.get('lastName').value);
    input.append('email', this.updateMeForm.get('email').value);
    input.append('headline', this.updateMeForm.get('headline').value);
    console.log(this.filesToUpload);
    console.log(this.updateMeForm.get('profilePicture').value);
    input.append('profilePicture', this.filesToUpload, this.filesToUpload.name);
    input.append('profileUrl', this.updateMeForm.get('profileUrl').value);

    console.log("profilePic " + input.get('profilePicture') + "/n firstName " + input.get('firstName'))
    // console.log("k")

    // for (var value of input.values()) {
    //     console.log("h")
    //     console.log(value); 
    // }

    return input;
  }

  clearFile() {
    this.updateMeForm.get('profilePicture').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  updateProfile() {
    const updateMe = this.prepareSave();
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

}
