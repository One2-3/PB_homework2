<template>
    <div class="spinWrap" role="status" aria-live="polite">
      <div class="spin" />
      <span class="txt">Loading…</span>
    </div>
  </template>
  
  <style scoped>
  .spinWrap{display:flex;align-items:center;gap:10px;color:var(--muted);padding:12px 0}
  .spin{width:18px;height:18px;border-radius:50%;border:2px solid rgba(122,31,61,.25);border-top-color:var(--primary);
    animation:rot .8s linear infinite}
  @keyframes rot{to{transform:rotate(360deg)}}
  .txt{font-size:13px}
  </style>
  