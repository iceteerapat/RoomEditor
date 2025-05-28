import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import RepositoriesFactory from '../apis/repositories/RepositoriesFactory';

const repository = RepositoriesFactory.get('AuthRepository');
const router = useRouter();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    username: null,
    email: null
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await repository.login({email, password});
        if (response != null) {
          this.token = response.data.token;
          this.email = response.data.userEmail;
          this.username = response.data.userUsername;
          alert('Login Success');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', response.data.userEmail);
          localStorage.setItem('username', response.data.userUsername);
          window.refresh;
        }
      } catch (error) {
        alert('Login failed');
        console.error(error);
      }

    },
    async logout(){
      try {
        await repository.logout();
        this.token = null;
        this.email = null;
        this.username = null;
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        alert('Logged out');
        window.refresh;
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
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