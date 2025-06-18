import { formRequest } from "@/api/request";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { toast } from "vue-sonner";
import { login_url, register_url } from "@/utils/constants";
import type { Router } from "vue-router";

export interface Register {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    async register(payload: object) {
      this.loading = true;
      try {
        let response = await formRequest("POST", register_url, payload);
        toast.success(response.data.message);
        return true;
      } catch (err: unknown) {
        console.error('Navigation error:', err);
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = String(err);
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    async login(payload: object, router: Router) {
      this.loading = true;
      try {
        let response = await formRequest("POST", login_url, payload);
        Cookies.set('accessToken', response.data?.access_token);
        Cookies.set('user_id', response.data?.user?.id);
        Cookies.set('email', response.data?.user?.email);
        Cookies.set('user_role', response.data?.user?.roles[0]?.name || 'User');
        if (response.data?.user?.roles[0]?.name === 'Admin') {
            router.push("/dashboard");
        } else {
            router.push("/todo");
        }
        toast.success(response.data.message);
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
    },
    async logout(router: Router) {
      // List of cookies to be removed
      const cookiesToRemove = ['accessToken', 'user_id', 'user_role', 'email'];

      // Remove all specified cookies
      cookiesToRemove.forEach(cookie => Cookies.remove(cookie));
      localStorage.clear();
      router.push("/login");
    }
  }
})