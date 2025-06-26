import { defineStore } from 'pinia';
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';

const respository = RepositoriesFactory.get('RoomServiceRepository');

export const useServiceStore = defineStore('service', {
  state: () => ({
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async genImage(prompt, ratio){
        try {
            const response = await respository.create(prompt, ratio);
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
      try {
            const response = await respository.renovate(prompt, image, ratio);
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