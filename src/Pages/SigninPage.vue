<script setup lang="ts">
    import { ref } from "vue";
    const mode = ref<"login"|"register">("login");
    </script>
    
    <template>
      <div class="wrap">
        <div class="container grid">
          <section class="left card">
            <div class="hero">
              <span class="badge">TMDB 기반 Movie App</span>
              <h1>깔끔하게, 빠르게<br/>영화를 찾고 담아보세요.</h1>
              <p>버건디 포인트의 정돈된 UI로 누구나 쉽게 사용할 수 있게 설계했어요.</p>
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
                <!-- 여기부터 폼 -->
                <div class="field">
                  <label>이메일</label>
                  <input placeholder="name@example.com" />
                </div>
                <div class="field">
                  <label>비밀번호 (TMDB API Key)</label>
                  <input placeholder="••••••••" />
                </div>
    
                <div v-if="mode==='login'" class="row">
                  <label class="chk"><input type="checkbox" /> remember me</label>
                </div>
    
                <div v-else class="row">
                  <label class="chk"><input type="checkbox" /> 약관에 동의합니다</label>
                </div>
    
                <button class="btn primary full">
                  {{ mode==='login' ? '로그인' : '회원가입' }}
                </button>
    
                <p class="hint">
                  {{"※ 성공/실패 메시지는 toast로 표시하면 UI가 깔끔해요."}}
                </p>
              </div>
            </Transition>
          </section>
        </div>
      </div>
    </template>
    
    <style scoped>
    .wrap{ padding: 28px 0 40px; }
    .grid{ display:grid; gap:18px; grid-template-columns: 1.05fr .95fr; align-items: stretch; }
    .left{
      background: linear-gradient(135deg, var(--primary-soft), #fff);
      padding: 22px;
    }
    .hero h1{ margin: 14px 0 8px; font-size: 34px; line-height: 1.15; }
    .hero p{ margin:0; color: var(--muted); max-width: 46ch; }
    
    .right{ padding: 18px; }
    .top{ display:flex; gap:10px; margin-bottom: 12px; }
    .panel h2{ margin: 8px 0 14px; }
    .field{ display:flex; flex-direction:column; gap:6px; margin-bottom: 12px; }
    .field label{ font-size: 12px; color: var(--muted); }
    .field input{
      padding: 12px 12px; border-radius: 12px;
      border: 1px solid var(--line); background: #fff;
    }
    .row{ display:flex; justify-content: space-between; margin: 8px 0 14px; }
    .chk{ font-size: 13px; color: var(--muted); display:flex; gap:8px; align-items:center; }
    .full{ width: 100%; justify-content:center; }
    .hint{ margin: 12px 0 0; color: var(--muted); font-size: 12px; }
    
    .flip-enter-active, .flip-leave-active{ transition: transform .22s ease, opacity .22s ease; }
    .flip-enter-from{ opacity: 0; transform: translateY(8px) rotateX(8deg); }
    .flip-leave-to{ opacity: 0; transform: translateY(-6px) rotateX(-6deg); }
    
    @media (max-width: 980px){
      .grid{ grid-template-columns: 1fr; }
      .hero h1{ font-size: 28px; }
    }
    </style>
    