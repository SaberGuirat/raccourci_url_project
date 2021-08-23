import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
