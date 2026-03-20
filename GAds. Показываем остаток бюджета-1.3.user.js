// ==UserScript==
// @name         GAds. Показываем остаток бюджета
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Показывает остаток средств в блоке "Бюджеты аккаунта" на странице биллинга Google Ads
// @author       ИП Ульянов (Станислав)
// @match        https://ads.google.com/*
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BE%D0%BA%20%D0%B1%D1%8E%D0%B4%D0%B6%D0%B5%D1%82%D0%B0.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BE%D0%BA%20%D0%B1%D1%8E%D0%B4%D0%B6%D0%B5%D1%82%D0%B0.user.js
// @icon         https://img.icons8.com/color/48/google-ads.png
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
'use strict';

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================
const CONFIG = {
  INSERTED_ID: 'tm-budget-remaining',
  DEBOUNCE_DELAY: 200,
  COLORS: {
    POSITIVE: '#1e8e3e',
    NEGATIVE: '#d93025',
    LABEL: 'var(--acx-sys-color--on-surface, #3c4043)',
  },
  SELECTORS: {
    AMOUNT_SPENT: '.amount-spent-value',
    CURRENT_LIMIT: '.current-budget-spending-limit',
    BONUS_POSITIVE: '.adjustment-value.positive-adjustment-value',
    BONUS_NEGATIVE: '.adjustment-value.negative-adjustment-value',
  },
  LABELS: {
    REMAINING: 'Остаток',
    LOADING: 'Загрузка...',
    ERROR: 'Недоступно',
  },
};

// ============================================================================
// СТИЛИ
// ============================================================================
GM_addStyle(`
  #${CONFIG.INSERTED_ID} {
    display: inline-flex !important;
    flex-direction: column !important;
    margin-left: 16px !important;
  }
  #${CONFIG.INSERTED_ID} .tm-label {
    font-family: Roboto, Arial, sans-serif !important;
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
    letter-spacing: 0.0142857143em !important;
    font-weight: 400 !important;
    color: ${CONFIG.COLORS.LABEL} !important;
    display: block !important;
  }
  #${CONFIG.INSERTED_ID} .tm-value {
    font-family: "Google Sans", Roboto, Arial, sans-serif !important;
    font-size: 2rem !important;
    line-height: 2.5rem !important;
    letter-spacing: 0 !important;
    font-weight: 400 !important;
    display: block !important;
    transition: color 0.2s ease !important;
  }
  #${CONFIG.INSERTED_ID} .tm-value.positive {
    color: ${CONFIG.COLORS.POSITIVE} !important;
  }
  #${CONFIG.INSERTED_ID} .tm-value.negative {
    color: ${CONFIG.COLORS.NEGATIVE} !important;
  }
  #${CONFIG.INSERTED_ID} .tm-tooltip {
    position: relative !important;
    cursor: help !important;
  }
  #${CONFIG.INSERTED_ID} .tm-tooltip::after {
    content: attr(data-tooltip) !important;
    position: absolute !important;
    bottom: 100% !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #3c4043 !important;
    color: #fff !important;
    padding: 8px 12px !important;
    border-radius: 4px !important;
    font-size: 0.75rem !important;
    font-family: Roboto, Arial, sans-serif !important;
    white-space: nowrap !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transition: opacity 0.2s, visibility 0.2s !important;
    z-index: 1000 !important;
  }
  #${CONFIG.INSERTED_ID} .tm-tooltip:hover::after {
    opacity: 1 !important;
    visibility: visible !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 28px !important;
    height: 28px !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 50% !important;
    background: transparent !important;
    cursor: pointer !important;
    opacity: 0.5 !important;
    transition: opacity 0.2s, background-color 0.2s, transform 0.1s !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn:hover {
    opacity: 0.9 !important;
    background-color: rgba(0, 0, 0, 0.08) !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn:active {
    transform: scale(0.95) !important;
    background-color: rgba(0, 0, 0, 0.12) !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn svg {
    width: 18px !important;
    height: 18px !important;
    fill: ${CONFIG.COLORS.LABEL} !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn.copied {
    opacity: 1 !important;
  }
  #${CONFIG.INSERTED_ID} .tm-copy-btn.copied svg {
    fill: ${CONFIG.COLORS.POSITIVE} !important;
  }
  #${CONFIG.INSERTED_ID} .tm-value-container {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
`);

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/**
 * Проверка, что мы на целевой странице
 */
