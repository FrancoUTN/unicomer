import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

interface DocumentType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private auth: Auth = inject(Auth);
  signupForm: FormGroup | any;
  documentTypes: DocumentType[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'cedula', viewValue: 'Cédula'},
    {value: 'pasaporte', viewValue: 'Pasaporte'},
  ];

  get documentType() { return this.signupForm.get('documentType'); }
  get documentNumber() { return this.signupForm.get('documentNumber'); }
  get password() { return this.signupForm.get('password'); }
  get passwordRepeat() { return this.signupForm.get('passwordRepeat'); }

  constructor() {
  }

  // Add better validations (eg: no-spaces for passwords)
  ngOnInit() {
    this.signupForm = new FormGroup({
      'documentType': new FormControl(null, [
        Validators.required
      ]),
      'documentNumber': new FormControl(null, [
        Validators.required,
        // Validators.min(999999),
        Validators.max(99999999)
      ]),
      'password': new FormControl(null, [
        Validators.required,
        this.emptyValidator,
        Validators.minLength(6)
      ]),
      'passwordRepeat': new FormControl(null, [
        Validators.required,
        this.emptyValidator,
        Validators.minLength(6)
      ]),
    });
  }
  
  emptyValidator(control: AbstractControl): object | null {
    const valor = control.value;
    if (valor) {
      if (valor.trim().length === 0) {
        return { emptyField: true};
      };
    };
    return null;
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const obj = this.signupForm.value;
    // console.log(obj);
    const fakeEmail: string = obj.documentNumber + '@grabomail.com';
    createUserWithEmailAndPassword(this.auth, fakeEmail, obj.passwordRepeat)
      .then(uc => {
        console.log("User credential (uc):");
        console.log(uc.user);
        console.log("this.auth.currentUser:");
        console.log(this.auth.currentUser);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
      })
  }
}
