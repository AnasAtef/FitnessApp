import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from "./components/admin-navbar/admin-navbar.component";
import { UserNavbarComponent } from "./components/user-navbar/user-navbar.component";
import { AccountService } from './components/users/services/accountService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminNavbarComponent, UserNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fitness-app';

  accountService =inject(AccountService);

}
