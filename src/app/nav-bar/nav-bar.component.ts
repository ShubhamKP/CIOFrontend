import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { EmailValidator } from '../emailValidator/email.validator';
import { NativeService } from '../http-services/native.services';
import { LinkedInService } from 'angular-linkedin-sdk';

function passMatcher(c:AbstractControl) {
  let newPass = c.get('password');
  let confirmPass = c.get('confirmPassword');
  if(newPass.pristine || confirmPass.pristine){
    return null;
  }
  if(newPass.value === confirmPass.value){
    return null;
  }
  return {'match': true};
}

interface linkedInData{
  id: string,
  headline: string,
  emailAddress: string,
  firstName: string,
  lastName: string,
  pictureUrl: string,
  publicProfileUrl: string
}

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  linkedInUserData: linkedInData;
  
  @ViewChild('loginModal') loginModal: ElementRef;
  @ViewChild('signUpModal') signUpModal: ElementRef;
  @Output('changeView') changeView = new EventEmitter;
  
  signupForm: FormGroup;
  loginForm: FormGroup;
  res: any;
  user: any;
  userName: string;
  resultG:any;
  errorMessage:any;
  loggedin: boolean = false;
  shoow: boolean = true;
  showNavBar: boolean = false;
  private url = '/people/~:(id,first-name,last-name,email-address,headline,picture-url,public-profile-url)?format=json';
  public isUserAuthenticated;

  constructor(
    private fb: FormBuilder,public nativeHttp: NativeService, 
    private router: Router,private route: ActivatedRoute,
    private _linkedInService: LinkedInService
  ) { 
    
  }

  public subscribeToisInitialized(){
    this._linkedInService.isInitialized$.subscribe({
    next: (state) => {
      // state will always return true when API finishes loading
      console.log("Linkedin API finishes loading");
    },
    complete: () => {
      // Completed
      this._linkedInService.isUserAuthenticated$.subscribe({
        next: (state) => {
          this.isUserAuthenticated = state;
          console.log("if user authenticated: ", this.isUserAuthenticated);
          if (this.isUserAuthenticated){
          this._linkedInService.raw(this.url)
            .asObservable()
              .subscribe({
                next: (data) => {
                  this.shoow = false;
                  this.loggedin = true;
                  console.log(data);
                  // localStorage.setItem('currentUser',JSON.stringify(data));
                },
                error: (err) => {
                  console.log(err);
                },
                complete: () => {
                  this.user = localStorage.getItem('currentUser');
                  this.user = JSON.parse(this.user);
                  this.userName = this.user.firstName + " " + this.user.lastName ;
                  console.log('RAW API call completed');
                  this.router.navigate(['/userDashboard']);
                }
              });
            }
            else{
              localStorage.removeItem('currentUser');
            }
        }
      });
      console.log("linkedin API loaded completely");
    }
  });
}

  ngOnInit() {
    // this._linkedInService.isUserAuthenticated$.subscribe({
    //   next: (state) => {
    //     this.isUserAuthenticated = state;
    //     console.log("if user authenticated: ", this.isUserAuthenticated);
    //     if (this.isUserAuthenticated){
    //     this._linkedInService.raw(this.url)
    //       .asObservable()
    //         .subscribe({
    //           next: (data) => {
    //             this.shoow = false;
    //             this.loggedin = true;
    //             this.changeView.emit();
    //             console.log(data);
    //             localStorage.setItem('currentUser',JSON.stringify(data));
    //           },
    //           error: (err) => {
    //             console.log(err);
    //           },
    //           complete: () => {
    //             this.user = localStorage.getItem('currentUser');
    //             this.user = JSON.parse(this.user);
    //             this.userName = this.user.firstName + " " + this.user.lastName ;
    //             console.log('RAW API call completed');
    //           }
    //         });
    //       }
    //       else{
    //         localStorage.removeItem('currentUser');
    //       }
    //   }
    // });

    this.createForm();
    // this.subscribeToisInitialized();
       
    if(localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).token){
      this.user = localStorage.getItem('currentUser');
      this.user = JSON.parse(this.user);
      this.userName = this.user.firstName + " " + this.user.lastName ;
      this.shoow = false;
      this.loggedin = true;
      // this.router.navigate(['/userDashboard']);
    }

  }

  // ngDoCheck(){
  //   let url = this.router.url;
  //   if(url === "/home"){
  //     this.loggedin = false;
  //     this.shoow = true;
  //     this.showNavBar = true;
  //   }else if(url != "/home" && url != "/createPassword" && url != "/forgotPassword"){
  //     this.showNavBar = false;
  //   }
  // }

  createForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, EmailValidator.email()]],
      passwords : this.fb.group({
                      'password' : ['', [Validators.required, Validators.minLength(8)]],
                      'confirmPassword' : ['', [Validators.required, Validators.minLength(8)] ]
      }, {validator: passMatcher})
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, EmailValidator.email()]],
      password: ['', [Validators.required]]
    });
  }

  public subscribeToLogin(){
    this._linkedInService.login().subscribe({
      next: (state) => {
        // state will always return true when login completed 
        console.log('login state: ', state);
      },
      complete: () => {
        // Completed
        // const url = '/people/~:(id,first-name,last-name,email-address,headline,picture-url,public-profile-url)?format=json';
        localStorage.removeItem('currentUser');
        this._linkedInService.raw(this.url)
          .asObservable()
            .subscribe({
              next: (data:linkedInData) => {
                this.shoow = false;
                console.log(data);
                // this.loggedin = true;
                // let loggedUser = {};
                // loggedUser['firstName'] = data.firstName;
                // loggedUser['lastName'] = data.lastName;
                // loggedUser['emailAddress'] = data.emailAddress; 
                localStorage.setItem('linkedInUser',JSON.stringify(data));
                this.userName = data.firstName + " " + data.lastName ;
                // this.changeView.emit();
                this.hideModal();
                this.router.navigate(["/createPassword"]);
              },
              error: (err) => {
                console.log(err);
              },
              complete: () => {
                console.log('RAW API call completed');
              }
            });
      }
    });
  }

  public subscribeToLogout(){
    if(localStorage.removeItem('linkedInUser') != null){
      this._linkedInService.logout().subscribe({
        next: () => {
          // does not emit a value 
        },
        complete: () => {
          // Completed
          // this.router.navigate(['/home']);
        }
      });
    }
    localStorage.removeItem('linkedInUser');
    this.nativeHttp.logout();
    this.shoow = true;
    this.loggedin = false;
    this.router.navigate(['/home']);
  }

  login(){
    this.nativeHttp.login(this.loginForm.controls['email'].value,this.loginForm.controls['password'].value)
          .subscribe(result => { this.res = result;
                if (this.res.code === 200  ) {
                    // login successful
                    this.user = localStorage.getItem('currentUser');
                    this.user = JSON.parse(this.user);
                    this.userName = this.user.firstName + " " + this.user.lastName ;
                    console.log(this.user.role);
                    this.loggedin = true;
                    this.shoow = false;
                    this.hideModal();
                    // this.changeView.emit();
                    console.log("user logged in");
                    this.router.navigate(['/userDashboard']);
                    if(this.user.role === "admin"){
                      //this.router.navigate(['/adminDashboard']);
                      //this.toastr.success("Welcome " + this.userName);
                    }
                    else if(this.user.role === "staffMember"){
                      //this.router.navigate(['/staffDashboard']);
                      //this.toastr.success("Welcome " + this.userName);
                  }
                } 
                else{
                     //this.toastr.error(this.resp.message);
                     alert(this.res.message);
                }
            },
              error => {this.errorMessage = <any>error;
                          if(this.errorMessage){
                            //this.toastr.error(this.errorMessage.message);
                            console.log(this.errorMessage);
                          }
                        }
            );
    }

    signup(){
      if(this.signupForm.dirty &&  this.signupForm.valid){
      let user = Object.assign({}, this.signupForm.value);
      user.password = user.passwords.password;
      delete user.passwords;
      console.log("just signed up "+JSON.stringify(user));
      this.nativeHttp.signup(user)
            .subscribe(
              result =>{ this.resultG = result;
                          this.signupForm.reset();
                          this.hideModal();
                          if(this.resultG){
                            alert(this.resultG);
                            // this.toastr.success(this.resultG);
                          }  
                          this.router.navigate(['/home']);
                        },
                error => {this.errorMessage = <any>error;
                            if(this.errorMessage){
                              alert(this.errorMessage);
                              // this.toastr.error(this.errorMessage);
                            }
                          }
            );
      }
      else if (!this.signupForm.dirty)
      {
        this.userAdded();
      }
  }
  
  userAdded():void{
    this.signupForm.reset();
  }

  hideModal(){
    this.shoow = false;
    let body = document.getElementsByTagName('body');
    body[0].classList.remove('modal-open');
    let loginModal:Element = document.getElementsByClassName('loginModal')[0];
    let signUpModal:Element = document.getElementsByClassName('signUpModal')[0];
    loginModal.setAttribute('style','display: none !important');
    signUpModal.setAttribute('style','display: none !important');
    let modalBack:HTMLCollectionOf<Element> = document.getElementsByClassName('modal-backdrop');
    console.log("modal Backs ", modalBack);
    for(let i=0; i<modalBack.length; i++){
      modalBack[i].setAttribute('style','display: none !important');
    }
  }

}
