import { Component } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
routes = routes
  /**
   * constructor function.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(private router: Router) {}

  /**
   * navigate function.
   * @returns {*} Result.
   */
  public navigate() {
    this.router.navigate([routes.login]);
  }
  public password : boolean[] = [false];

  /**
   * togglePassword function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  public togglePassword(index: any){
    this.password[index] = !this.password[index]
  }
}
