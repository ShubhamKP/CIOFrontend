import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativeService } from '../http-services/native.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-blog-post',
  templateUrl: './user-blog-post.component.html',
  styleUrls: ['./user-blog-post.component.css']
})
export class UserBlogPostComponent implements OnInit {

  @ViewChild('imageFileInput') imageFileInput: ElementRef;

  blogForm: FormGroup;
  user;
  searchResult;
  errorMessage: any;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router) { }

  ngOnInit() {

    this.user = localStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);

    this.blogForm = this.fb.group({
      'text' : ['', Validators.required]
      // 'imageSelect': ['']
    });

  }

  onImageSelect(event){
    if(event.target.files.length > 0){
      let file = event.target.files[0];
      this.blogForm.get('imageSelect').setValue(file);
    }
  }
  
  prepareSave(forBlock): any{
    let input;
    input = new FormData();
    input.append('text', this.blogForm.get('text').value);
    input.append('imageSelect', this.blogForm.get('imageSelect').value);
    return input;
  }
  
  clearFile(){
    this.blogForm.get('imageSelect').setValue(null);
    this.imageFileInput.nativeElement.value = '';
  }

  addNewBlog(){
    // const postDetail = this.prepareSave("post");
    this.loading = true;
    console.log(this.blogForm.value);
      this.httpService.addBlog(this.blogForm.value)
          .subscribe(
            (result)=>{
              this.loading = false;
              alert(result);
              this.blogForm.reset();
            },
            (error)=>{
              console.log("error occured in adding new post", error);
            }
          );
  }

}
