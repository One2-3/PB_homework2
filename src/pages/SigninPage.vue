<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useToast } from "vue-toastification";
    import { useAuthStore } from "@/stores/auth";
    
    const router = useRouter();
    const toast = useToast();
    const auth = useAuthStore();
    
    const mode = ref<"login" | "register">("login");
    
    const email = ref(auth.savedEmail || "");
    const password = ref("");
    const password2 = ref("");
    const rememberMe = ref(true);
    const agree = ref(false);
    
    async function onLogin() {
      try {
        auth.signin(email.value, password.value, rememberMe.value);
        toast.success("로그인 성공");
        router.push("/");
      } catch (e: any) {
        toast.error(e?.message || "로그인 실패");
      }
    }
    
    async function onRegister() {
      try {
        auth.signup(email.value, password.value, password2.value, agree.value);
        toast.success("회원가입 완료. 로그인 해주세요.");
        mode.value = "login";
        password.value = "";
        password2.value = "";
        agree.value = false;
      } catch (e: any) {
        toast.error(e?.message || "회원가입 실패");
      }
    }
    </script>
    
    <template>
      <div class="wrap">
        <section class="card auth glow">
          <div class="brand">
            <span class="dot" aria-hidden="true" />
            <span class="name">BurgundyFlix</span>
          </div>
    
          <h1 class="title">{{ mode === "login" ? "로그인" : "회원가입" }}</h1>
    
          <div class="field">
            <label>이메일</label>
            <input v-model="email" placeholder="Email address" autocomplete="email" />
          </div>
    
          <div class="field">
            <label>비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              @keydown.enter="mode==='login' ? onLogin() : onRegister()"
            />
          </div>
    
          <div v-if="mode==='register'" class="field">
            <label>비밀번호 확인</label>
            <input
              v-model="password2"
              type="password"
              placeholder="Confirm password"
              autocomplete="new-password"
              @keydown.enter="onRegister"
            />
          </div>
    
          <div class="row" v-if="mode==='login'">
            <label class="chk">
              <input v-model="rememberMe" type="checkbox" />
              로그인 상태 유지
            </label>
          </div>
    
          <div class="row" v-else>
            <label class="chk">
              <input v-model="agree" type="checkbox" />
              약관에 동의합니다
            </label>
          </div>
    
          <button class="btn primary full" v-if="mode==='login'" @click="onLogin">Continue</button>
          <button class="btn primary full" v-else @click="onRegister">Create account</button>
    
          <div class="switch">
            <template v-if="mode==='login'">
              <span>계정이 없나요?</span>
              <button class="link" @click="mode='register'">회원가입</button>
            </template>
            <template v-else>
              <span>이미 계정이 있나요?</span>
              <button class="link" @click="mode='login'">로그인</button>
            </template>
          </div>
        </section>
      </div>
    </template>
    
    <style scoped>
/* ===== SigninPage.vue <style scoped> 전체 교체용 ===== */

.layout{ display:grid; gap:14px; grid-template-columns: 320px 1fr; align-items:start; }
.filters{ padding: 14px; position: sticky; top: 78px; }

.head{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.headBtns{ display:flex; gap:8px; align-items:center; }

h2{ margin:0 0 10px; font-size:18px; }

.field{ display:flex; flex-direction:column; gap:6px; margin:10px 0; }
label{ font-size:12px; color:var(--muted); font-weight:700; }

/* ✅ 다크/라이트 대응: #fff 하드코딩 제거 */
input,select{
  padding:12px;
  border-radius:12px;
  border:1px solid var(--line);
  background: var(--inputBg);
  color: var(--text);
}
input::placeholder{
  color: var(--muted);
  opacity: 1;
}

.results{ min-width:0; }
.topline{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }

.grid{ display:grid; gap:12px; grid-template-columns: repeat(5, 1fr); }
.empty{ padding:18px; }
.empty h3{ margin:0 0 6px; }
.empty p{ margin:0; color:var(--muted); }

.pager{ display:flex; justify-content:flex-end; gap:10px; margin-top:12px; }

.recent{ margin-top:14px; }
.rt{ font-size:12px; color:var(--muted); margin-bottom:8px; }
.chips{ display:flex; gap:8px; flex-wrap:wrap; }

/* ✅ chip도 다크 대응 */
.chip{
  border:1px solid var(--line);
  background: var(--inputBg);
  color: var(--text);
  border-radius:999px;
  padding:8px 10px;
  cursor:pointer;
  font-size:12px;
}
.chip:hover{ border-color: rgba(122,31,61,.35); }

@media (max-width: 980px){
  .layout{ grid-template-columns: 1fr; }
  .filters{ position: static; }
  .grid{ grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 981px) and (max-width: 1200px){
  .grid{ grid-template-columns: repeat(4, 1fr); }
}


    </style>

    