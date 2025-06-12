import { Component, HostListener, inject, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../users/services/accountService';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  isNavbarCollapsed = true;
  isDropdownOpen = false;
  accountService = inject(AccountService);
  router = inject(Router);
  elementRef = inject(ElementRef);

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Only close dropdown if clicking outside the dropdown area
    const target = event.target as Element;
    const dropdownElement = this.elementRef.nativeElement.querySelector('.dropdown');

    if (this.isDropdownOpen && dropdownElement && !dropdownElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isNavbarCollapsed = true;
    this.isDropdownOpen = false;
  }

  logout() {
    this.isDropdownOpen = false;
    this.accountService.logout();
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
