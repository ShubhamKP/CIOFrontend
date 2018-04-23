import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { NativeService } from '../http-services/native.services';
import { EmailValidator } from '../emailValidator/email.validator';

function passMatcher(c: AbstractControl) {
  let newPass = c.get('password');
  let confirmPass = c.get('confirmPassword');
  if (newPass.pristine || confirmPass.pristine) {
    return null;
  }
  if (newPass.value === confirmPass.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  forgotForm: FormGroup;
  resultG: any;
  errorMessage: any;

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router
  ) { }

  ngOnInit() {

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, EmailValidator.email()]],
      passwords: this.fb.group({
        'password': ['', [Validators.required, Validators.minLength(8)]],
        'confirmPassword': ['', [Validators.required, Validators.minLength(8)]]
      }, { validator: passMatcher })
    });

  }

  send() {
    if (this.forgotForm.dirty && this.forgotForm.valid) {
      let user = Object.assign({}, this.forgotForm.value);
      user.password = user.passwords.password;
      delete user.passwords;
      console.log("just signed up " + JSON.stringify(user));
      this.httpService.forgotPass(user)
        .subscribe(
          result => {
          this.resultG = result;
            this.forgotForm.reset();
            alert(this.resultG);
            // this.toastr.success(this.resultG);  
            this.router.navigate(['/home']);
          },
          error => {
          this.errorMessage = <any>error;
            if (this.errorMessage) {
              alert(this.errorMessage);
              // this.toastr.error(this.errorMessage);
            }
          }
        );
    }
  }

}
