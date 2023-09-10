import { Component, inject } from '@angular/core';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

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
  private firestore: Firestore = inject(Firestore);
  // Add better validations (eg: no-spaces for passwords)
  signupForm: FormGroup = new FormGroup({
    'email': new FormControl(null, [
      Validators.required
    ]),
    'firstName': new FormControl(null, [
      Validators.required
    ]),
    'lastName': new FormControl(null, [
      Validators.required
    ]),
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

  constructor(private router: Router, private authService: AuthService) { }
  
  emptyValidator(control: AbstractControl): object | null {
    const valor = control.value;
    if (valor) {
      if (valor.trim().length === 0) {
        return { emptyField: true};
      };
    };
    return null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] ?? null;
    if (!file) {
      return;
    }
    this.profilePictureTouched = true;
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
    const formValue = this.signupForm.value;
    formValue.profilePicture = this.profilePicture;
    console.log(formValue);
    return;
    this.errorMessage = '';
    if (!this.signupForm.valid) {
      return;
    }
    this.isLoading = true;
    createUserWithEmailAndPassword(
      this.authService.getAuth(),
      formValue.email,
      formValue.passwordRepeat
    ).then(uc => setDoc(doc(this.firestore, 'users', uc.user.uid), {
      documentType: formValue.documentType,
      documentNumber: Number(formValue.documentNumber),
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      // profilePicture
    }))
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
