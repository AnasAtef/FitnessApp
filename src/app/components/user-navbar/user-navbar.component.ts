import { Component, HostListener, inject, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../users/services/accountService';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  isDropdownOpen = false;
  accountService = inject(AccountService);
  elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Only close dropdown if clicking outside the dropdown area
    const target = event.target as Element;
    const dropdownElement = this.elementRef.nativeElement.querySelector('.dropdown');

    if (this.isDropdownOpen && dropdownElement && !dropdownElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.isDropdownOpen = false;
    this.accountService.logout();
  }
}
