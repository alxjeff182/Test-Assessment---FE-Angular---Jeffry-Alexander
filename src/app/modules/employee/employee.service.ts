import { Injectable } from '@angular/core';
import { Employee, SearchParams } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];
  private readonly groups = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Support',
    'Management'
  ];

  private readonly statuses = ['Active', 'Inactive', 'On Leave', 'Terminated'];

  constructor() {
    this.employees = this.generateDummyEmployees();
  }

  getAllEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const newEmployee: Employee = {
      ...employee,
      id: this.generateId()
    };
    this.employees.push(newEmployee);
  }

  updateEmployee(id: string, employee: Partial<Employee>): void {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
    }
  }

  deleteEmployee(id: string): void {
    this.employees = this.employees.filter(emp => emp.id !== id);
  }

  searchEmployees(searchParams: SearchParams): Employee[] {
    let filtered = [...this.employees];

    if (searchParams.username) {
      filtered = filtered.filter(emp =>
        emp.username.toLowerCase().includes(searchParams.username!.toLowerCase())
      );
    }

    if (searchParams.firstName) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchParams.firstName!.toLowerCase())
      );
    }

    if (searchParams.lastName) {
      filtered = filtered.filter(emp =>
        emp.lastName.toLowerCase().includes(searchParams.lastName!.toLowerCase())
      );
    }

    if (searchParams.email) {
      filtered = filtered.filter(emp =>
        emp.email.toLowerCase().includes(searchParams.email!.toLowerCase())
      );
    }

    if (searchParams.status) {
      filtered = filtered.filter(emp => emp.status === searchParams.status);
    }

    if (searchParams.group) {
      filtered = filtered.filter(emp => emp.group === searchParams.group);
    }

    return filtered;
  }

  getGroups(): string[] {
    return [...this.groups];
  }

  getStatuses(): string[] {
    return [...this.statuses];
  }

  private generateId(): string {
    return `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDummyEmployees(): Employee[] {
    const employees: Employee[] = [];
    const firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
      'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel',
      'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Amy', 'Mark', 'Angela',
      'Donald', 'Brenda', 'Steven', 'Emma', 'Paul', 'Olivia', 'Andrew', 'Cynthia',
      'Joshua', 'Marie', 'Kenneth', 'Janet', 'Kevin', 'Catherine', 'Brian', 'Frances',
      'George', 'Christine', 'Timothy', 'Samantha', 'Ronald', 'Deborah', 'Jason',
      'Rachel', 'Edward', 'Carolyn', 'Jeffrey', 'Janet', 'Ryan', 'Virginia',
      'Jacob', 'Maria', 'Gary', 'Heather', 'Nicholas', 'Diane', 'Eric', 'Julie',
      'Jonathan', 'Joyce', 'Stephen', 'Victoria', 'Larry', 'Kelly', 'Justin', 'Christina',
      'Scott', 'Joan', 'Brandon', 'Evelyn', 'Benjamin', 'Judith', 'Samuel', 'Megan',
      'Frank', 'Cheryl', 'Gregory', 'Andrea', 'Raymond', 'Hannah', 'Alexander', 'Jacqueline',
      'Patrick', 'Martha', 'Jack', 'Gloria', 'Dennis', 'Teresa', 'Jerry', 'Sara',
      'Tyler', 'Janice', 'Aaron', 'Marie', 'Jose', 'Julia', 'Henry', 'Grace'
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
      'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
      'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
      'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
      'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz',
      'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook',
      'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed',
      'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
      'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price',
      'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster'
    ];

    for (let i = 0; i < 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
      const email = `${username}@company.com`;
      const birthDate = this.randomDate(new Date(1970, 0, 1), new Date(2000, 11, 31));
      const basicSalary = Math.floor(Math.random() * 50000000) + 5000000; // 5M to 55M
      const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];
      const group = this.groups[Math.floor(Math.random() * this.groups.length)];
      const description = `Employee ${i + 1} - ${firstName} ${lastName} working in ${group} department.`;

      employees.push({
        id: `emp-${i + 1}`,
        username,
        firstName,
        lastName,
        email,
        birthDate,
        basicSalary,
        status,
        group,
        description
      });
    }

    return employees;
  }

  private randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}
