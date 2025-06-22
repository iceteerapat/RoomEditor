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
          console.error(error);
          if (error.response) {
            return error.response;
          } else {
            return { status: 500, data: { message: 'Unknown error' } };
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