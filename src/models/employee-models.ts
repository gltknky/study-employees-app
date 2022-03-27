export interface IEmployeesResponse {
  data: IEmployee[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  },
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: [
      {
        url: string;
        label: string;
        active: boolean;
      },
      {
        url: string;
        label: string;
        active: boolean;
      },
      {
        url: string;
        label: string;
        active: boolean;
      }
    ],
    path: string;
    per_page: number;
    to: number;
    total: number;
  }
}

export interface IEmployee {
  uuid: string;
  first_name: string;
  last_name: string;
  department: string;
}

export class Employee implements IEmployee {
  uuid: string = "";
  first_name: string = "";
  last_name: string = "";
  department: string = "";
}
export interface EmployeeCreateUpdateModel {
  first_name?: string;
  last_name?: string;
  department?: string;
}
