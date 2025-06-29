import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';

const repository = RepositoriesFactory.get('AuthRepository');

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userDecodedData: null,
  }),
    getters: {
    isAuthenticated: (state) => !!state.token,
    getUserEmail: (state) => state.userDecodedData?.email,
    getUsername: (state) => state.userDecodedData?.username,
    getCustomerId: (state) => state.userDecodedData?.customerId,
    getProductName: (state) => state.userDecodedData?.productName,
    getCreditsFromToken: (state) => state.userDecodedData?.credits,
  },
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('token', newToken);
      console.log('AuthStore: New token received and set in localStorage.');
      try {
        this.userDecodedData = jwtDecode(newToken);
        console.log('AuthStore: Token decoded, userDecodedData updated:', this.userDecodedData);
        console.log('AuthStore: Decoded username:', this.userDecodedData?.username); // Specific check for username
        
        const serviceStore = useServiceStore();
        serviceStore.updateCredits(this.userDecodedData.credits);
      } catch (e) {
        console.error('Failed to decode token:', e);
        this.userDecodedData = null;
        this.token = null;
        localStorage.removeItem('token');
      }
    },

    initializeAuth() {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            this.setToken(storedToken);
        }
    },
    async login(email, password) {
      try {
        const response = await repository.login({email, password});

        if (response != null) {
          this.setToken(response.data.token);
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
      if (!this.token) return;
      try {
        const response = await repository.refresh();
        if (response && response.data.token) {
          this.setToken(response.data.token);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout();
      }
    }
  }
});

import { useServiceStore } from './ServiceStore';