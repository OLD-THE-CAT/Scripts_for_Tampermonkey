// ==UserScript==
// @name         GAds. Показываем остаток бюджета
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Показывает остаток средств в блоке "Бюджеты аккаунта" на странице биллинга Google Ads
// @author       ИП Ульянов (Станислав)
// @match        https://ads.google.com/*
// @include      https://ads.google.com/*
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BE%D0%BA%20%D0%B1%D1%8E%D0%B4%D0%B6%D0%B5%D1%82%D0%B0-1.3.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BE%D0%BA%20%D0%B1%D1%8E%D0%B4%D0%B6%D0%B5%D1%82%D0%B0-1.3.user.js
// @icon         https://img.icons8.com/color/48/google-ads.png
// @grant        none
// ==/UserScript==

(function () {
'use strict';

const INSERTED_ID = 'tm-budget-remaining';

function isTargetPage() {
  const url = window.location.href;
  const hasCorrectURL = url.includes('billing') && url.includes('summary');
  const bodyText = document.body.innerText || '';
  return hasCorrectURL && bodyText.includes('Название бюджета') && bodyText.includes('Сумма затрат');
}

function parseAmount(text) {
  return parseFloat(
    (text || '')
      .replace(/\u00a0/g, '')
      .replace(/\s/g, '')
      .replace(/\+/g, '')
      .replace('$', '')
      .replace(',', '.')
  );
}

function formatAmount(value) {
  return value.toFixed(2).replace('.', ',') + '\u00a0$';
}

function getBonusAmount() {
  const bonusEl = document.querySelector('.adjustment-value.positive-adjustment-value');
  if (!bonusEl) return 0;
  const bonus = parseAmount(bonusEl.textContent);
  return isNaN(bonus) ? 0 : bonus;
}

function injectRemaining() {
  if (!isTargetPage()) return;

  const spentEl = document.querySelector('.amount-spent-value');
  const limitEl = document.querySelector('.current-budget-spending-limit');
  if (!spentEl || !limitEl) return;

  const spent = parseAmount(spentEl.textContent);
  const limit = parseAmount(limitEl.textContent);
  if (isNaN(spent) || isNaN(limit)) return;

  const bonus = getBonusAmount();
  const remaining = limit - spent + bonus;
  const formatted = formatAmount(remaining);
  const valueColor = remaining > 0 ? '#1e8e3e' : '#d93025';

  let wrapper = document.getElementById(INSERTED_ID);
  if (!wrapper) {
    wrapper = document.createElement('span');
    wrapper.id = INSERTED_ID;
    wrapper.style.cssText = 'display:inline-flex; flex-direction:column; margin-left:16px;';

    const label = document.createElement('span');
    label.textContent = 'Остаток';
    label.style.cssText = [
      'font-family: Roboto, Arial, sans-serif',
      'font-size: 0.875rem',
      'line-height: 1.25rem',
      'letter-spacing: 0.0142857143em',
      'font-weight: 400',
      'color: var(--acx-sys-color--on-surface, #3c4043)',
      'display: block',
    ].join(';');

    const value = document.createElement('span');
    value.dataset.role = 'remaining-value';
    value.style.cssText = [
      'font-family: "Google Sans", Roboto, Arial, sans-serif',
      'font-size: 2rem',
      'line-height: 2.5rem',
      'letter-spacing: 0',
      'font-weight: 400',
      `color: ${valueColor}`,
      'display: block',
    ].join(';');

    wrapper.appendChild(label);
    wrapper.appendChild(value);

    const parentSpan = spentEl.parentElement;
    parentSpan.insertAdjacentElement('afterend', wrapper);
  }

  const value = wrapper.querySelector('[data-role="remaining-value"]');
  if (value) {
    value.textContent = formatted;
    value.style.color = valueColor;
  }
}

let scheduled = false;
function scheduleInject() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    injectRemaining();
  }, 150);
}

const observer = new MutationObserver(scheduleInject);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener('load', injectRemaining);
window.addEventListener('hashchange', scheduleInject);
injectRemaining();

})();
