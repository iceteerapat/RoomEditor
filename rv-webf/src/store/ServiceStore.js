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
          console.error(error);
          if (error.response) {
            return error.response;
          } else {
            return { status: 500, data: { message: 'Unknown error' } };
          }
      }
    },
    async renovateImage(prompt, image, ratio){
      try {
            const response = await respository.renovate(prompt, image, ratio);
            return response;
      } catch (error) {
          console.error(error);
          if (error.response) {
            return error.response;
          } else {
            return { status: 500, data: { message: 'Unknown error' } };
          }
      }
    }
  }
});