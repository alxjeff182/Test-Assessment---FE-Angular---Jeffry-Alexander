import { Injectable } from '@angular/core';
import { ListState, SearchParams } from '../../modules/employee/employee.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly STORAGE_KEY = 'employeeListState';

  saveState(state: ListState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  getState(): ListState | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  }

  clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getDefaultState(): ListState {
    return {
      pageIndex: 0,
      pageSize: 10,
      sortActive: '',
      sortDirection: 'asc',
      searchParams: {}
    };
  }
}
