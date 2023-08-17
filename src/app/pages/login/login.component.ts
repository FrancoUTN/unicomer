import { Component, inject } from '@angular/core';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, limit, query, where } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  private firestore: Firestore = inject(Firestore);
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

  constructor(private router: Router, private authService: AuthService) {
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
    this.errorMessage = '';
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    const formValue = this.loginForm.value;
    const usersRef = collection(this.firestore, 'users');
    const docNumber = Number(formValue.documentNumber);
    const docType = formValue.documentType;
    const q = query(
      usersRef,
      where('documentNumber', '==', docNumber),
      where('documentType', '==', docType),
      limit(1)
    );
    getDocs(q).then(qs => {
      const userDocument = qs.docs[0];
      if (!userDocument) {
        throw new Error('El documento ingresado no ha sido registrado.');
      }
      const email = userDocument.data().email;
      return signInWithEmailAndPassword(
        this.authService.getAuth(),
        email,
        formValue.password
      );
    }).then(
      () => this.router.navigate(['/home'])
    ).catch(error => {
      console.log(error.code);
      this.errorMessage = error.message;
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
