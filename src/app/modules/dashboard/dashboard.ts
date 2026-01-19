import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/employee.model';

interface DashboardStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
}

interface RecentActivity {
  id: string;
  action: string;
  employee: string;
  time: string;
  type: 'add' | 'edit' | 'delete';
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats: DashboardStat[] = [];
  recentActivities: RecentActivity[] = [];
  totalEmployees: number = 0;
  activeEmployees: number = 0;
  inactiveEmployees: number = 0;
  onLeaveEmployees: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const employees = this.employeeService.getAllEmployees();
    this.totalEmployees = employees.length;
    this.activeEmployees = employees.filter((e: Employee) => e.status === 'Active').length;
    this.inactiveEmployees = employees.filter((e: Employee) => e.status === 'Inactive').length;
    this.onLeaveEmployees = employees.filter((e: Employee) => e.status === 'On Leave').length;

    // Calculate average salary
    const avgSalary = employees.length > 0
      ? employees.reduce((sum: number, e: Employee) => sum + e.basicSalary, 0) / employees.length
      : 0;

    // Generate stats
    this.stats = [
      {
        title: 'Total Employees',
        value: this.totalEmployees,
        icon: 'people',
        color: 'primary',
        change: '+12%'
      },
      {
        title: 'Active Employees',
        value: this.activeEmployees,
        icon: 'check_circle',
        color: 'success',
        change: '+5%'
      },
      {
        title: 'On Leave',
        value: this.onLeaveEmployees,
        icon: 'event_busy',
        color: 'warning',
        change: '-2%'
      },
      {
        title: 'Average Salary',
        value: this.formatCurrency(avgSalary),
        icon: 'attach_money',
        color: 'info',
        change: '+3.5%'
      }
    ];

    // Generate recent activities (dummy data)
    this.recentActivities = [
      {
        id: '1',
        action: 'New employee added',
        employee: 'John Doe',
        time: '2 hours ago',
        type: 'add'
      },
      {
        id: '2',
        action: 'Employee updated',
        employee: 'Jane Smith',
        time: '5 hours ago',
        type: 'edit'
      },
      {
        id: '3',
        action: 'Employee updated',
        employee: 'Michael Johnson',
        time: '1 day ago',
        type: 'edit'
      },
      {
        id: '4',
        action: 'New employee added',
        employee: 'Sarah Williams',
        time: '2 days ago',
        type: 'add'
      },
      {
        id: '5',
        action: 'Employee updated',
        employee: 'David Brown',
        time: '3 days ago',
        type: 'edit'
      }
    ];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }
}
