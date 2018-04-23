import { NativeService } from './../http-services/native.services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from '../http-services/toastr.service';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('docFileHolder') docFileHolder: ElementRef;

  loading: boolean;
  file;
  uploadDocForm: FormGroup;

  constructor(private fb: FormBuilder, private httpService: NativeService,
              private toast: ToastrService) { }

  ngOnInit() {

    this.uploadDocForm = this.fb.group({
      'docFile': [''],
      'tags': ['', Validators.required]
    })

  }

  // onFileChange(event) {
  //   let docFileHolder = this.docFileHolder.nativeElement;
  //   if (typeof (FileReader) != "undefined") {
  //     if (docFileHolder.childNodes[0]) {
  //       docFileHolder.removeChild(docFileHolder.childNodes[0]);
  //     }
  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //       let image = document.createElement('img');
  //       // image.classList.add('docFileBox');
  //       image.style.width = "200px";
  //       image.style.height = "200px";
  //       image.style.border = "3px solid black";
  //       image.style.borderRadius = "3%";
  //       image.style.boxShadow = "2px 2px 2px 1px slategrey";
  //       image.setAttribute('src', e.target['result']);
  //       docFileHolder.appendChild(image);
  //     }
  //     // docFileHolder.style.display = "block";
  //   } else {
  //     console.log("Your browser does not support FileReader.");
  //   }
  //   reader.readAsDataURL(event.target.files[0]);
  //   if (event.target.files.length > 0) {
  //     this.file = event.target.files[0];
  //     //this.uploadDocForm.get('docFile').setValue(file);
  //   }
  // }

  prepareSave(): any {
    let tags = this.uploadDocForm.get('tags').value;
    let input: FormData = new FormData();
    input.append('docFile', this.fileInput.nativeElement.files[0]);
    input.append('tags[]', tags[0]);
    input.append('tags[]', tags[1]);
    console.log("after  appending ",input.get('docFile'));
    console.log("after  appending 0",input.get('tags[0]'));
    console.log("after  appending 1",input.get('tags[1]'));
    console.log("after  appending 2",input.get('tags[]'));
    // console.log("after  appending ",input.get('companyDescription'));
    return input;
  }

  clearFile() {
    let docFileHolder = this.docFileHolder.nativeElement;
    this.uploadDocForm.get('docFile').setValue(null);
    if (docFileHolder.childNodes[0]) {
      docFileHolder.removeChild(docFileHolder.childNodes[0]);
    }
    this.fileInput.nativeElement.value = '';
  }

  uploadDocs() {
    const docDetail = this.prepareSave();
    this.loading = true;
    this.httpService.addNewDoc(docDetail)
      .subscribe(
        result => {
          this.loading = false;
          this.toast.success(""+result);
          this.uploadDocForm.reset();
          this.clearFile();
        },
        error => {
          this.toast.error("something went wrong, Try Again.");
        }
      );
  }


}
