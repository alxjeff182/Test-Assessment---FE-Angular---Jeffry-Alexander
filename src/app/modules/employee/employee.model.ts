export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

export interface SearchParams {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  group?: string;
}

export interface ListState {
  pageIndex: number;
  pageSize: number;
  sortActive: string;
  sortDirection: 'asc' | 'desc';
  searchParams: SearchParams;
}
