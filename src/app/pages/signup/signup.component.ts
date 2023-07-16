import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup | any;
  @Output() formularioEnviado: EventEmitter<any> = new EventEmitter<any>();
  @Input() error: string = '';

  get documentType() { return this.signupForm.get('documentType'); }
  get documentNumber() { return this.signupForm.get('documentNumber'); }
  get password() { return this.signupForm.get('password'); }
  get passwordRepeat() { return this.signupForm.get('passwordRepeat'); }

  constructor() {
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'documentType': new FormControl(null, [Validators.required]),
      'documentNumber': new FormControl(null, [Validators.required, Validators.min(999999), Validators.max(99999999)]),
      'password': new FormControl(null, [Validators.required, this.emptyValidator]),
      'passwordRepeat': new FormControl(null, [Validators.required, this.emptyValidator]),
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
    const obj = this.signupForm.value;
    console.log(obj);
    // this.formularioEnviado.emit(obj);
  }
}
