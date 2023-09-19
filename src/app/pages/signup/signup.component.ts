import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SignupService } from 'src/app/services/signup.service';

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
  signupForm: FormGroup | any;
  profilePicture: File | any = null;
  profilePictureTouched: boolean = false;
  profilePictureInvalid: boolean = false;
  documentTypes: DocumentType[] = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'cedula', viewValue: 'Cédula'},
    {value: 'pasaporte', viewValue: 'Pasaporte'},
  ];
  selectedFile: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  get email() { return this.signupForm.get('email'); }
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get documentType() { return this.signupForm.get('documentType'); }
  get documentNumber() { return this.signupForm.get('documentNumber'); }
  get password() { return this.signupForm.get('password'); }
  get passwordRepeat() { return this.signupForm.get('passwordRepeat'); }

  constructor(
    private router: Router,
    private signupService: SignupService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      'firstName': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?! ).*(?<! )$/),
        Validators.maxLength(35),
      ]),
      'lastName': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?! ).*(?<! )$/),
        Validators.maxLength(35),
      ]),
      'documentType': new FormControl(null, [
        Validators.required,
      ]),
      'documentNumber': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.max(999999999),
      ]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/^\S*$/),
      ]),
      'passwordRepeat': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/^\S*$/),
      ]),
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] ?? null;
    if (!file) {
      return;
    }
    this.profilePicture = file;
    const isImage = file['type'].includes('image');
    if (isImage) {
      this.profilePictureInvalid = false;
    }
    else {
      this.profilePictureInvalid = true;
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.profilePictureTouched = true;
    if (!this.signupForm.valid) {
      return;
    }
    if (!this.profilePicture || this.profilePictureInvalid) {
      return;
    }
    this.isLoading = true;
    this.signupService.signUp(this.signupForm.value, this.profilePicture)
    .then(() => this.router.navigate(['/home']))
    .catch(error => {
      console.log(error.code);
      this.errorMessage = error.message;
    })
    .finally(() => {
      this.isLoading = false;
    });
  }
}
