import { defineStore } from 'pinia';
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';

const repository = RepositoriesFactory.get('AuthRepository');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await repository.login({email, password});

        if (response != null) {
          this.token = response.data.token;
          localStorage.setItem('token', response.data.token);
          return response;
        }
      } catch (error) {
        if (error.response) {
          console.error('Login API error:', error.response.status, error.response.data);
          throw {
            status: error.response.status,
            message: error.response.data.message || `Login failed with status ${error.response.status}.`,
            data: error.response.data
          };
        } else if (error.request) {
          console.error('Login network error:', error.request);
          throw { status: 0, message: 'Network error: No response from server. Please check your internet connection.' };
        } else {
          console.error('Login client-side error:', error.message);
          throw { status: 500, message: 'An unexpected client-side error occurred during login.' };
        }
      }
    },
    async logout(){
      try {
        await repository.logout();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.token = null;
        localStorage.removeItem('token');
      }
    },
    async refresh(){
      try {
        const response = await repository.refresh();
        if (response && response.data.token) {
          this.token = response.data.token;
          localStorage.setItem('token', response.data.token);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout();
      }
    }
  }
});