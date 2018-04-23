import { Component, OnInit } from '@angular/core';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NativeService } from '../http-services/native.services';

@Component({
  selector: 'app-user-search-result',
  templateUrl: './user-search-result.component.html',
  styleUrls: ['./user-search-result.component.css']
})
export class UserSearchResultComponent implements OnInit {
  
  searchQ: {'searchBy': string, 'searchValue': string} = {'searchBy':'','searchValue':''};
  searchResult;
  errorMessage: any;

  constructor(private fbd: FormBuilder, private httpService: NativeService,
    private router: Router, private route: ActivatedRoute) { 

  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      let searchBy = params.get('criteria');
      console.log("by",searchBy);
      let searchValue = params.get('query');
      console.log("by",searchValue);
      
      this.searchQ.searchBy = searchBy;
      this.searchQ.searchValue = searchValue;
      
      console.log("what we have to search ", this.searchQ);
      
      this.search();

    })

    // this.getParam();
  }


  search(){
    this.httpService.searchByCategory(this.searchQ) // method called need to be changed later
        .subscribe(
          result => {
            this.searchResult = result;
              console.log("searchresult ",this.searchResult);
              
            },
            error => {
            this.errorMessage = <any>error;
              if (this.errorMessage) {
                console.log(this.errorMessage);
              }
            }
        );
  }

}
