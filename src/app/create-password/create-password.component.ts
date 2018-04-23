import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { EmailValidator } from '../emailValidator/email.validator';
import { NativeService } from '../http-services/native.services';
import { Response } from '@angular/http/src/static_response';

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

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {
  alreadyAUser: boolean = false;
  notAUser: boolean = true;

  createPasswordForm: FormGroup;
  user;
  res;
  errorMessage;
  
  constructor(private fb: FormBuilder, private httpService: NativeService,
              private router: Router      
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('linkedInUser'));

      this.httpService.checkUserStatus({emailAddress: this.user.emailAddress})
          .subscribe(
            result => { this.res = result;
                  if (this.res === "User already registered"){
                    console.log("yeah user present");
                    this.alreadyAUser = true;
                    localStorage.removeItem('linkedInUser');
                    localStorage.removeItem('currentUser');
                  }
                  else{
                    this.notAUser = false;
                  }
                },
            error => {this.errorMessage = <any>error;
              if(this.errorMessage){
                          //this.toastr.error(this.errorMessage.message);
                          console.log("error in checking user status ", this.errorMessage);
                        }
                      }
          );
    
        
    this.createPasswordForm = this.fb.group({
      'emailAddress': [this.user.emailAddress, [Validators.required, EmailValidator.email()]],
      passwords : this.fb.group({
        'password' : ['', [Validators.required, Validators.minLength(8)]],
        'confirmPassword' : ['', [Validators.required, Validators.minLength(8)] ]
      }, {validator: passMatcher})
    })
  }
  
  updatePassword(){
    this.httpService.signup(this.user)
    .subscribe(
      result => { this.res = result;
            // login successful
            console.log("after successful signup " + this.user.firstName);
            this.insertingPassword();
            if(this.user.role === "admin"){
              //this.router.navigate(['/adminDashboard']);
              //this.toastr.success("Welcome " + this.userName);
            }
            else if(this.user.role === "staffMember"){
              //this.router.navigate(['/staffDashboard']);
              //this.toastr.success("Welcome " + this.userName);
          }
    },
      error => {this.errorMessage = <any>error;
                  if(this.errorMessage){
                    //this.toastr.error(this.errorMessage.message);
                    console.log("error in sign up ", this.errorMessage);
                  }
                }
    );
  }

  insertingPassword(){

    if(this.createPasswordForm.dirty &&  this.createPasswordForm.valid){
      let user = Object.assign({}, this.createPasswordForm.value)
      user.password = user.passwords.password;
      delete user.passwords;
      console.log("just updated password "+JSON.stringify(user));
      this.httpService.createPassword(user)
      .subscribe(
        result =>{ 
          this.createPasswordForm.reset();
          alert(result +". Please logout and Login again!");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("linkedInUser");
          this.router.navigate(['/home']);
          // localStorage.removeItem('currentUser');
          // this.toastr.success(this.resultG);  
      },
      error => {
          alert(error);
          // this.toastr.error(this.errorMessage);
        }
      );
    }
}
                    
  revertToHome(){
    localStorage.removeItem('linkedInUser');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);            
  }

}
