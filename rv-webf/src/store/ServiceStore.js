import { defineStore } from 'pinia';
import { useAuthStore } from './AuthStore';
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';

const respository = RepositoriesFactory.get('RoomServiceRepository');

export const useServiceStore = defineStore('service', {
  state: () => ({
    imageGenerated: 0,
  }),
  getters: {
    getImageGenerateCount: (state) => state.imageGenerated
  },
  actions: {
    updateImageGenerated(count) {
      this.imageGenerated = count;
    },
    async genImage(prompt, ratio){
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw { status: 401, message: 'User not authenticated for image generation.' };
      }
      try {
          const response = await respository.create(prompt, ratio);
          if(response.data.token){
            authStore.setToken(response.data.token);
          }
          return response;
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
    async renovateImage(prompt, image, ratio){
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw { status: 401, message: 'User not authenticated for image generation.' };
      }

      try {
        const response = await respository.renovate(prompt, image, ratio);
        if(response.data.token){
          authStore.setToken(response.data.token);
        }
        return response;
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
    }
  }
});