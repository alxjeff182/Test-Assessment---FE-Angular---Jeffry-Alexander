import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy {
  sidenavOpened = true;
  currentUrl: string = '';
  private routerSubscription?: Subscription;
  
  readonly menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Employee List', route: '/employees', icon: 'list' }
  ];

  get isDashboardActive(): boolean {
    const url = (this.currentUrl || this.router.url || '').split('?')[0].split('#')[0].trim();
    const result = url === '/dashboard' || url === '/' || url === '';
    return result;
  }

  get isEmployeesActive(): boolean {
    if (this.isDashboardActive) {
      return false;
    }
    
    const url = (this.currentUrl || this.router.url || '').split('?')[0].split('#')[0].trim();
    
    if (url === '/employees') {
      return true;
    }
    
    if (url.startsWith('/employees/')) {
      const pathAfterEmployees = url.substring('/employees/'.length);
      if (pathAfterEmployees === 'add') {
        return true;
      }
      return pathAfterEmployees.length > 0 && !pathAfterEmployees.includes('/');
    }
    
    return false;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUrl = this.router.url || '';
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]).then(() => {
      this.currentUrl = this.router.url;
      this.cdr.detectChanges();
    });
  }

  isActiveRoute(route: string): boolean {
    if (route === '/dashboard') {
      return this.isDashboardActive;
    }
    if (route === '/employees') {
      return this.isEmployeesActive;
    }
    return false;
  }
}
