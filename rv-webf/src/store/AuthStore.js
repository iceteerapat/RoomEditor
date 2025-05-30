import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import RepositoriesFactory from '../apis/repositories/RepositoriesFactory';

const repository = RepositoriesFactory.get('AuthRepository');
const router = useRouter();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await repository.login({email, password});
        if (response != null) {
          this.token = response.data.token;
          this.email = response.data.userEmail;
          this.username = response.data.userUsername;
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', response.data.userEmail);
          localStorage.setItem('username', response.data.userUsername);
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
        this.email = null;
        this.username = null;
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
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