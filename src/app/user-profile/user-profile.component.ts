import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userId: string;
  user = {
    firstName: "Rajesh", 
    lastName: "Kumar", 
    email: "rajesh@gmail.com", 
    headline: "CTO at QuickServe", 
    pictureUrl: "", 
    achievements: "",
    age: 22,
    country: "India",
    degree: "BTech",
    emailAddress: "rajesh@gmail.com",
    experience: "",
    hobbies: "Photograpgy",
    industry: "Technology",
    password: "qwerty99",
    profileUrl: ""	
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.userId = this.route.snapshot.paramMap.get('id');

  }

}
