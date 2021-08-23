import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlI } from 'src/app/interfaces/url.interface';
import { UrlService } from 'src/app/services/url.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent implements OnInit {
  code: string;
  url: UrlI;
  message: string = '....redirecting wait pls ';
  errMessage: string = '';
  loding: boolean = false;
  constructor(private route: ActivatedRoute, private urlService: UrlService) {}

  ngOnInit(): void {
    this.loding = true;
    this.code = this.route.snapshot.params.code;
    this.urlService.visitUrl(this.code).subscribe(
      (url: UrlI) => {
        this.url = url;
        this.errMessage = '';
        setTimeout(() => {
          this.loding = false;
          this.message = `successfully redirected to ${url.longUrl}`;
          window.open(url.longUrl);
        }, 1000);
      },
      (err) => {
        setTimeout(() => {
          this.loding = false;
          this.errMessage = err;
        }, 1000);
      }
    );
  }
}
