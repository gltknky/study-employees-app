import * as SecureStore from 'expo-secure-store';
import { apiUrl, endPoints } from "../constants/api";
import { IAuhResponseModel } from '../models/auth-models';

class AuthService {
  #loginEndPoint = '';
  constructor() {
    this.#loginEndPoint = `${apiUrl}${endPoints.login}`;
  }

  async login(email: string, password: string): Promise<IAuhResponseModel> {
    try {
      const res = await fetch(this.#loginEndPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (res.ok) {
        const data = await res.json();
        this.setTokenToStorage(JSON.stringify(data));
        return data as IAuhResponseModel;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async logout() {
    return await SecureStore.deleteItemAsync('auth');
  }

  async getTokenFromStorage(): Promise<IAuhResponseModel | null> {
    const json = await SecureStore.getItemAsync('auth');
    if (json) {
      return JSON.parse(json);
    } else {
      return null;
    }
  }

  async setTokenToStorage(data: string) {
    return await SecureStore.setItemAsync('auth', data);
  }

  async getAuthHeader() {
    const data = await this.getTokenFromStorage();
    return {
      'Authorization': `Bearer ${data?.token}`
    };
  }
}

export default new AuthService();