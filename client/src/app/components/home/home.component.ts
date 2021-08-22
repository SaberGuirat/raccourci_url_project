import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  longUrl: string;
  shortUrl: string;
  code: string;
  errMess: string;
  loading: boolean = false;

  constructor(private urlService: UrlService, private router: Router) {}

  ngOnInit(): void {}

  navigate() {
    this.router.navigateByUrl(`/${this.code}`);
  }

  generate(url: string) {
    this.loading = true;
    this.urlService.generate(url).subscribe(
      (data) => {
        this.loading = false;
        this.shortUrl = data.shortUrl;
        this.code = data.urlCode;
      },
      (err) => {
        this.loading = false;
        this.errMess = err;
        setTimeout(() => {
          this.errMess = '';
        }, 2000);
      }
    );
  }
}
