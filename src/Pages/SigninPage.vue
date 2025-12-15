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
    .wrap{
      min-height: 100vh;
      width: 100%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding: 24px 16px;
      background: radial-gradient(1200px 600px at 20% 10%, rgba(122,31,61,.10), transparent 60%),
                  radial-gradient(900px 500px at 90% 40%, rgba(122,31,61,.08), transparent 55%),
                  var(--bg);
    }
    .auth{
      width: 420px;
      padding: 22px;
      border-radius: 18px;
    }
    .brand{
      display:flex; align-items:center; gap:10px;
      font-weight:800;
      margin-bottom: 10px;
    }
    .dot{ width:10px; height:10px; border-radius:50%; background: var(--primary); }
    .name{ letter-spacing: .2px; }
    .title{ margin: 10px 0 14px; font-size: 24px; }
    
    .field{ display:flex; flex-direction:column; gap:6px; margin-bottom: 12px; }
    label{ font-size:12px; color:var(--muted); }
    input{
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--line);
      background:#fff;
    }
    
    .row{ display:flex; justify-content:flex-start; margin: 6px 0 14px; }
    .chk{ font-size: 13px; color: var(--muted); display:flex; gap:8px; align-items:center; }
    
    .full{ width:100%; justify-content:center; padding: 12px 14px; }
    
    .switch{
      margin-top: 14px;
      display:flex;
      justify-content:center;
      gap:8px;
      color: var(--muted);
      font-size: 12px;
    }
    .link{
      border: none;
      background: transparent;
      color: var(--primary);
      cursor: pointer;
      padding: 0;
    }
    .link:hover{ text-decoration: underline; }
    
    /* ✅ Glow wrapper */
    .glow{
    position: relative;
    overflow: visible; /* 카드 밖으로 퍼지는 빛 */
    }

    /* 애니메이션 불빛 레이어(바깥) */
    .glow::before{
    content:"";
    position:absolute;
    inset:-18px;                 /* 바깥쪽으로만 퍼지게 */
    border-radius: 28px;
    background: radial-gradient(closest-side, rgba(122,31,61,.18), transparent 70%);
    filter: blur(18px);
    opacity: .55;
    z-index: 0;
    pointer-events:none;
    }


    /* 테두리 느낌(얇게 한 겹 더) */
    .glow::after{
    content:"";
    position:absolute;
    inset:-3px;                 /* 테두리 영역 */
    border-radius: 20px;
    padding: 2px;               /* 링 두께 */
    background: conic-gradient(
        from var(--a),
        rgba(122,31,61,0),
        rgba(122,31,61,.95),
        rgba(255,255,255,0),
        rgba(122,31,61,.95),
        rgba(122,31,61,0)
    );
    opacity: .9;
    z-index: 0;
    pointer-events:none;
    animation: glowSpin 3.2s linear infinite;

    /* 가운데를 뚫어서 "테두리만" 보이게 */
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    /* 링 자체가 살짝 빛나게 */
    filter: drop-shadow(0 0 10px rgba(122,31,61,.25));
    }


    /* 카드 내용은 glow 레이어 위로 */
    .glow > *{
    position: relative;
    z-index: 1;
    }

    /* 입력 포커스 시 더 살아나게 */
    .glow:focus-within::before{ opacity: .75; filter: blur(18px); }
    .glow:focus-within::after{ opacity: .85; }

    /* 애니메이션용 커스텀 속성 */
    @property --a{
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
    }
    @keyframes glowSpin{
    to{ --a: 360deg; }
    }

    /* 접근성: 모션 줄이기 설정이면 애니메이션 끔 */
    @media (prefers-reduced-motion: reduce){
    .glow::before, .glow::after{ animation: none; }
    }

    </style>
    