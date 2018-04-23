import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css']
})
export class LibraryListComponent implements OnInit, AfterViewInit {

  section: string;
  libType: string;
  dataObject:{section:string, libType:string} = {section:"", libType: ""};

  constructor(private route: ActivatedRoute) {
    
    this.route.paramMap.subscribe(
      params => {
        this.section = params.get('section');
        this.libType = params.get('type');
        if(this.libType === "myLibrary")
          this.dataObject.libType = this.libType.replace("my","My ");
        else if(this.libType === "publicLibrary")
          this.dataObject.libType = this.libType.replace("public","Public ");
        this.dataObject.section = this.section;
        console.log("dataObject: ", JSON.stringify(this.dataObject));
        // console.log("type: ", this.libType);
      }
    );
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
  }

}
