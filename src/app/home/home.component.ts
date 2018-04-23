import { Router } from '@angular/router';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NativeService } from '../http-services/native.services';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../emailValidator/email.validator';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private httpService: NativeService, private fb: FormBuilder,
              private router: Router
  ) { }

  ngOnInit() {

    if(localStorage.getItem('currentUser') != null){
      this.router.navigate(['/userDashboard']);
    }

  }

}
