import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, UrlSegment } from '@angular/router';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    user:any;
    role:any;
    location:any;

    constructor(private router: Router) {
     }
 
    canActivate() {
         this.user = localStorage.getItem('currentUser');
         this.user = JSON.parse(this.user);
        //  if(this.user === null)
        //     this.role = null;
        // else
        //     this.role = this.user.role;
         
        if (this.user != null && this.user.token) {
            // logged in so return true
            return true;
        }
        else if(this.user === null) {
            this.router.navigate(['/home']);
            window.alert("Please login first.")
            return false;
        }
        
            // this.router.navigate(['/404']);
            // return false;
        
        }
}