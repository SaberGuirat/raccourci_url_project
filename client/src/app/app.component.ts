import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/user.interface';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Test-Tech';
  links = [
    { path: '/home', icon: 'home', title: 'Home' },
    { path: '/home/stats', icon: 'assessment', title: 'Stats' },
  ];

  user$: Observable<User>;
  userInfo: User;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser().pipe(share());
    this.authService.user$.subscribe((user: User) => {
      this.userInfo = user;
    });
  }
  logout() {
    this.authService.logout();
  }
}
