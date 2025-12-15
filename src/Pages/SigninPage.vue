<script setup lang="ts">
    import { ref } from "vue";
    import { useAuthStore } from "@/stores/auth";
    import { useRouter } from "vue-router";
    import { useToast } from "vue-toastification";
    
    const auth = useAuthStore();
    const router = useRouter();
    const toast = useToast();
    
    const mode = ref<"login"|"register">("login");
    
    const email = ref(auth.savedEmail || "");
    const password = ref("");      // TMDB API Key
    const rememberMe = ref(true);
    const agree = ref(false);
    
    async function onLogin() {
      try {
        auth.signin(email.value, password.value, rememberMe.value);
        toast.success("로그인 성공!");
        router.push("/");
      } catch (e: any) {
        toast.error(e?.message || "로그인 실패");
      }
    }
    
    async function onRegister() {
      try {
        auth.signup(email.value, password.value, agree.value);
        toast.success("회원가입 성공! 로그인 해주세요.");
        mode.value = "login";
        agree.value = false;
      } catch (e: any) {
        toast.error(e?.message || "회원가입 실패");
      }
    }
    </script>
    
    <template>
      <div class="wrap">
        <div class="container grid">
          <section class="left card">
            <div class="hero">
              <span class="badge">Light UI + Burgundy</span>
              <h1>쉽게 찾고,<br/>편하게 저장하는 영화 탐색</h1>
              <p>TMDB API 기반. 포스터 중심의 정돈된 레이아웃으로 누구나 쓰기 편하게.</p>
              <ul>
                <li>Home: 4개 섹션</li>
                <li>Popular: Table / Infinite</li>
                <li>Search: 필터 + Reset</li>
                <li>Wishlist: LocalStorage only</li>
              </ul>
            </div>
          </section>
    
          <section class="right card">
            <div class="top">
              <button class="btn" :class="{primary: mode==='login'}" @click="mode='login'">로그인</button>
              <button class="btn" :class="{primary: mode==='register'}" @click="mode='register'">회원가입</button>
            </div>
    
            <Transition name="flip" mode="out-in">
              <div :key="mode" class="panel">
                <h2>{{ mode==='login' ? 'Welcome back' : 'Create account' }}</h2>
    
                <div class="field">
                  <label>이메일</label>
                  <input v-model="email" placeholder="name@example.com" />
                </div>
    
                <div class="field">
                  <label>비밀번호 (TMDB API Key)</label>
                  <input v-model="password" type="password" placeholder="TMDB API Key 입력" />
                </div>
    
                <div v-if="mode==='login'" class="row">
                  <label class="chk"><input v-model="rememberMe" type="checkbox" /> remember me</label>
                </div>
    
                <div v-else class="row">
                  <label class="chk"><input v-model="agree" type="checkbox" /> 약관에 동의합니다</label>
                </div>
    
                <button v-if="mode==='login'" class="btn primary full" @click="onLogin">로그인</button>
                <button v-else class="btn primary full" @click="onRegister">회원가입</button>
    
                <p class="hint">※ 로그인 성공 후 TMDB 호출이 가능해요.</p>
              </div>
            </Transition>
          </section>
        </div>
      </div>
    </template>
    
    <style scoped>
    .wrap{ padding: 28px 0 40px; }
    .grid{ display:grid; gap:18px; grid-template-columns: 1.05fr .95fr; align-items: stretch; }
    .left{ background: linear-gradient(135deg, var(--primarySoft), #fff); padding: 22px; }
    .hero h1{ margin: 14px 0 8px; font-size: 34px; line-height: 1.15; }
    .hero p{ margin:0 0 14px; color: var(--muted); max-width: 48ch; }
    .hero ul{ margin: 10px 0 0; padding-left: 18px; color: rgba(27,20,23,.75); }
    
    .right{ padding: 18px; }
    .top{ display:flex; gap:10px; margin-bottom: 12px; flex-wrap:wrap; }
    .panel h2{ margin: 8px 0 14px; }
    .field{ display:flex; flex-direction:column; gap:6px; margin-bottom: 12px; }
    .field label{ font-size: 12px; color: var(--muted); }
    .field input{
      padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: #fff;
    }
    .row{ display:flex; justify-content: space-between; margin: 8px 0 14px; }
    .chk{ font-size: 13px; color: var(--muted); display:flex; gap:8px; align-items:center; }
    .full{ width: 100%; justify-content:center; }
    .hint{ margin: 12px 0 0; color: var(--muted); font-size: 12px; }
    
    .flip-enter-active,.flip-leave-active{ transition: transform .22s ease, opacity .22s ease; }
    .flip-enter-from{ opacity:0; transform: translateY(8px) rotateX(8deg); }
    .flip-leave-to{ opacity:0; transform: translateY(-6px) rotateX(-6deg); }
    
    @media (max-width: 980px){
      .grid{ grid-template-columns: 1fr; }
      .hero h1{ font-size: 28px; }
    }
    </style>
    