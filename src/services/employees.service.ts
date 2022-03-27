import { apiUrl, endPoints } from "../constants/api";
import { EmployeeCreateUpdateModel, IEmployee, IEmployeesResponse } from "../models/employee-models";
import authService from "./auth.service";

class EmployeesService {

  #defaultHeaders = {
    'Content-Type': 'application/json'
  }
  constructor() {
  }

  async getAll(filter?: {
    page?: number
  }): Promise<IEmployeesResponse> {
    const authHeader = await authService.getAuthHeader();
    const endPoint = `${apiUrl}${endPoints.employees}${filter?.page ? `?page=${filter.page}` : ''}`;
    try {
      const res = await fetch(endPoint, {
        method: 'GET',
        headers: {
          ...this.#defaultHeaders,
          ...authHeader
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getById(id: number): Promise<IEmployee> {
    const authHeader = await authService.getAuthHeader();
    const endPoint = `${apiUrl}${endPoints.employee}`;
    try {
      const res = await fetch(`${endPoint}/${id}`, {
        method: 'GET',
        headers: {
          ...this.#defaultHeaders,
          ...authHeader
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async create(model: EmployeeCreateUpdateModel): Promise<IEmployee> {
    const authHeader = await authService.getAuthHeader();
    const endPoint = `${apiUrl}${endPoints.employee}`;
    try {
      const res = await fetch(`${endPoint}`, {
        method: 'POST',
        headers: {
          ...this.#defaultHeaders,
          ...authHeader
        },
        body: JSON.stringify(model)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(id: string, model: EmployeeCreateUpdateModel): Promise<IEmployee | null> {
    const authHeader = await authService.getAuthHeader();
    const endPoint = `${apiUrl}${endPoints.employee}`;
    try {
      const res = await fetch(`${endPoint}/${id}`, {
        method: 'PUT',
        headers: {
          ...this.#defaultHeaders,
          ...authHeader
        },
        body: JSON.stringify(model)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    const authHeader = await authService.getAuthHeader();
    const endPoint = `${apiUrl}${endPoints.employee}`;
    try {
      const res = await fetch(`${endPoint}/${id}`, {
        method: 'DELETE',
        headers: {
          ...this.#defaultHeaders,
          ...authHeader
        }
      });
      if (res.ok) {
        return;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new EmployeesService();