import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

function checkPasswords(password: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const confirmPass = control.value;
    return confirmPass !== password.value ? { match: false } : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errMess: string = '';

  loading: boolean = false;

  fullname = new FormControl('', [
    Validators.required,
    Validators.maxLength(25),
  ]);

  email = new FormControl('', [Validators.required, Validators.email]);

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  cf_password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    checkPasswords(this.password),
  ]);
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    if (
      this.fullname.valid &&
      this.email.valid &&
      this.password.valid &&
      this.cf_password.valid
    ) {
      this.loading = true;
      this.authService
        .register({
          fullname: this.fullname.value,
          email: this.email.value,
          password: this.password.value,
        })
        .subscribe(
          (data) => {
            this.loading = false;
            this.router.navigateByUrl('/login');
            this.resetForm();
          },
          (err) => {
            this.loading = false;
            this.errMess = <any>err;
            setTimeout(() => {
              this.errMess = '';
            }, 3000);
          }
        );
    }
  }

  resetForm() {
    this.fullname.reset();
    this.email.reset();
    this.password.reset();
    this.cf_password.reset();
  }
}
