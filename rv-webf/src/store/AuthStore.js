import { defineStore } from 'pinia';
import RepositoriesFactory from '../apis/repositories/RepositoriesFactory';

const repository = RepositoriesFactory.get('AuthRepository');

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
        }
      } catch (error) {
        alert('Login failed');
        console.error(error);
      }

    },
    async logout(){

    },
    async refresh(){

    }
  }
});