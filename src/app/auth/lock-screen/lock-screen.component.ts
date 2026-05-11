import { Component } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lock-screen',
  imports: [CommonModule,FormsModule],
  templateUrl: './lock-screen.component.html',
  styleUrl: './lock-screen.component.scss'
})
export class LockScreenComponent {
routes = routes;
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
