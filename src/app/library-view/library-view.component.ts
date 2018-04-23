import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrls: ['./library-view.component.css']
})
export class LibraryViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  libraryList(type, section){
    let url = "/userDashboard/library/" + type + "/" + section;
    this.router.navigate([url]);
  }

}
