import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';

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
  loginForm: FormGroup | any;
  documentTypes: DocumentType[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'cedula', viewValue: 'Cédula'},
    {value: 'pasaporte', viewValue: 'Pasaporte'},
  ];
  isLoading: boolean = false;
  errorMessage: string = '';

  get documentType() { return this.loginForm.get('documentType'); }
  get documentNumber() { return this.loginForm.get('documentNumber'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'documentType': new FormControl(null, Validators.required),
      'documentNumber': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
    });
  }

  onSampleUserClick() {
    this.loginForm.patchValue({
      documentType: 'dni',
      documentNumber: '123',
      password: '123123',
    });
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    this.loginService.logIn(this.loginForm.value)
    .then(() => this.router.navigate(['/home']))
    .catch(error => {
      console.log(error.code);
      switch (error.code) {
        case 'auth/wrong-password':
          this.errorMessage = 'Clave incorrecta.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = `Demasiadas solicitudes.
            Vuelva a intentarlo dentro de un rato.`;
          break;
        case 'auth/internal-error':
          this.errorMessage = `Falló el servidor.
            Intente nuevamente.`;
          break;
        default:
          this.errorMessage = error.message;
          break;
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
