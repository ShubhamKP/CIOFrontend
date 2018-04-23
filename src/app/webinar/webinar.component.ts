import { Component, OnInit } from '@angular/core';
import { NativeService } from './../http-services/native.services';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.component.html',
  styleUrls: ['./webinar.component.css']
})
export class WebinarComponent implements OnInit {
  successMsg:boolean;
  session:object;
  joinSessionForm:FormGroup;
  constructor(private httpService: NativeService,private fb: FormBuilder,private router: Router) { }

  ngOnInit() {
    this.joinSessionForm = this.fb.group({
      "joinSessionId":['',[Validators.required]]
    })
  }

  createWebinar(){
    console.log("works");
    this.httpService.createWebinarReq().subscribe((result)=>{
      console.log(result);
      this.successMsg=true;
       this.session =result;
       
    },
  (error)=>{
    console.log(error);
  })
  }
  joinSession(sessionId){
    console.log(sessionId);
    this.httpService.joinWebinar({sessionId}).subscribe((result)=>{
      console.log(result);
      this.successMsg=true;
     
       sessionStorage.setItem('session',JSON.stringify(result)) 
       this.router.navigate(['/userDashboard/webinarmain']);  
    },
  (error)=>{
    console.log(error);
  })
  }
  joinExistingSession(){
    let joinSessionId= this.joinSessionForm.get('joinSessionId').value;
    this.httpService.joinWebinar({joinSessionId}).subscribe((result)=>{
      console.log(result);
      this.successMsg=true;
      
       sessionStorage.setItem('session',JSON.stringify(result))
       this.router.navigate(['/userDashboard/webinarmain']);  
    },
  (error)=>{
    console.log(error);
  })
  }
}