function isTargetPage() {
  const url = window.location.href;
  const hasCorrectURL = url.includes('billing') && url.includes('summary');
  if (!hasCorrectURL) return false;

  const bodyText = document.body?.innerText || '';
  return bodyText.includes('Название бюджета') && bodyText.includes('Сумма затрат');
}

/**
 * Парсинг суммы из текста
 * Поддерживает различные форматы: $1,234.56, 1 234,56 $, +300,00 $ и т.д.
 */
function parseAmount(text) {
  if (!text) return { value: NaN, currency: '$' };

  const cleanText = text
    .replace(/\u00a0/g, ' ')
    .trim();

  // Определяем валюту
  const currencyMatch = cleanText.match(/[$€₽₸£¥]/g);
  const currency = currencyMatch && currencyMatch.length > 0 ? currencyMatch[0] : '$';

  // Удаляем все символы кроме цифр, запятых, точек и минусов
  const numericPart = cleanText
    .replace(/[$€₽₸£¥+\s]/g, '')
    .replace(',', '.');

  const value = parseFloat(numericPart);
  return { value, currency };
}

/**
 * Форматирование суммы
 */
function formatAmount(value, currency = '$') {
  if (isNaN(value)) return CONFIG.LABELS.ERROR;
  return value.toFixed(2).replace('.', ',') + '\u00a0' + currency;
}

/**
 * Получение бонуса (положительного или отрицательного)
 */
function getBonusAmount() {
  // Проверяем положительный бонус
  const positiveBonusEl = document.querySelector(CONFIG.SELECTORS.BONUS_POSITIVE);
  if (positiveBonusEl) {
    const { value } = parseAmount(positiveBonusEl.textContent);
    return isNaN(value) ? 0 : value;
  }

  // Проверяем отрицательный бонус (корректировку)
  const negativeBonusEl = document.querySelector(CONFIG.SELECTORS.BONUS_NEGATIVE);
  if (negativeBonusEl) {
    const { value } = parseAmount(negativeBonusEl.textContent);
    return isNaN(value) ? 0 : -value;
  }

  return 0;
}

/**
 * Определение валюты со страницы
 */
function detectCurrency() {
  const spentEl = document.querySelector(CONFIG.SELECTORS.AMOUNT_SPENT);
  if (spentEl) {
    const { currency } = parseAmount(spentEl.textContent);
    return currency;
  }
  return '$';
}

/**
 * SVG иконка копирования
 */
const COPY_ICON_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
`;

/**
 * SVG иконка подтверждения копирования
 */
const CHECK_ICON_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
`;

/**
 * Копирование значения в буфер обмена
 */
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    button.innerHTML = CHECK_ICON_SVG;
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = COPY_ICON_SVG;
    }, 2000);
  } catch (err) {
    console.error('[GAds Budget] Ошибка копирования:', err);
  }
}

// ============================================================================
// ОСНОВНАЯ ЛОГИКА
// ============================================================================

let debounceTimer = null;

/**
 * Создание или обновление элемента с остатком
 */
function injectRemaining() {
  if (!isTargetPage()) return;

  const spentEl = document.querySelector(CONFIG.SELECTORS.AMOUNT_SPENT);
  const limitEl = document.querySelector(CONFIG.SELECTORS.CURRENT_LIMIT);

  // Если элементы не найдены — показываем индикатор загрузки
  if (!spentEl || !limitEl) {
    showLoading();
    return;
  }

  const spentData = parseAmount(spentEl.textContent);
  const limitData = parseAmount(limitEl.textContent);

  if (isNaN(spentData.value) || isNaN(limitData.value)) {
    showError();
    return;
  }

  const currency = spentData.currency || limitData.currency || detectCurrency();
  const bonus = getBonusAmount();
  const remaining = limitData.value - spentData.value + bonus;
  const formatted = formatAmount(remaining, currency);
  const isPositive = remaining > 0;

  renderRemaining(formatted, isPositive, currency);
}

