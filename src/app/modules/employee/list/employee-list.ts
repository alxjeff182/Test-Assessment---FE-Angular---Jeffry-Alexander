import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Employee, SearchParams, ListState } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatCardModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'birthDate', 'basicSalary', 'status', 'group', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  searchForm: FormGroup;
  groups: string[] = [];
  statuses: string[] = [];
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private stateService: StateService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      status: [''],
      group: ['']
    });
  }

  ngOnInit(): void {
    this.groups = this.employeeService.getGroups();
    this.statuses = this.employeeService.getStatuses();
    this.allEmployees = this.employeeService.getAllEmployees();
    
    // Load saved state
    const savedState = this.stateService.getState();
    if (savedState) {
      this.restoreState(savedState);
    } else {
      this.filteredEmployees = [...this.allEmployees];
      this.dataSource.data = this.filteredEmployees;
    }

    // Watch for search form changes
    this.searchForm.valueChanges.subscribe(() => {
      this.applySearch();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Restore pagination and sort state
    const savedState = this.stateService.getState();
    if (savedState) {
      if (this.paginator) {
        this.paginator.pageIndex = savedState.pageIndex;
        this.paginator.pageSize = savedState.pageSize;
      }
      if (this.sort && savedState.sortActive) {
        this.sort.active = savedState.sortActive;
        this.sort.direction = savedState.sortDirection;
      }
    }
  }

  restoreState(state: ListState): void {
    // Restore search form
    if (state.searchParams) {
      this.searchForm.patchValue(state.searchParams, { emitEvent: false });
    }
    
    // Apply search with saved params
    this.applySearch();
  }

  applySearch(): void {
    const searchParams: SearchParams = {
      username: this.searchForm.get('username')?.value || undefined,
      firstName: this.searchForm.get('firstName')?.value || undefined,
      lastName: this.searchForm.get('lastName')?.value || undefined,
      email: this.searchForm.get('email')?.value || undefined,
      status: this.searchForm.get('status')?.value || undefined,
      group: this.searchForm.get('group')?.value || undefined
    };

    // Remove empty values
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key as keyof SearchParams];
      if (!value || value === '') {
        delete searchParams[key as keyof SearchParams];
      }
    });

    this.filteredEmployees = this.employeeService.searchEmployees(searchParams);
    this.dataSource.data = this.filteredEmployees;
    
    // Reset paginator
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    // Save state
    this.saveState();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.filteredEmployees = [...this.allEmployees];
    this.dataSource.data = this.filteredEmployees;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.saveState();
  }

  onPageChange(event: PageEvent): void {
    this.saveState();
  }

  onSortChange(sort: Sort): void {
    this.saveState();
  }

  saveState(): void {
    const state: ListState = {
      pageIndex: this.paginator?.pageIndex || 0,
      pageSize: this.paginator?.pageSize || 10,
      sortActive: this.sort?.active || '',
      sortDirection: (this.sort?.direction as 'asc' | 'desc') || 'asc',
      searchParams: {
        username: this.searchForm.get('username')?.value || undefined,
        firstName: this.searchForm.get('firstName')?.value || undefined,
        lastName: this.searchForm.get('lastName')?.value || undefined,
        email: this.searchForm.get('email')?.value || undefined,
        status: this.searchForm.get('status')?.value || undefined,
        group: this.searchForm.get('group')?.value || undefined
      }
    };
    
    // Remove empty search params
    Object.keys(state.searchParams).forEach(key => {
      const value = state.searchParams[key as keyof SearchParams];
      if (!value || value === '') {
        delete state.searchParams[key as keyof SearchParams];
      }
    });

    this.stateService.saveState(state);
  }

  navigateToAdd(): void {
    this.router.navigate(['/employees/add']);
  }

  navigateToDetail(employee: Employee): void {
    this.saveState();
    this.router.navigate(['/employees', employee.id]);
  }

  editEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.snackBar.open(`Edit functionality for ${employee.firstName} ${employee.lastName}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['yellow-snackbar']
    });
  }

  deleteEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.snackBar.open(`Delete functionality for ${employee.firstName} ${employee.lastName}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['red-snackbar']
    });
  }

  logout(): void {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
