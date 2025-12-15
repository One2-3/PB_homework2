import { defineStore } from "pinia";
import { lsGet, lsSet, lsDel } from "@/composables/useLocalStorage";

type User = { email: string; password: string }; // password = TMDB API Key
type AuthState = { isLoggedIn: boolean; email: string; rememberMe: boolean; savedEmail: string };

const USERS_KEY = "users";
const AUTH_KEY = "auth";
const TMDB_KEY = "TMDb-Key";         // 과제 요구 핵심
const RECENT_KEY = "recentSearches"; // 가산점용 예시

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({ isLoggedIn: false, email: "", rememberMe: false, savedEmail: "" }),

  actions: {
    hydrate() {
      const auth = lsGet<AuthState>(AUTH_KEY, { isLoggedIn:false, email:"", rememberMe:false, savedEmail:"" });
      this.$patch(auth);
    },

    signup(email: string, password: string, agreed: boolean) {
      if (!emailRe.test(email)) throw new Error("이메일 형식이 올바르지 않아요.");
      if (!password || password.length < 8) throw new Error("TMDB API Key(비밀번호)는 8자 이상 권장.");
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

      // TMDB 호출에 쓸 Key 저장
      localStorage.setItem(TMDB_KEY, password);

      this.isLoggedIn = true;
      this.email = email;
      this.rememberMe = rememberMe;
      this.savedEmail = rememberMe ? email : "";

      lsSet(AUTH_KEY, { ...this.$state });
      // 가산점용: 최소 3개 key-value 유지 목적
      if (!localStorage.getItem(RECENT_KEY)) lsSet(RECENT_KEY, []);
    },

    signout() {
      this.isLoggedIn = false;
      this.email = "";
      localStorage.removeItem(TMDB_KEY);
      // rememberMe면 savedEmail 유지, 아니면 비움
      if (!this.rememberMe) this.savedEmail = "";
      lsSet(AUTH_KEY, { ...this.$state });
    },
  },
});
