import { AbstractControl, ValidatorFn } from '@angular/forms';

export class EmailValidator {

    static email():ValidatorFn {
        return (c:AbstractControl):{[key:string]:boolean} | null => {
        let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(EMAIL_REGEXP.test(c.value)!=true)
        {
            return { 'email': true}
        }
        return null;
        };

    }
}