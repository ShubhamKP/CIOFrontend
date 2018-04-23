import { Component,ViewContainerRef  } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  userPresent:boolean;

  constructor(private router: Router, public toastr: ToastsManager, 
              vRef: ViewContainerRef){

        this.toastr.setRootViewContainerRef(vRef);
  }

  onViewChange(){
    if(localStorage.getItem('currentUser') === null)
        this.router.navigate(['/home']);
      // else  
        // this.router.navigate(['/userDashboard']);
  }


}