/**
 * Показ индикатора загрузки
 */
function showLoading() {
  let wrapper = document.getElementById(CONFIG.INSERTED_ID);
  if (!wrapper) {
    wrapper = createWrapper();
    const parentSpan = document.querySelector(CONFIG.SELECTORS.AMOUNT_SPENT)?.parentElement;
    if (parentSpan) {
      parentSpan.insertAdjacentElement('afterend', wrapper);
    }
  }

  const value = wrapper.querySelector('.tm-value');
  if (value) {
    value.textContent = CONFIG.LABELS.LOADING;
    value.className = 'tm-value';
  }
}

/**
 * Показ ошибки
 */
function showError() {
  let wrapper = document.getElementById(CONFIG.INSERTED_ID);
  if (!wrapper) {
    wrapper = createWrapper();
    const parentSpan = document.querySelector(CONFIG.SELECTORS.AMOUNT_SPENT)?.parentElement;
    if (parentSpan) {
      parentSpan.insertAdjacentElement('afterend', wrapper);
    }
  }

  const value = wrapper.querySelector('.tm-value');
  if (value) {
    value.textContent = CONFIG.LABELS.ERROR;
    value.className = 'tm-value negative';
  }
}

/**
 * Создание обёртки элемента
 */
function createWrapper() {
  const wrapper = document.createElement('span');
  wrapper.id = CONFIG.INSERTED_ID;

  const label = document.createElement('span');
  label.className = 'tm-label';
  label.textContent = CONFIG.LABELS.REMAINING;

  const valueContainer = document.createElement('span');
  valueContainer.className = 'tm-value-container';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'tm-copy-btn';
  copyBtn.innerHTML = COPY_ICON_SVG;
  copyBtn.type = 'button';
  copyBtn.title = 'Копировать значение';

  const value = document.createElement('span');
  value.className = 'tm-value tm-tooltip';
  value.dataset.role = 'remaining-value';
  value.dataset.tooltip = 'Лимит − Затраты + Бонус';

  copyBtn.addEventListener('click', function () {
    const currentValue = value.textContent;
    if (currentValue && currentValue !== CONFIG.LABELS.LOADING && currentValue !== CONFIG.LABELS.ERROR) {
      copyToClipboard(currentValue.replace(/\u00a0/g, ' '), copyBtn);
    }
  });

  valueContainer.appendChild(copyBtn);
  valueContainer.appendChild(value);
  wrapper.appendChild(label);
  wrapper.appendChild(valueContainer);

  return wrapper;
}

/**
 * Отрисовка остатка
 */
function renderRemaining(formatted, isPositive, currency) {
  let wrapper = document.getElementById(CONFIG.INSERTED_ID);

  if (!wrapper) {
    wrapper = createWrapper();
    const parentSpan = document.querySelector(CONFIG.SELECTORS.AMOUNT_SPENT)?.parentElement;
    if (parentSpan) {
      parentSpan.insertAdjacentElement('afterend', wrapper);
    } else {
      console.warn('[GAds Budget] Не найден родительский элемент для вставки');
      return;
    }
  }

  const value = wrapper.querySelector('[data-role="remaining-value"]');
  if (value) {
    value.textContent = formatted;
    value.className = `tm-value tm-tooltip ${isPositive ? 'positive' : 'negative'}`;
    value.dataset.tooltip = `Лимит − Затраты + Бонус (${currency})`;
  }
}

/**
 * Debounce-версия injectRemaining
 */
function debouncedInject() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    injectRemaining();
    debounceTimer = null;
  }, CONFIG.DEBOUNCE_DELAY);
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================

// Наблюдение за изменениями DOM
const observer = new MutationObserver(debouncedInject);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});

// Обработчики событий
window.addEventListener('load', injectRemaining);
window.addEventListener('hashchange', debouncedInject);
window.addEventListener('popstate', debouncedInject);

// Первичный запуск
injectRemaining();

// Логирование версии
console.log('[GAds Budget] Скрипт загружен, версия 1.9');

})();
