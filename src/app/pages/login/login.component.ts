import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup | any;
  @Output() formularioEnviado: EventEmitter<any> = new EventEmitter<any>();
  @Input() error: string = '';

  get documentType() { return this.loginForm.get('documentType'); }
  get documentNumber() { return this.loginForm.get('documentNumber'); }
  get password() { return this.loginForm.get('password'); }

  constructor() {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'documentType': new FormControl(null, [Validators.required]),
      'documentNumber': new FormControl(null, [Validators.required, Validators.min(999999), Validators.max(99999999)]),
      'password': new FormControl(null, [Validators.required, this.emptyValidator]),
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
    const obj = this.loginForm.value;
    console.log(obj);
    // this.formularioEnviado.emit(obj);
  }
}
