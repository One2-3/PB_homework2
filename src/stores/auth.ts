import { defineStore } from "pinia";
import { lsGet, lsSet } from "@/composables/useLocalStorage";

type User = { email: string; password: string }; // password = TMDB API Key
type AuthState = { isLoggedIn: boolean; email: string; rememberMe: boolean; savedEmail: string };

const USERS_KEY = "users";
const AUTH_KEY = "auth";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({ isLoggedIn: false, email: "", rememberMe: false, savedEmail: "" }),

  actions: {
    hydrate() {
      const auth = lsGet<AuthState>(AUTH_KEY, { isLoggedIn:false, email:"", rememberMe:false, savedEmail:"" });
      this.$patch(auth);
    },

    signup(email: string, password: string, password2: string, agreed: boolean) {
      if (!emailRe.test(email)) throw new Error("이메일 형식이 올바르지 않아요.");
      if (!password || password.length < 16) throw new Error("TMDB API Key를 입력해 주세요.");
      if (password !== password2) throw new Error("비밀번호가 일치하지 않아요.");
      if (!agreed) throw new Error("약관에 동의해야 가입할 수 있어요.");

      const users = lsGet<User[]>(USERS_KEY, []);
      if (users.some(u => u.email === email)) throw new Error("이미 가입된 이메일이에요.");

      users.push({ email, password });
      lsSet(USERS_KEY, users);
      return true;
    },

    signin(email: string, password: string, rememberMe: boolean) {
      if (!emailRe.test(email)) throw new Error("이메일 형식이 올바르지 않아요.");

      const users = lsGet<User[]>(USERS_KEY, []);
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) throw new Error("아이디 또는 비밀번호(API Key)가 맞지 않아요.");

      // ✅ 과제 핵심: 비밀번호를 TMDB API Key로 저장
      localStorage.setItem("TMDb-Key", password);

      this.isLoggedIn = true;
      this.email = email;
      this.rememberMe = rememberMe;
      this.savedEmail = rememberMe ? email : "";

      lsSet(AUTH_KEY, { ...this.$state });
    },

    signout() {
      this.isLoggedIn = false;
      this.email = "";
      localStorage.removeItem("TMDb-Key");
      if (!this.rememberMe) this.savedEmail = "";
      lsSet(AUTH_KEY, { ...this.$state });
    },
  },
});
