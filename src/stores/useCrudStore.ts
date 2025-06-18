import { formRequest } from "@/api/request";
import type { Task } from "@/types/interface.tasks";
import type { Users } from "@/types/interface.users";
import { defineStore } from "pinia";

export const useCrudStore = defineStore('crud', {
  state: () => ({
    tasks: [] as Task[],
    users: [] as Users[],
    loading: false,
    error: null as string | null
  }) as Record<string, any>,

  actions: {
    async fetchItems(url: string, loading: boolean, module: string) {
      this.loading = loading;
      try {
        let response = await formRequest("GET", url, {});
        this[module] = response.data[module];
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = String(err);
        }
      } finally {
        if (loading) {
          this.loading = false;
        }
      }
    },
    async createItem(url: string, payload: object) {
      this.loading = true;
      try {
        let response = await formRequest("POST", url, payload);
        alert(response.data.message);
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = String(err);
        }
      } finally {
        this.loading = false;
      }
    },
    async updateItem(url: string, payload: object) {
      this.loading = true;
      try {
        let response = await formRequest("PUT", url, payload);
        alert(response.data.message);
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = String(err);
        }
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(url: string) {
      this.loading = true;
      try {
        let response = await formRequest("DELETE", url, {});
        alert(response.data.message);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = String(err);
        }
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});