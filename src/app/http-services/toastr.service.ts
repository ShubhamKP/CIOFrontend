import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastrService {

  constructor(private toastr: ToastsManager) { }

  success(message:string, title?:string){
    this.toastr.success(message, title)
  }

  warning(message:string, title?:string){
    this.toastr.warning(message, title)
  }

  info(message:string, title?:string){
    this.toastr.info(message, title)
  }

  error(message:string, title?:string){
    this.toastr.error(message, title)
  }
}
