import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User = {
    email: '',
    password: '',
  };
  errMess: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(user: User) {
    this.loading = true;
    this.authService.login(user).subscribe(
      (data) => {
        this.router.navigateByUrl('/home');
        this.loading = false;
        this.errMess = '';
        this.user.email = '';
        this.user.password = '';      },
      (err) => {
        this.loading = false;
        this.errMess = err;
        setTimeout(() => {
          this.errMess = '';
        }, 3000);
      }
    );
  }
}
