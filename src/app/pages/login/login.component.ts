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
      if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Clave incorrecta.';
      }
      else {
        this.errorMessage = error.message;
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
