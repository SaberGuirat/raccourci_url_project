import { Component, OnInit, ViewChild } from '@angular/core';
import { UrlI } from 'src/app/interfaces/url.interface';
import { UrlService } from '../../services/url.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  urls: UrlI[] = [];
  errMessage: string = '';
  displayedColumns: string[] = [
    'position',
    'URL',
    'createdAt',
    'visited',
    'actions',
  ];
  dataSource = new MatTableDataSource<UrlI>([]);

  constructor(private urlService: UrlService, private router: Router) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.urlService.getUserUrls().subscribe(
      (urls: UrlI[]) => {
        this.urls = urls;
        this.dataSource = new MatTableDataSource<UrlI>(urls);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      (err) => (this.errMessage = err)
    );
  }
  deleteUrl(id: string) {
    this.urlService.delete(id).subscribe(
      (url) => {
        this.urls = this.urls.filter((el) => el._id !== url._id);
        this.dataSource = new MatTableDataSource<UrlI>(this.urls);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      (err) => console.log(err)
    );
  }

  visitUrl(code: string) {
    this.urlService.visitUrl(code).subscribe(
      (url) => {
        this.urls = this.urls.map((el) => {
          if (el._id === url._id) return { ...el, visited: url.visited };
          else {
            return el;
          }
        });
        this.dataSource = new MatTableDataSource<UrlI>(this.urls);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
        window.open(url.longUrl);
      },
      (err) => console.log(err)
    );
  }

  navigate(code: string) {
    this.router.navigateByUrl(`/${code}`);
  }
}
