import { ToastrService } from './../http-services/toastr.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativeService } from '../http-services/native.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css']
})
export class UserWelcomeComponent implements OnInit {

  allCio: any[];
  @ViewChild('imageFileInput') imageFileInput: ElementRef;
  @ViewChild('follow') followBtn: ElementRef;
  @ViewChild('addFriend') addFriendBtn: ElementRef;
  @ViewChild('userInfo') userInfo: ElementRef;
  @ViewChild('postInput') postInput: ElementRef;
  @ViewChild('like') like: ElementRef;

  postForm: FormGroup;
  user;
  // searchResult;
  errorMessage: any;
  loading: boolean = false;
  liked: boolean;
  comments: string[] = [];

  constructor(private fb: FormBuilder, private httpService: NativeService,
    private router: Router, private toast: ToastrService) {

    this.getCios();

  }

  ngOnInit() {

    this.user = localStorage.getItem('currentUser');
    this.user = JSON.parse(this.user);

    this.postForm = this.fb.group({
      'text': ['', Validators.required]
      // 'imageSelect': ['']
    });


  }

  routeToProfile() {
    this.router.navigate(["/userDashboard/userProfile/123"]);
  }

  getCios() {
    this.httpService.getAllCIO().subscribe(
      (result) => {
        this.allCio = result;
      },
      (error) => {
        console.log("error occurred in fetching cios ", error);
      })
  }

  onImageSelect(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.postForm.get('imageSelect').setValue(file);
    }
  }

  prepareSave(forBlock): any {
    let input;
    input = new FormData();
    input.append('text', this.postForm.get('text').value);
    input.append('imageSelect', this.postForm.get('imageSelect').value);
    return input;
  }

  clearFile() {
    this.postForm.get('imageSelect').setValue(null);
    this.imageFileInput.nativeElement.value = '';
  }

  addNewPost() {
    // const postDetail = this.prepareSave("post");
    this.loading = true;
    this.httpService.addPost(this.postForm.value)
      .subscribe(
        (result) => {
          this.loading = false;
          alert(result);
          this.postForm.reset();
        },
        (error) => {
          console.log("error occured in adding new post", error);
        }
      );
  }

  // follow(ciodetail){
  following(event, cioToFollow) {
    console.log('follow');
    let btnValue = event.target.textContent;
    // if (btnValue == "FOLLOW") {
    //   event.target.textContent = "UNFOLLOW";
    //   // this.toast.success("You are now following","Success!");
    // } else {
    //   event.target.textContent = "FOLLOW"
    //   this.toast.warning("You have unfollowed", "Oh!");
    // }
    console.log(cioToFollow);
    let cioData = {};
    cioData["cioName"] = cioToFollow.firstName + " " + cioToFollow.lastName;
    cioData["cioId"] = cioToFollow._id;
    console.log("cio data ", cioData);
    this.httpService.followCio(cioData)
      .subscribe(
        result => {
          this.toast.success(result.toString());
          if (btnValue == "FOLLOW") {
            event.target.textContent = "FOLLOWING";
            event.target.disabled = true;
            // this.toast.success("You are now following","Success!");
          }
          // this.followBtn.nativeElement.textContent = "UNFOLLOW";
        },
        error => {
          this.toast.error("error ", error);
          console.log("error occcured in follow ", error);
        }
      )
  }

  // friendReq(ciodetail){
  friendReq(event, cioToAddFriend) {
    console.log('friend request');
    console.log(cioToAddFriend);
    let cioData = {};
    cioData["cioName"] = cioToAddFriend.firstName + " " + cioToAddFriend.lastName;
    cioData["cioId"] = cioToAddFriend._id;
    console.log("cio data ", cioData);
    this.httpService.addFriend(cioData)
      .subscribe(
        result => {
          this.toast.success("Friend request send", "Success!");
          let btnValue = event.target.textContent;
          if (btnValue == "ADD FRIEND") {
            console.log(btnValue);
            event.target.textContent = "REQUEST SENT";
            event.target.disabled = true;
          }
        },
        error => {
          this.toast.error("error occcured in sending friend request ", error);
        }
      )
  }

  addComment(event) {
    console.log(event.target.value);
    this.comments.push(event.target.value);
  }

  likeIt(event) {
    console.log("clik");
    let likeBtn = event.target;
    let thumb = likeBtn.children[0];
    if (thumb.classList.contains('liked')) {
      thumb.classList.remove('liked');
      return;
    }
    thumb.classList.add('liked');
    return;
  }

  postFocused(event) {
    this.userInfo.nativeElement.style.display = "block";
  }

  postUnfocused() {
    let val = this.postInput.nativeElement.value;
    if (val === "" || val == null) {
      this.userInfo.nativeElement.style.display = "none";
    }
  }

}
