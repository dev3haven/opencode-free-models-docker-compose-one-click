// ==UserScript==
// @name         Qwen Chat: скопировать токен пользователя
// @namespace    qwen2api.token.copy
// @version      1.0.0
// @description  Плавающая кнопка в углу chat.qwen.ai — копирует JWT-токен текущего пользователя (для подстановки в x-qwen-accounts в compose.yaml).
// @match        https://chat.qwen.ai/*
// @match        https://chat.qwenlm.ai/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
(function () {
  'use strict';

  // chat.qwen.ai хранит JWT залогиненного пользователя в localStorage под ключом "token"
  function getToken() {
    try {
      const t = localStorage.getItem('token');
      if (t && t.trim()) return t.trim();
    } catch (e) { /* localStorage недоступен */ }
    try {
      const m = document.cookie.match(/(?:^|;\s*)token=([^;]+)/); // запасной вариант: cookie
      if (m) return decodeURIComponent(m[1]);
    } catch (e) { /* нет доступа к cookie */ }
    return null;
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '📋 Скопировать токен Qwen';
  Object.assign(btn.style, {
    position: 'fixed', top: '14px', right: '14px', zIndex: '2147483647',
    padding: '9px 14px', borderRadius: '10px',
    border: '1px solid #4f46e5', background: '#4f46e5', color: '#fff',
    font: '600 13px/1.2 system-ui, -apple-system, sans-serif',
    cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.3)'
  });

  function flash(text, ok) {
    btn.textContent = text;
    btn.style.background = btn.style.borderColor = ok ? '#16a34a' : '#dc2626';
    setTimeout(() => {
      btn.textContent = '📋 Скопировать токен Qwen';
      btn.style.background = btn.style.borderColor = '#4f46e5';
    }, 1600);
  }

  btn.addEventListener('click', async () => {
    const token = getToken();
    if (!token) return flash('Токен не найден (вы не залогинены?)', false);
    try {
      await navigator.clipboard.writeText(token);
      flash('Токен скопирован ✓ (' + token.length + ' симв.)', true);
    } catch (e) {
      // запасной путь для контекстов без clipboard API
      const ta = document.createElement('textarea');
      ta.value = token;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (ok) flash('Токен скопирован ✓ (' + token.length + ' симв.)', true);
      else flash('Не удалось скопировать', false);
    }
  });

  (document.body || document.documentElement).appendChild(btn);
})();
