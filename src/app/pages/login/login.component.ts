import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

interface DocumentType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  loginForm: FormGroup | any;
  // @Output() formularioEnviado: EventEmitter<any> = new EventEmitter<any>();
  // @Input() error: string = '';
  documentTypes: DocumentType[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'cedula', viewValue: 'Cédula'},
    {value: 'pasaporte', viewValue: 'Pasaporte'},
  ];

  get documentType() { return this.loginForm.get('documentType'); }
  get documentNumber() { return this.loginForm.get('documentNumber'); }
  get password() { return this.loginForm.get('password'); }

  constructor() {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'documentType': new FormControl(null, [
        Validators.required
      ]),
      'documentNumber': new FormControl(null, [
        Validators.required,
        // Validators.min(999999),
        Validators.max(99999999)]
        ),
      'password': new FormControl(null, [
        Validators.required, this.emptyValidator
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
    if (!this.loginForm.valid) {
      return;
    }
    const obj = this.loginForm.value;
    console.log(obj);
    //   signInWithEmailAndPassword(this.auth, obj.email, obj.password)
    //     .then(uc => {
    //       console.log("User credential (uc):");
    //       console.log(uc.user);
    //       console.log("this.auth.currentUser:");
    //       console.log(this.auth.currentUser);
    //     })
    //     .catch(error => {
    //       console.log(error.code);
    //       console.log(error.message);
    //     })
  }
}
