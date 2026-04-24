// ==UserScript==
// @name         YDirect. Чистка поисковых запросов
// @namespace    https://github.com/
// @version      1.4.0
// @description  Добавляет панель для сбора минус-слов из поисковых запросов Яндекс.Директ
// @author       ИП Ульянов (Станислав)
// @match        https://direct.yandex.ru/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YDirect.%20%D0%A7%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D1%8B%D1%85%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YDirect.%20%D0%A7%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D1%8B%D1%85%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2.user.js
// @icon         data:image/png;base64,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
// ==/UserScript==

(function () {
  'use strict';

  let negativeWords = []; // массив объектов { word, matchTypes, customText? }
  let clickHandlerAttached = false;
  let attachDebounceTimer = null;
  let panelVisible = false;
  let panelEl = null;
  let activeMatchDropdown = null;
  let matchDropdownTimer = null;
  let activeEditPopover = null;
  let panelCollapsed = false;
  let collapseBtn = null;
  let collapsedButtonActivationLocked = false;
  let panelAnimationSeq = 0;
  let activeActionTooltip = null;
  let activeReportInterface = null;

  const REPORT_INTERFACES = [
    {
      id: 'new',
      pathRe: /\/dna\/reports\//,
      headerSelector: [
        '[data-testid="Header.SearchQuery_SearchQuery"]',
        '[data-testid="Grid.HeaderCell-SearchQuery_SearchQuery"]'
      ].join(', '),
      queryTextSelector: [
        '[data-testid="Cell.SearchQuery_SearchQuery"] span[data-testid="Text"]',
        '[data-testid="Cell.SearchQuery_SearchQuery"] [data-testid="Text.Content"]'
      ].join(', ')
    },
    // LEGACY OLD REPORTS: remove this profile when Yandex retires the old reports UI.
    {
      id: 'legacy',
      pathRe: /\/registered\/main\.pl(?:$|[/?#])/,
      headerSelector: '.b-stat-table__head-col',
      headerText: 'Поисковый запрос',
      pageText: 'Поисковый запрос',
      queryTextSelector: '.b-stat-table__row-col_content-type_search-query',
      queryTextInnerSelector: '.b-mol-stat-data__search-query-wrap',
      checkboxSelector: '.checkbox__box, .checkbox__control, .checkbox__tick'
    }
  ];
  const USER_BAR_SELECTOR = '.dc-UserBar__topSection';
  const USER_BAR_LAST_BUTTON_SELECTOR = 'button[data-testid="RecommendationStories.IconTrigger"]';

  // ===================== ВЫДЕЛЕНИЕ ДИАПАЗОНА СЛОВ =====================
  let isSelecting = false;
  let selectStartIndex = -1;
  let selectTextField = null;
  let selectStartEl = null;

  // ===================== КАСТОМНЫЕ ТУЛТИПЫ-УВЕДОМЛЕНИЯ =====================
  function closeActionTooltip() {
    if (activeActionTooltip) {
      activeActionTooltip.remove();
      activeActionTooltip = null;
    }
  }

  /**
   * Показывает тултип-уведомление над кнопкой
   * @param {HTMLElement} anchorEl - кнопка, над которой показать
   * @param {string} text - текст
   * @param {Object} options - { confirm: boolean, onConfirm: function }
   */
  function showActionTooltip(anchorEl, text, options = {}) {
    closeActionTooltip();

    const rect = anchorEl.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'ydirect-action-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    tooltip.style.transform = 'translateX(-50%)';

    const textEl = document.createElement('div');
    textEl.className = 'ydirect-action-tooltip-text';
    textEl.textContent = text;
    tooltip.appendChild(textEl);

    if (options.confirm) {
      const btnContainer = document.createElement('div');
      btnContainer.className = 'ydirect-action-tooltip-btns';

      const noBtn = document.createElement('button');
      noBtn.textContent = 'Нет';
      noBtn.addEventListener('click', closeActionTooltip);
      btnContainer.appendChild(noBtn);

      const yesBtn = document.createElement('button');
      yesBtn.textContent = 'Да';
      yesBtn.addEventListener('click', () => {
        closeActionTooltip();
        if (options.onConfirm) options.onConfirm();
      });
      btnContainer.appendChild(yesBtn);
      tooltip.appendChild(btnContainer);
    }

    document.body.appendChild(tooltip);
    activeActionTooltip = tooltip;

    // Запускаем анимацию появления
    requestAnimationFrame(() => {
      tooltip.classList.add('ydirect-action-tooltip-visible');
    });

    // Автозакрытие для информационных тултипов (не confirm)
    if (!options.confirm) {
      setTimeout(closeActionTooltip, 2000);
    }
  }

  // ===================== ТИПЫ СООТВЕТСТВИЯ =====================
  const MATCH_TYPES = ['wordForm', 'wordCount', 'wordOrder'];

  function createWordItem(word) {
    const w = word.toLowerCase();
    // Одиночные слова → без оператора, фразы → фиксируем порядок слов
    const matchTypes = w.includes(' ') ? ['wordOrder'] : [];
    return { word: w, matchTypes: matchTypes, addedAt: Date.now() };
  }

  let currentSort = 'time'; // 'time' | 'alpha'
  let alphaSortAsc = true;

  function getMatchTypes(item) {
    if (!item) return [];

    if (Array.isArray(item.matchTypes)) {
      return item.matchTypes.filter(type => MATCH_TYPES.includes(type));
    }

    switch (item.matchType) {
      case 'phrase': return ['wordCount'];
      case 'exact': return ['wordOrder'];
      case 'broad':
      default: return [];
    }
  }

  function normalizeWordItem(item) {
    if (typeof item === 'string') return createWordItem(item);
    if (!item || typeof item !== 'object') return null;

    const normalized = {
      ...item,
      word: String(item.word || '').trim().toLowerCase(),
      matchTypes: getMatchTypes(item),
      addedAt: item.addedAt || Date.now()
    };

    delete normalized.matchType;
    return normalized.word ? normalized : null;
  }

  function formatMatchItem(item) {
    if (item.customText) return item.customText;

    const w = item.word;
    if (!w) return '';

    const matchTypes = getMatchTypes(item);
    const tokens = w.split(/\s+/).filter(Boolean);
    let text = matchTypes.includes('wordForm')
      ? tokens.map(token => token.startsWith('!') ? token : '!' + token).join(' ')
      : tokens.join(' ');

    if (matchTypes.includes('wordOrder')) {
      text = '[' + text + ']';
    }

    if (matchTypes.includes('wordCount')) {
      text = '"' + text + '"';
    }

    return text;
  }

  function getDisplayWords() {
    return negativeWords.map(formatMatchItem);
  }

  // ===================== ЗАГРУЗКА ДАННЫХ (Tampermonkey хранилище) =====================
  function loadWords() {
    try {
      const stored = GM_getValue('ydirect_words', []);
      // Миграция: string[] и старые objects с matchType приводим к новой модели matchTypes[]
      negativeWords = Array.isArray(stored)
        ? stored.map(normalizeWordItem).filter(Boolean)
        : [];
    } catch (e) {
      negativeWords = [];
    }
  }

  function saveWords() {
    try {
      GM_setValue('ydirect_words', negativeWords);
    } catch (e) {
      /* ignore */
    }
  }

  // ===================== СОСТОЯНИЕ ПАНЕЛИ =====================
  function savePanelCollapsed(isCollapsed) {
    try {
      GM_setValue('ydirect_panel_collapsed', Boolean(isCollapsed));
    } catch (e) { /* ignore */ }
  }

  function loadPanelCollapsed() {
    try {
      return GM_getValue('ydirect_panel_collapsed', false) === true;
    } catch (e) { /* ignore */ }
    return false;
  }

  // ===================== ПОЗИЦИЯ ПАНЕЛИ =====================
  function savePanelPos(x, y) {
    try {
      // Защита: не сохраняем нулевые координаты (явно ошибка отрисовки)
      if (Math.round(x) === 0 && Math.round(y) === 0) {
        return;
      }
      GM_setValue('ydirect_panel_pos', { x: Math.round(x), y: Math.round(y) });
    } catch (e) { /* ignore */ }
  }

  function loadPanelPos() {
    try {
      const val = GM_getValue('ydirect_panel_pos', null);
      // Защита: нулевые координаты — ошибка, игнорируем
      if (val && val.x === 0 && val.y === 0) {
        GM_setValue('ydirect_panel_pos', null);
        return null;
      }
      return val;
    } catch (e) { /* ignore */ }
    return null;
  }

  // ===================== РАЗМЕР ПАНЕЛИ =====================
  function savePanelSize(w, h) {
    try {
      // Защита: не сохраняем минимальные размеры (явно ошибка отрисовки)
      if (Math.round(w) < 220 || Math.round(h) < 160) {
        return;
      }
      GM_setValue('ydirect_panel_size', { w: Math.round(w), h: Math.round(h) });
    } catch (e) { /* ignore */ }
  }

  function loadPanelSize() {
    try {
      const val = GM_getValue('ydirect_panel_size', null);
      // Защита: слишком маленький размер — ошибка, игнорируем
      if (val && (val.w < 220 || val.h < 160)) {
        GM_setValue('ydirect_panel_size', null);
        return null;
      }
      return val;
    } catch (e) { /* ignore */ }
    return null;
  }

  function applyPanelSize() {
    const size = loadPanelSize();
    if (size) {
      panelEl.style.width = size.w + 'px';
      panelEl.style.height = size.h + 'px';
    }
  }

  // ===================== СОЗДАНИЕ ПАНЕЛИ =====================
  function createPanel() {
    // Удаляем старую панель если есть
    if (panelEl) panelEl.remove();
    if (collapseBtn) { collapseBtn.remove(); collapseBtn = null; }

    panelEl = document.createElement('div');
    panelEl.id = 'ydirect-cleanup-panel';

    // Восстанавливаем сохранённую позицию
    const pos = loadPanelPos();
    const size = loadPanelSize();

    if (size) {
      panelEl.style.width = size.w + 'px';
      panelEl.style.height = size.h + 'px';
    }

    if (pos) {
      panelEl.style.left = pos.x + 'px';
      panelEl.style.top = pos.y + 'px';
      panelEl.style.bottom = 'auto';
      panelEl.style.right = 'auto';
    }

    panelEl.innerHTML = `
      <div id="ydirect-cleanup-header">
        <span class="ydirect-header-title">
          <svg class="ydirect-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Минус-слова
        </span>
        <div id="ydirect-header-btns">
          <span id="ydirect-cleanup-count">${negativeWords.length}</span>
          <span id="ydirect-sort-alpha" class="ydirect-sort-btn" data-tooltip="По алфавиту">A-Z</span>
          <span id="ydirect-sort-time" class="ydirect-sort-btn ydirect-sort-active" data-tooltip="По времени добавления">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          </span>
          <span id="ydirect-collapse-btn" class="ydirect-collapse-btn" data-tooltip="Свернуть панель">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
          </span>
        </div>
      </div>
      <div id="ydirect-cleanup-resize"></div>
      <div id="ydirect-cleanup-words-list"></div>
      <div id="ydirect-cleanup-actions">
        <button id="ydirect-copy-btn" data-tooltip="Копировать все минус-слова в буфер обмена">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          <span>Копировать</span>
        </button>
        <button id="ydirect-clear-btn" data-tooltip="Удалить все минус-слова из списка">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          <span>Очистить</span>
        </button>
      </div>
    `;

    document.body.appendChild(panelEl);
    renderWordsList();
    initDrag(panelEl);
    initResize(panelEl);
    attachButtonEvents();
    attachSortEvents();
    attachCollapseEvents();
    panelVisible = true;
    panelCollapsed = false;
  }

  // ===================== Вспомогательная: получить текущую позицию панели =====================
  function getPanelPosition() {
    if (!panelEl) return null;
    // Сначала пробуем сохранённые inline-стили (самые надёжные)
    const styleLeft = panelEl.style.left;
    const styleTop = panelEl.style.top;
    if (styleLeft && styleTop && styleLeft !== 'auto' && styleTop !== 'auto') {
      return { x: parseFloat(styleLeft), y: parseFloat(styleTop) };
    }
    // Иначе берём из getBoundingClientRect
    const rect = panelEl.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  // ===================== Вспомогательная: восстановить позицию панели =====================
  function applyPanelPosition(pos) {
    if (!panelEl || !pos) return;
    panelEl.style.left = pos.x + 'px';
    panelEl.style.top = pos.y + 'px';
    panelEl.style.bottom = 'auto';
    panelEl.style.right = 'auto';
  }

  function showPanel() {
    const panelInDom = panelEl && document.body.contains(panelEl);

    if (panelVisible && !panelCollapsed && panelInDom) {
      const pos = loadPanelPos();
      const size = loadPanelSize();
      if (pos) applyPanelPosition(pos);
      if (size) applyPanelSize();
      return;
    }

    const pos = loadPanelPos();
    const size = loadPanelSize();

    if (!panelEl || !panelInDom) {
      createPanel();
      if (pos) applyPanelPosition(pos);
      if (size) applyPanelSize();
    } else {
      if (pos) applyPanelPosition(pos);
      if (size) applyPanelSize();
      panelEl.style.display = 'flex';
      panelVisible = true;
      panelCollapsed = false;
    }
    removeCollapsedButton();
    // Перезапускаем обработку слов и подсветку при показе панели
    setTimeout(() => {
      attachWordClickHandlers();
      applyHighlightToExisting();
    }, 500);
    setTimeout(() => {
      attachWordClickHandlers();
      applyHighlightToExisting();
    }, 1500);
  }

  function restoreCollapsedPanelState() {
    const panelInDom = panelEl && document.body.contains(panelEl);
    const pos = loadPanelPos();
    const size = loadPanelSize();

    if (!panelEl || !panelInDom) {
      createPanel();
    }

    if (pos) applyPanelPosition(pos);
    if (size) applyPanelSize();

    panelEl.classList.add('ydirect-panel-hidden');
    panelEl.style.display = 'none';
    panelVisible = false;
    panelCollapsed = true;
    showCollapsedButtonInUserBar();
  }

  function hidePanel() {
    if (!panelVisible && !panelCollapsed) {
      return;
    }

    // Сохраняем позицию и размер перед скрытием
    // НО только если панель НЕ скрыта и имеет реальные размеры
    if (panelEl && panelEl.style.display !== 'none') {
      const pos = getPanelPosition();
      const w = panelEl.offsetWidth;
      const h = panelEl.offsetHeight;
      // Не сохраняем нулевые/минимальные значения
      if (pos && pos.x > 0 && pos.y > 0) savePanelPos(pos.x, pos.y);
      if (w > 220 && h > 160) savePanelSize(w, h);
    }

    if (panelEl) {
      panelEl.style.display = 'none';
    }
    removeCollapsedButton();
    panelVisible = false;
    panelCollapsed = false;
  }

  function getActiveReportInterface() {
    return REPORT_INTERFACES.find(reportInterfaceMatches) || null;
  }

  function reportInterfaceMatches(reportInterface) {
    if (window.location.hostname !== 'direct.yandex.ru') return false;
    if (!reportInterface.pathRe.test(window.location.pathname)) return false;
    if (reportInterface.rootSelector && !document.querySelector(reportInterface.rootSelector)) return false;
    if (reportInterface.pageText && !document.body.textContent.includes(reportInterface.pageText)) return false;
    return hasReportSearchQueryColumn(reportInterface);
  }

  function hasReportSearchQueryColumn(reportInterface) {
    if (reportInterface.pageText && document.body.textContent.includes(reportInterface.pageText)) {
      return true;
    }

    const hasQueryTextCell = Boolean(document.querySelector(reportInterface.queryTextSelector));

    if (!reportInterface.headerSelector) {
      return hasQueryTextCell;
    }

    const headerElements = Array.from(document.querySelectorAll(reportInterface.headerSelector));
    const hasHeader = reportInterface.headerText
      ? headerElements.some(el => extractTextFromQueryCell(el).includes(reportInterface.headerText))
      : headerElements.length > 0;

    return hasHeader || hasQueryTextCell;
  }

  function checkPage() {
    const reportInterface = getActiveReportInterface();
    activeReportInterface = reportInterface;

    if (reportInterface) {
      if (loadPanelCollapsed()) {
        restoreCollapsedPanelState();
        return;
      }
      showPanel();
    } else {
      activeReportInterface = null;
      hidePanel();
    }
  }

  // Debounce для checkPage — не вызываем чаще чем раз в 500мс при навигации
  let checkPageTimer = null;
  function checkPageDebounced() {
    if (checkPageTimer) clearTimeout(checkPageTimer);
    checkPageTimer = setTimeout(checkPage, 500);
  }

  // ===================== РЕНДЕР СПИСКА =====================
  function renderWordsList() {
    const list = document.getElementById('ydirect-cleanup-words-list');
    if (!list) return;

    closeEditPopover();
    list.innerHTML = '';

    if (negativeWords.length === 0) {
      list.innerHTML = '<div class="ydirect-empty-msg">Кликни на слово в запросе</div>';
    } else {
      const sorted = getSortedWords();
      sorted.forEach((item) => {
        const origIndex = negativeWords.indexOf(item);
        const wordEl = document.createElement('div');
        wordEl.className = 'ydirect-word-item';
        wordEl.innerHTML = `
          <span class="ydirect-word-text">${escapeHtml(formatMatchItem(item))}</span>
          <span class="ydirect-word-edit" data-tooltip="Редактировать">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04c.39-.39.39-1.02 0-1.41l-2.51-2.51a.9959.9959 0 0 0-1.41 0l-1.96 1.96L18.75 9.17l1.96-1.96z"/></svg>
          </span>
          <span class="ydirect-match-btn" data-index="${origIndex}" data-tooltip="Тип соответствия">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </span>
          <span class="ydirect-word-remove" data-index="${origIndex}" data-tooltip="Удалить">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </span>
        `;
        const editBtn = wordEl.querySelector('.ydirect-word-edit');
        if (editBtn) {
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentIndex = negativeWords.indexOf(item);
            if (currentIndex === -1) return;
            openEditPopover(currentIndex, editBtn);
          });
        }

        const removeBtn = wordEl.querySelector('.ydirect-word-remove');
        if (removeBtn) {
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeWordByValue(item.word);
          });
        }
        list.appendChild(wordEl);
      });

      list.querySelectorAll('.ydirect-match-btn').forEach(btn => {
        let hoverTimer = null;

        btn.addEventListener('mouseenter', () => {
          clearTimeout(matchDropdownTimer);
          hoverTimer = setTimeout(() => {
            toggleMatchDropdown(parseInt(btn.dataset.index, 10), btn);
          }, 250);
        });

        btn.addEventListener('mouseleave', () => {
          if (hoverTimer) clearTimeout(hoverTimer);
          // Закрываем через 300мс, если курсор не перешёл на dropdown
          matchDropdownTimer = setTimeout(() => {
            closeMatchDropdown();
          }, 300);
        });
      });
    }

    const countEl = document.getElementById('ydirect-cleanup-count');
    if (countEl) countEl.textContent = negativeWords.length;
  }

  // ===================== СОРТИРОВКА =====================
  function getSortedWords() {
    const arr = [...negativeWords];
    if (currentSort === 'time') {
      return arr.sort((a, b) => b.addedAt - a.addedAt);
    } else {
      // alphabetical
      return arr.sort((a, b) => {
        const cmp = a.word.localeCompare(b.word, 'ru');
        return alphaSortAsc ? cmp : -cmp;
      });
    }
  }

  function applySort(type) {
    currentSort = type;
    if (type === 'alpha') {
      alphaSortAsc = !alphaSortAsc;
    }
    // Обновляем активные кнопки
    document.querySelectorAll('.ydirect-sort-btn').forEach(btn => btn.classList.remove('ydirect-sort-active'));
    const activeBtn = document.getElementById(type === 'time' ? 'ydirect-sort-time' : 'ydirect-sort-alpha');
    if (activeBtn) activeBtn.classList.add('ydirect-sort-active');
    // Если алфавит — показываем направление
    if (type === 'alpha') {
      activeBtn.textContent = alphaSortAsc ? 'A↑' : 'A↓';
    } else {
      document.getElementById('ydirect-sort-alpha').textContent = 'A-Z';
    }
    renderWordsList();
  }

  function attachSortEvents() {
    const alphaBtn = document.getElementById('ydirect-sort-alpha');
    const timeBtn = document.getElementById('ydirect-sort-time');
    if (alphaBtn) alphaBtn.addEventListener('click', () => applySort('alpha'));
    if (timeBtn) timeBtn.addEventListener('click', () => applySort('time'));
  }

  // ===================== СВОРАЧИВАНИЕ =====================
  function handleCollapsedButtonActivate(e) {
    e.preventDefault();
    e.stopPropagation();

    if (collapsedButtonActivationLocked) return;
    collapsedButtonActivationLocked = true;
    setTimeout(() => {
      collapsedButtonActivationLocked = false;
    }, 250);

    expandPanel();
  }

  function createCollapseButton() {
    collapseBtn = document.createElement('button');
    collapseBtn.id = 'ydirect-collapsed-btn';
    collapseBtn.type = 'button';
    collapseBtn.className = 'dc-UserBarItem ydirect-userbar-collapsed-btn';
    collapseBtn.title = 'Открыть панель минус-слов';
    collapseBtn.innerHTML = `
      <div class="dc-Stack dc-Stack_type_horizontal dc-Stack_justifyContent_center dc-Stack_alignItems_center dc-UserBarItem__icon">
        <svg class="dc-Icon ydirect-collapsed-icon" viewBox="0 0 24 24" width="20" height="20" focusable="false" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
    `;
    collapseBtn.addEventListener('pointerdown', handleCollapsedButtonActivate);
    collapseBtn.addEventListener('click', handleCollapsedButtonActivate);
  }

  function removeCollapsedButton() {
    if (!collapseBtn) return;
    collapseBtn.classList.remove('ydirect-collapsed-btn-visible');
    collapseBtn.classList.remove('ydirect-collapsed-btn-enter');
    collapseBtn.remove();
    collapseBtn = null;
  }

  function hideCollapsedButton() {
    removeCollapsedButton();
  }

  function animateCollapsedButtonIn() {
    if (!collapseBtn) return;

    collapseBtn.classList.remove('ydirect-collapsed-btn-visible');
    collapseBtn.classList.remove('ydirect-collapsed-btn-enter');
    collapseBtn.classList.add('ydirect-collapsed-btn-enter');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!collapseBtn) return;
        collapseBtn.classList.add('ydirect-collapsed-btn-visible');
      });
    });
  }

  function showCollapsedButtonInUserBar() {
    const userBar = document.querySelector(USER_BAR_SELECTOR);
    if (!userBar) return false;

    let shouldAnimate = false;
    if (!collapseBtn) {
      createCollapseButton();
      shouldAnimate = true;
    }

    if (!document.body.contains(collapseBtn)) {
      shouldAnimate = true;
    }

    if (collapseBtn.style.display === 'none') {
      shouldAnimate = true;
    }

    const lastButton = userBar.querySelector(USER_BAR_LAST_BUTTON_SELECTOR);
    if (lastButton && lastButton.parentElement === userBar) {
      lastButton.insertAdjacentElement('afterend', collapseBtn);
    } else if (collapseBtn.parentElement !== userBar) {
      userBar.appendChild(collapseBtn);
    }

    collapseBtn.style.display = 'flex';
    if (shouldAnimate) animateCollapsedButtonIn();
    return true;
  }

  function onPanelAnimationEnd(animationSeq, callback) {
    const panel = panelEl;
    if (!panel) return;

    let finished = false;
    let fallbackTimer = null;

    const finish = (e) => {
      if (finished) return;
      if (e && e.target !== panel) return;
      if (e && e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;

      finished = true;
      panel.removeEventListener('transitionend', finish);
      if (fallbackTimer) clearTimeout(fallbackTimer);

      if (animationSeq !== panelAnimationSeq || panel !== panelEl) return;
      callback();
    };

    panel.addEventListener('transitionend', finish);
    fallbackTimer = setTimeout(() => finish(), 650);
  }

  function collapsePanel() {
    if (panelCollapsed || !panelEl) return;

    // Сохраняем позицию ДО скрытия
    const pos = getPanelPosition();
    const w = panelEl.offsetWidth;
    const h = panelEl.offsetHeight;

    if (pos && pos.x > 0 && pos.y > 0) savePanelPos(pos.x, pos.y);
    if (w > 220 && h > 160) savePanelSize(w, h);
    savePanelCollapsed(true);

    const animationSeq = ++panelAnimationSeq;
    panelEl.style.transition = '';
    panelEl.classList.add('ydirect-panel-animating');

    // Анимация сворачивания
    panelEl.classList.add('ydirect-panel-hidden');

    panelCollapsed = true;
    panelVisible = false;

    // Показываем кнопку в начале анимации
    showCollapsedButtonInUserBar();

    onPanelAnimationEnd(animationSeq, () => {
      panelEl.style.display = 'none';
      panelEl.classList.remove('ydirect-panel-animating');
    });
  }

  function expandPanel() {
    if (!panelCollapsed || !panelEl) return;
    savePanelCollapsed(false);

    // Восстанавливаем позицию из GM-хранилища
    let pos = loadPanelPos();
    if (!pos) pos = getPanelPosition();
    if (!pos) pos = { x: window.innerWidth - 320, y: window.innerHeight - 400 };

    applyPanelPosition(pos);
    applyPanelSize();

    const animationSeq = ++panelAnimationSeq;
    panelEl.style.transition = '';
    panelEl.classList.add('ydirect-panel-animating');
    panelEl.classList.add('ydirect-panel-hidden');

    // Показываем панель — сначала display, потом анимация
    panelEl.style.display = 'flex';
    panelCollapsed = false;
    panelVisible = true;
    hideCollapsedButton();

    onPanelAnimationEnd(animationSeq, () => {
      panelEl.classList.remove('ydirect-panel-animating');
    });

    // Запускаем анимацию разворачивания
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (animationSeq !== panelAnimationSeq || !panelEl) return;
        panelEl.classList.remove('ydirect-panel-hidden');
      });
    });

    // Перезапускаем обработку слов и подсветку
    setTimeout(() => {
      attachWordClickHandlers();
      applyHighlightToExisting();
    }, 500);
    setTimeout(() => {
      attachWordClickHandlers();
      applyHighlightToExisting();
    }, 1500);
  }

  function attachCollapseEvents() {
    const btn = document.getElementById('ydirect-collapse-btn');
    if (btn) btn.addEventListener('click', collapsePanel);
  }

  function toggleMatchDropdown(index, btnEl) {
    // Закрываем предыдущий dropdown
    closeEditPopover();
    closeMatchDropdown();

    const item = negativeWords[index];
    if (!item) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'ydirect-match-dropdown';
    dropdown.dataset.index = index;

    // Позиционируем прямо над шестерёнкой, выровнено по левому краю
    const btnRect = btnEl.getBoundingClientRect();
    const dropdownWidth = 240;
    dropdown.style.position = 'fixed';
    dropdown.style.left = Math.min(
      Math.max(8, btnRect.right - dropdownWidth),
      window.innerWidth - dropdownWidth - 8
    ) + 'px';
    dropdown.style.top = (btnRect.top - 4) + 'px';
    dropdown.style.transform = 'translateY(-100%)';
    dropdown.style.zIndex = '999999';

    const types = [
      { key: 'none', label: 'Без оператора' },
      { key: 'wordForm', label: 'Зафиксировать словоформу' },
      { key: 'wordCount', label: 'Зафиксировать число слов' },
      { key: 'wordOrder', label: 'Зафиксировать порядок слов' }
    ];

    types.forEach(t => {
      const opt = document.createElement('div');
      opt.className = 'ydirect-match-option ' + (t.key === 'none'
        ? 'ydirect-match-option-none'
        : 'ydirect-match-option-toggle');
      opt.innerHTML = `
        <span class="ydirect-match-indicator" aria-hidden="true"></span>
        <span class="ydirect-match-label">${escapeHtml(t.label)}</span>
      `;
      opt.dataset.type = t.key;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!updateMatchType(index, t.key)) return;
        syncMatchDropdownOptions(dropdown, index);

        const wordItemEl = btnEl.closest('.ydirect-word-item');
        const textEl = wordItemEl ? wordItemEl.querySelector('.ydirect-word-text') : null;
        if (textEl && negativeWords[index]) {
          textEl.textContent = formatMatchItem(negativeWords[index]);
        }
      });
      dropdown.appendChild(opt);
    });

    syncMatchDropdownOptions(dropdown, index);

    document.body.appendChild(dropdown);
    activeMatchDropdown = dropdown;

    // Hover на самом dropdown — не закрываем
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(matchDropdownTimer);
    });

    dropdown.addEventListener('mouseleave', () => {
      matchDropdownTimer = setTimeout(() => {
        closeMatchDropdown();
      }, 300);
    });
  }

  function closeMatchDropdown() {
    if (activeMatchDropdown) {
      activeMatchDropdown.remove();
      activeMatchDropdown = null;
    }
  }

  function getMatchCheckboxSvg(isActive) {
    if (isActive) {
      return '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false"><rect x="1" y="1" width="12" height="12" rx="3" fill="#fc3f1d" stroke="#fc3f1d" stroke-width="1.5"/><path d="M3.4 7.2 5.8 9.6 10.6 4.8" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    return '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false"><rect x="1" y="1" width="12" height="12" rx="3" fill="#ffffff" stroke="#dadce0" stroke-width="1.5"/></svg>';
  }

  function syncMatchDropdownOptions(dropdown, index) {
    const item = negativeWords[index];
    if (!dropdown || !item) return;

    const activeTypes = getMatchTypes(item);
    dropdown.querySelectorAll('.ydirect-match-option').forEach(opt => {
      const type = opt.dataset.type;
      const isActive = type === 'none'
        ? activeTypes.length === 0
        : activeTypes.includes(type);
      opt.classList.toggle('ydirect-match-active', isActive);

      const indicator = opt.querySelector('.ydirect-match-indicator');
      if (indicator && type !== 'none') {
        indicator.innerHTML = getMatchCheckboxSvg(isActive);
      } else if (indicator) {
        indicator.innerHTML = '';
      }
    });
  }

  function normalizeEditedWordText(rawText) {
    let text = (rawText || '')
      .trim()
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ');

    while (
      (text.startsWith('[') && text.endsWith(']')) ||
      (text.startsWith('"') && text.endsWith('"'))
    ) {
      text = text.slice(1, -1).trim();
    }

    return text
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(token => token
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/^[!+]+/g, '')
      )
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  function closeEditPopover() {
    if (!activeEditPopover) return;

    document.removeEventListener('mousedown', activeEditPopover.onOutsideMouseDown, true);
    activeEditPopover.el.remove();
    activeEditPopover = null;
  }

  function setEditPopoverError(message) {
    if (!activeEditPopover) return;
    const errorEl = activeEditPopover.el.querySelector('.ydirect-edit-error');
    if (errorEl) errorEl.textContent = message || '';
  }

  function saveEditedWord(index, rawText) {
    const item = negativeWords[index];
    if (!item) return { ok: false, error: 'Слово не найдено' };

    const customText = (rawText || '').trim();
    if (!customText) {
      return { ok: false, error: 'Введите минус-слово' };
    }

    const normalized = normalizeEditedWordText(customText);
    if (!normalized) {
      return { ok: false, error: 'Введите слово без одних только операторов' };
    }

    const duplicateIndex = negativeWords.findIndex((candidate, candidateIndex) => {
      return candidateIndex !== index && candidate.word === normalized;
    });

    if (duplicateIndex !== -1) {
      return { ok: false, error: 'Такое слово уже есть в списке' };
    }

    item.word = normalized;
    item.customText = customText;
    saveWords();
    closeEditPopover();
    renderWordsList();
    applyHighlightToExisting();
    return { ok: true };
  }

  function openEditPopover(index, btnEl) {
    const item = negativeWords[index];
    if (!item || !btnEl) return;

    closeMatchDropdown();
    closeEditPopover();

    const popover = document.createElement('div');
    popover.className = 'ydirect-edit-popover';
    popover.style.position = 'fixed';
    popover.style.zIndex = '999999';

    const btnRect = btnEl.getBoundingClientRect();
    const popoverWidth = 260;
    const left = Math.min(
      Math.max(8, btnRect.right - popoverWidth),
      window.innerWidth - popoverWidth - 8
    );

    popover.style.left = left + 'px';
    if (btnRect.top > 120) {
      popover.style.top = (btnRect.top - 8) + 'px';
      popover.style.transform = 'translateY(-100%)';
    } else {
      popover.style.top = (btnRect.bottom + 8) + 'px';
    }

    const input = document.createElement('input');
    input.className = 'ydirect-edit-input';
    input.type = 'text';
    input.value = formatMatchItem(item);
    input.setAttribute('aria-label', 'Редактировать минус-слово');

    const errorEl = document.createElement('div');
    errorEl.className = 'ydirect-edit-error';

    const actions = document.createElement('div');
    actions.className = 'ydirect-edit-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'ydirect-edit-cancel';
    cancelBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <span>Отмена</span>
    `;

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'ydirect-edit-save';
    saveBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      <span>Сохранить</span>
    `;

    const submit = () => {
      const result = saveEditedWord(index, input.value);
      if (!result.ok) setEditPopoverError(result.error);
    };

    cancelBtn.addEventListener('click', closeEditPopover);
    saveBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeEditPopover();
      }
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    popover.appendChild(input);
    popover.appendChild(errorEl);
    popover.appendChild(actions);

    const onOutsideMouseDown = (e) => {
      if (popover.contains(e.target) || btnEl.contains(e.target)) return;
      closeEditPopover();
    };

    document.body.appendChild(popover);
    activeEditPopover = { el: popover, onOutsideMouseDown: onOutsideMouseDown };
    document.addEventListener('mousedown', onOutsideMouseDown, true);

    input.focus();
    input.select();
  }

  function updateMatchType(index, type) {
    const item = negativeWords[index];
    if (!item) return false;

    if (type === 'none') {
      item.matchTypes = [];
    } else if (MATCH_TYPES.includes(type)) {
      const currentTypes = getMatchTypes(item);
      item.matchTypes = currentTypes.includes(type)
        ? currentTypes.filter(currentType => currentType !== type)
        : currentTypes.concat(type);
    } else {
      return false;
    }

    delete item.matchType;
    delete item.customText;
    saveWords();
    return true;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===================== ПОДСВЕТКА УЖЕ ДОБАВЛЕННЫХ СЛОВ =====================
  function applyHighlightToExisting() {
    // Разделяем на одиночные слова и фразы
    const singleWords = new Set();
    const phrases = [];
    negativeWords.forEach(item => {
      if (item.word.includes(' ')) {
        phrases.push(item.word);
      } else {
        singleWords.add(item.word);
      }
    });

    // Собираем все слова из фраз
    const wordsInPhrases = new Set();
    phrases.forEach(phrase => {
      phrase.split(/\s+/).forEach(pw => wordsInPhrases.add(pw));
    });

    const doubleWords = new Set();
    singleWords.forEach(sw => {
      if (wordsInPhrases.has(sw)) {
        doubleWords.add(sw);
      }
    });

    document.querySelectorAll('.ydirect-clickable-word').forEach(wordEl => {
      const word = wordEl.dataset.word;
      if (!word) return;
      const normalized = word.toLowerCase();

      wordEl.classList.remove('ydirect-word-already-added');
      wordEl.classList.remove('ydirect-phrase-highlighted');
      wordEl.classList.remove('ydirect-word-double');

      if (singleWords.has(normalized)) {
        wordEl.classList.add('ydirect-word-already-added');
        if (doubleWords.has(normalized)) {
          wordEl.classList.add('ydirect-word-double');
        }
        return;
      }
    });

    // Для фраз — ищем точные совпадения последовательности слов
    phrases.forEach(phrase => {
      const phraseWordsArr = phrase.split(/\s+/);
      const phraseLen = phraseWordsArr.length;

      document.querySelectorAll('.ydirect-query-text .ydirect-clickable-word').forEach(startSpan => {
        const parent = startSpan.parentElement;
        const allSpans = parent.querySelectorAll('.ydirect-clickable-word');
        const spansArr = Array.from(allSpans);

        const startIdx = spansArr.indexOf(startSpan);
        if (startIdx === -1 || startIdx + phraseLen > spansArr.length) return;

        // Проверяем точное совпадение последовательности
        let match = true;
        for (let i = 0; i < phraseLen; i++) {
          if (spansArr[startIdx + i].dataset.word.toLowerCase() !== phraseWordsArr[i]) {
            match = false;
            break;
          }
        }

        if (match) {
          for (let i = 0; i < phraseLen; i++) {
            spansArr[startIdx + i].classList.add('ydirect-phrase-highlighted');
          }
        }
      });
    });
  }

  // ===================== ДОБАВЛЕНИЕ СЛОВА =====================
  function addWord(word) {
    const normalized = word.trim().toLowerCase();
    if (!normalized || negativeWords.some(item => item.word === normalized)) return false;

    negativeWords.push(createWordItem(normalized));
    saveWords();
    renderWordsList();
    applyHighlightToExisting();

    flashWord(normalized);
    return true;
  }

  function removeWord(index) {
    if (!Number.isInteger(index) || index < 0 || index >= negativeWords.length) {
      return false;
    }
    negativeWords.splice(index, 1);
    saveWords();
    renderWordsList();
    applyHighlightToExisting();
    return true;
  }

  /**
   * Удаляет слово из списка по значению (для toggle по клику)
   */
  function removeWordByValue(word) {
    const normalized = word.trim().toLowerCase();
    const idx = negativeWords.findIndex(item => item.word === normalized);
    if (idx !== -1) {
      negativeWords.splice(idx, 1);
      saveWords();
      renderWordsList();
      applyHighlightToExisting();
      return true;
    }
    return false;
  }

  function clearAllWords() {
    if (negativeWords.length === 0) {
      const btn = document.getElementById('ydirect-clear-btn');
      showActionTooltip(btn, 'Список пуст');
      return;
    }
    const btn = document.getElementById('ydirect-clear-btn');
    showActionTooltip(btn, 'Очистить все минус-слова?', {
      confirm: true,
      onConfirm: () => {
        negativeWords = [];
        saveWords();
        renderWordsList();
        applyHighlightToExisting();
      }
    });
  }

  function copyAllWords() {
    if (negativeWords.length === 0) {
      const btn = document.getElementById('ydirect-copy-btn');
      showActionTooltip(btn, 'Список пуст, нечего копировать');
      return;
    }
    const text = negativeWords.map(formatMatchItem).join('\n');
    if (typeof GM_setClipboard !== 'undefined') {
      GM_setClipboard(text, 'text');
    } else {
      navigator.clipboard.writeText(text);
    }
    const btn = document.getElementById('ydirect-copy-btn');
    showActionTooltip(btn, 'Скопировано в буфер');
  }

  // ===================== ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ =====================
  function flashWord(word) {
    // Кратковременная подсветка в панели
    const list = document.getElementById('ydirect-cleanup-words-list');
    const lastItem = list?.lastElementChild;
    if (lastItem) {
      lastItem.classList.add('ydirect-word-item-added');
      setTimeout(() => lastItem.classList.remove('ydirect-word-item-added'), 800);
    }
  }

  // ===================== DRAG =====================
  function initDrag(panel) {
    const header = document.getElementById('ydirect-cleanup-header');
    let isDragging = false;
    let startX, startY, origX, origY;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('ydirect-word-remove')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      panel.style.transition = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = (origX + dx) + 'px';
      panel.style.top = (origY + dy) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      // Сохраняем позицию при каждом движении
      savePanelPos(origX + dx, origY + dy);
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      panel.style.transition = '';
      // Сохраняем финальную позицию
      const rect = panel.getBoundingClientRect();
      savePanelPos(rect.left, rect.top);
    });
  }

  // ===================== RESIZE =====================
  function initResize(panel) {
    const handle = document.getElementById('ydirect-cleanup-resize');
    let isResizing = false;
    let startX, startY, startW, startH;

    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;
      panel.style.transition = 'none';
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newW = Math.max(200, startW + dx);
      const newH = Math.max(150, startH + dy);
      panel.style.width = newW + 'px';
      panel.style.height = newH + 'px';
      // Сохраняем размер при каждом изменении (с защитой от минимальных)
      if (newW > 220 && newH > 160) savePanelSize(newW, newH);
    });

    document.addEventListener('mouseup', () => {
      if (!isResizing) return;
      isResizing = false;
      panel.style.transition = '';
      // Сохраняем финальный размер
      savePanelSize(panel.offsetWidth, panel.offsetHeight);
    });
  }

  // ===================== ОБРАБОТКА КЛИКОВ ПО СЛОВАМ =====================
  function initWordClicks() {
    // Наблюдатель за изменениями DOM (Яндекс.Директ — SPA)
    const observer = new MutationObserver(() => {
      if (attachDebounceTimer) clearTimeout(attachDebounceTimer);
      attachDebounceTimer = setTimeout(() => {
        checkPage();
        attachWordClickHandlers();
        // Обновляем подсветку при появлении новых строк
        if (panelVisible || panelCollapsed) applyHighlightToExisting();
      }, 300);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Первоначальная привязка с задержкой (чтобы таблица успела отрисоваться)
    setTimeout(attachWordClickHandlers, 1000);
    // Повторная попытка через 3 секунды (на случай медленной загрузки)
    setTimeout(attachWordClickHandlers, 3000);
  }

  function attachWordClickHandlers() {
    // Не обрабатываем, если панель не активна на странице отчета
    if (!panelVisible && !panelCollapsed) return;

    const reportInterface = activeReportInterface || getActiveReportInterface();
    if (!reportInterface) return;
    activeReportInterface = reportInterface;

    // Ищем текстовые элементы в колонке "Поисковый запрос" Яндекс.Директ.
    const queryCells = document.querySelectorAll(reportInterface.queryTextSelector);

    queryCells.forEach(queryCellEl => {
      const queryTextEl = getQueryTextElement(queryCellEl, reportInterface);
      if (!queryTextEl) return;

      const rawText = extractTextFromQueryCell(queryTextEl);
      if (queryTextEl.dataset.ydirectWordHandler === rawText) return;

      if (!rawText || rawText.length < 2 || rawText.length > 500) return;

      // Разбиваем на слова
      const words = rawText.trim().split(/\s+/);
      if (words.length === 0) return;

      // Очищаем текстовый span и вставляем кликабельные слова
      queryTextEl.innerHTML = '';
      queryTextEl.classList.add('ydirect-query-text');
      preventLegacyCheckboxFromQueryText(queryTextEl, reportInterface);

      words.forEach((w, i) => {
        if (!w.trim()) return;
        const span = document.createElement('span');
        span.className = 'ydirect-clickable-word';
        span.dataset.word = w;
        span.dataset.wordIndex = i;
        span.textContent = w;
        span.title = 'ЛКМ — минус-слово | Drag ЛКМ — выделить фразу';

        // Подсветка, если слово уже в списке
        if (negativeWords.some(item => item.word === w.toLowerCase())) {
          span.classList.add('ydirect-word-already-added');
        }

        queryTextEl.appendChild(span);

        // Добавляем пробел между словами (кроме последнего)
        if (i < words.length - 1) {
          queryTextEl.appendChild(document.createTextNode(' '));
        }
      });

      queryTextEl.dataset.ydirectWordHandler = rawText;
    });

    // Делегирование событий: обработчик клика на document
    if (!clickHandlerAttached) {
      clickHandlerAttached = true;

      // --- mousedown: начало выделения ---
      document.addEventListener('mousedown', (e) => {
        const wordEl = e.target.closest('.ydirect-clickable-word');
        if (!wordEl) return;

        if (e.button !== 0) {
          isSelecting = false;
          selectStartIndex = -1;
          selectTextField = null;
          selectStartEl = null;
          clearDragSelection();
          document.documentElement.classList.add('ydirect-ignore-word-hover');
          return;
        }

        isSelecting = true;
        selectStartIndex = parseInt(wordEl.dataset.wordIndex, 10);
        selectTextField = wordEl.parentElement;
        selectStartEl = wordEl;

        // Убираем старое drag-выделение
        clearDragSelection();
      }, true);

      // --- mouseenter: расширение диапазона ---
      document.addEventListener('mouseenter', (e) => {
        if (!isSelecting) return;
        const wordEl = e.target.closest('.ydirect-clickable-word');
        if (!wordEl || wordEl.parentElement !== selectTextField) return;

        // Подсвечиваем диапазон
        highlightRange(selectStartIndex, parseInt(wordEl.dataset.wordIndex, 10));
      }, true);

      // --- mouseup: завершение выделения ---
      document.addEventListener('mouseup', (e) => {
        document.documentElement.classList.remove('ydirect-ignore-word-hover');

        if (!isSelecting) return;

        if (e.button !== 0) {
          isSelecting = false;
          clearDragSelection();
          return;
        }

        isSelecting = false;

        const targetEl = e.target.closest('.ydirect-clickable-word');
        if (!targetEl || targetEl.parentElement !== selectTextField) {
          clearDragSelection();
          return;
        }

        const endIndex = parseInt(targetEl.dataset.wordIndex, 10);

        if (endIndex === selectStartIndex) {
          // Клик без перетаскивания — toggle одного слова
          const word = targetEl.dataset.word;
          if (!word) { clearDragSelection(); return; }

          const normalized = word.toLowerCase();
          if (negativeWords.some(item => item.word === normalized)) {
            removeWordByValue(normalized);
            targetEl.classList.remove('ydirect-word-already-added');
          } else {
            const added = addWord(word);
            if (added) {
              targetEl.classList.add('ydirect-word-added');
              setTimeout(() => targetEl.classList.remove('ydirect-word-added'), 500);
            }
          }
        } else {
          // Drag — добавляем фразу целиком
          const phrase = collectPhrase(selectStartIndex, endIndex);
          if (phrase) {
            const normalized = phrase.trim().toLowerCase();
            if (!negativeWords.some(item => item.word === normalized)) {
              negativeWords.push(createWordItem(normalized));
              saveWords();
              renderWordsList();
              applyHighlightToExisting();
            }
            // Подсветка успешного добавления
            flashRange(selectStartIndex, endIndex);
          }
        }

        clearDragSelection();
        e.stopPropagation();
        e.preventDefault();
      }, true);

      document.addEventListener('click', (e) => {
        if (!shouldBlockQueryTextClick(e.target)) return;

        e.stopPropagation();
        e.preventDefault();
      }, true);

      document.addEventListener('contextmenu', () => {
        document.documentElement.classList.remove('ydirect-ignore-word-hover');
      }, true);
    }
  }

  function shouldBlockQueryTextClick(target) {
    const queryTextEl = target.closest('.ydirect-query-text[data-ydirect-prevent-checkbox="true"]');
    if (!queryTextEl) return Boolean(target.closest('.ydirect-clickable-word'));
    return !isInsideRealCheckbox(target, queryTextEl);
  }

  function preventLegacyCheckboxFromQueryText(queryTextEl, reportInterface) {
    if (!reportInterface.checkboxSelector || queryTextEl.dataset.ydirectPreventCheckbox !== undefined) return;

    queryTextEl.dataset.ydirectPreventCheckbox = 'true';

    const preventCheckboxToggle = (e) => {
      if (isInsideRealCheckbox(e.target, queryTextEl)) return;

      e.stopPropagation();
      e.preventDefault();
    };

    ['click', 'dblclick'].forEach(eventName => {
      queryTextEl.addEventListener(eventName, preventCheckboxToggle, true);
    });
  }

  function isInsideRealCheckbox(target, scopeEl) {
    const reportInterface = activeReportInterface || getActiveReportInterface();
    if (!reportInterface || !reportInterface.checkboxSelector) return false;

    const checkboxEl = target.closest(reportInterface.checkboxSelector);
    return Boolean(checkboxEl && (!scopeEl || scopeEl.contains(checkboxEl)));
  }

  function getQueryTextElement(queryCellEl, reportInterface) {
    if (reportInterface.queryTextInnerSelector) {
      return queryCellEl.querySelector(reportInterface.queryTextInnerSelector) || queryCellEl;
    }
    return queryCellEl;
  }

  /**
   * Подсвечивает диапазон слов при drag-выделении
   */
  function highlightRange(startIdx, endIdx) {
    clearDragSelection();
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    selectTextField.querySelectorAll('.ydirect-clickable-word').forEach(span => {
      const idx = parseInt(span.dataset.wordIndex, 10);
      if (idx >= min && idx <= max) {
        span.classList.add('ydirect-word-drag-selected');
      }
    });
  }

  /**
   * Убирает drag-выделение
   */
  function clearDragSelection() {
    document.querySelectorAll('.ydirect-word-drag-selected').forEach(el => {
      el.classList.remove('ydirect-word-drag-selected');
    });
  }

  /**
   * Собирает фразу из диапазона слов
   */
  function collectPhrase(startIdx, endIdx) {
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    const words = [];
    selectTextField.querySelectorAll('.ydirect-clickable-word').forEach(span => {
      const idx = parseInt(span.dataset.wordIndex, 10);
      if (idx >= min && idx <= max) {
        words.push(span.dataset.word);
      }
    });
    return words.join(' ');
  }

  /**
   * Кратковременная подсветка фразы при добавлении
   */
  function flashRange(startIdx, endIdx) {
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    selectTextField.querySelectorAll('.ydirect-clickable-word').forEach(span => {
      const idx = parseInt(span.dataset.wordIndex, 10);
      if (idx >= min && idx <= max) {
        span.classList.add('ydirect-phrase-added');
        setTimeout(() => span.classList.remove('ydirect-phrase-added'), 600);
      }
    });
  }

  /**
   * Извлекает текст из ячейки поискового запроса Яндекс.Директ.
   */
  function extractTextFromQueryCell(queryTextEl) {
    return (queryTextEl.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ===================== КНОПКИ =====================
  function attachButtonEvents() {
    const copyBtn = document.getElementById('ydirect-copy-btn');
    const clearBtn = document.getElementById('ydirect-clear-btn');

    if (copyBtn) copyBtn.addEventListener('click', copyAllWords);
    if (clearBtn) clearBtn.addEventListener('click', clearAllWords);
  }

  // ===================== СТИЛИ =====================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --ydirect-font-regular: 'YS Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        --ydirect-font-medium: 'YS Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        --ydirect-font-bold: 'YS Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        --ydirect-panel-collapse-duration: 420ms;
        --ydirect-panel-expand-duration: 480ms;
        --ydirect-panel-motion-easing: cubic-bezier(0.16, 1, 0.3, 1);
      }

      /* ===== Панель — Material Design 3 ===== */
      #ydirect-cleanup-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 380px;
        min-width: 220px;
        min-height: 160px;
        box-sizing: border-box;
        background: #ffffff;
        color: #202124;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        z-index: 100000;
        font-family: var(--ydirect-font-regular);
        font-size: 13px;
        overflow: visible;
        border: 1px solid #e0e0e0;
        font-feature-settings: normal;
        font-kerning: auto;
        font-optical-sizing: auto;
        font-variation-settings: normal;
        letter-spacing: normal;
        text-rendering: auto;
        /* Анимация сворачивания/разворачивания */
        transform-origin: top right;
        transition-property: transform, opacity;
        transition-duration: var(--ydirect-panel-expand-duration);
        transition-timing-function: var(--ydirect-panel-motion-easing);
      }

      #ydirect-cleanup-panel.ydirect-panel-animating {
        will-change: transform, opacity;
      }

      /* Свёрнутое состояние */
      #ydirect-cleanup-panel.ydirect-panel-hidden {
        transform: translateY(12px) scale(0.94);
        opacity: 0;
        pointer-events: none;
        transition-duration: var(--ydirect-panel-collapse-duration);
      }

      /* Развёрнутое состояние (по умолчанию) */
      #ydirect-cleanup-panel:not(.ydirect-panel-hidden) {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      /* ===== Кастомные тултипы (появляются СВЕРХУ) ===== */
      [data-tooltip] {
        position: relative;
      }

      [data-tooltip]::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: #3c4043;
        color: #ffffff;
        font-size: 11px;
        font-weight: 400;
        line-height: 1.4;
        padding: 6px 10px;
        border-radius: 6px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s;
        z-index: 999999;
        font-family: var(--ydirect-font-regular);
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }

      [data-tooltip]::after {
        content: '';
        position: absolute;
        bottom: calc(100% + 2px);
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #3c4043;
        opacity: 0;
        transition: opacity 0.15s;
        pointer-events: none;
        z-index: 999999;
      }

      [data-tooltip]:hover::before,
      [data-tooltip]:hover::after {
        opacity: 1;
      }

      /* ===== Тултипы действий (уведомления кнопок) ===== */
      .ydirect-action-tooltip {
        background: #3c4043;
        color: #ffffff;
        font-size: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        z-index: 999999;
        font-family: var(--ydirect-font-regular);
        pointer-events: auto;
        opacity: 0;
        transform: translateX(-50%) translateY(4px);
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 240px;
        text-align: center;
      }

      .ydirect-action-tooltip.ydirect-action-tooltip-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .ydirect-action-tooltip-text {
        line-height: 1.4;
        margin-bottom: 0;
      }

      .ydirect-action-tooltip-btns {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.15);
      }

      .ydirect-action-tooltip-btns button {
        padding: 4px 14px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        font-family: var(--ydirect-font-medium);
        transition: background 0.15s;
      }

      .ydirect-action-tooltip-btns button:first-child {
        background: rgba(255,255,255,0.1);
        color: #dadce0;
      }

      .ydirect-action-tooltip-btns button:first-child:hover {
        background: rgba(255,255,255,0.2);
      }

      .ydirect-action-tooltip-btns button:last-child {
        background: #fc3f1d;
        color: #ffffff;
      }

      .ydirect-action-tooltip-btns button:last-child:hover {
        background: #d42f15;
      }

      /* ===== Шапка ===== */
      #ydirect-cleanup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 12px 12px 0 0;
        font-weight: 500;
        user-select: none;
        gap: 8px;
        color: #5f6368;
      }

      .ydirect-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--ydirect-font-regular);
        font-size: 15px;
        line-height: 20px;
        font-weight: 500;
        letter-spacing: normal;
        font-feature-settings: normal;
        color: #1E242E;
      }

      .ydirect-icon {
        fill: #1E242E;
        flex-shrink: 0;
      }

      /* ===== Группа кнопок в шапке ===== */
      #ydirect-header-btns {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
      }

      /* ===== Кнопки сортировки ===== */
      .ydirect-sort-btn {
        cursor: pointer;
        padding: 4px 8px;
        font-size: 11px;
        border-radius: 6px;
        background: #ffffff;
        border: 1px solid #dadce0;
        transition: all 0.15s;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5f6368;
        height: 26px;
        min-width: 32px;
        font-family: var(--ydirect-font-medium);
        font-weight: 500;
      }

      .ydirect-sort-btn svg {
        fill: #5f6368;
      }

      .ydirect-sort-btn:hover {
        background: #f1f3f4;
        border-color: #bdc1c6;
      }

      .ydirect-sort-btn.ydirect-sort-active {
        background: #fff1ed;
        border-color: #ffd1c7;
        color: #fc3f1d;
      }

      .ydirect-sort-btn.ydirect-sort-active svg {
        fill: #fc3f1d;
      }

      /* ===== Кнопка сворачивания ===== */
      .ydirect-collapse-btn {
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        background: transparent;
        transition: all 0.15s;
        user-select: none;
        border: none;
        color: #5f6368;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        font-family: var(--ydirect-font-medium);
        font-weight: 500;
      }

      .ydirect-collapse-btn svg {
        fill: #5f6368;
        transition: transform 0.2s;
      }

      .ydirect-collapse-btn:hover {
        background: #e8eaed;
      }

      .ydirect-collapse-btn:hover svg {
        transform: rotate(180deg);
      }

      /* ===== Счётчик ===== */
      #ydirect-cleanup-count {
        background: #fc3f1d;
        color: white;
        border-radius: 10px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        font-family: var(--ydirect-font-medium);
        padding: 0 5px;
        margin-right: 2px;
        flex-shrink: 0;
      }

      /* ===== Resize handle ===== */
      #ydirect-cleanup-resize {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 14px;
        height: 14px;
        cursor: nwse-resize;
        opacity: 0.4;
      }

      #ydirect-cleanup-resize::after {
        content: '';
        position: absolute;
        bottom: 3px;
        right: 3px;
        width: 8px;
        height: 8px;
        border-right: 2px solid #5f6368;
        border-bottom: 2px solid #5f6368;
      }

      /* ===== Список слов ===== */
      #ydirect-cleanup-words-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px 0;
        min-width: 0;
      }

      #ydirect-cleanup-words-list::-webkit-scrollbar {
        width: 6px;
      }

      #ydirect-cleanup-words-list::-webkit-scrollbar-thumb {
        background: #dadce0;
        border-radius: 3px;
      }

      #ydirect-cleanup-words-list::-webkit-scrollbar-thumb:hover {
        background: #bdc1c6;
      }

      .ydirect-word-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 16px;
        margin: 0;
        background: #ffffff;
        transition: background 0.1s;
        box-sizing: border-box;
        min-width: 0;
      }

      .ydirect-word-item:hover {
        background: #f1f3f4;
      }

      .ydirect-word-item-added {
        background: #fff1ed;
        animation: ydirect-flash 0.8s ease;
      }

      @keyframes ydirect-flash {
        0% { background: #ffe2dc; }
        100% { background: #ffffff; }
      }

      .ydirect-word-text {
        word-break: break-word;
        flex: 1;
        font-size: 13px;
        color: #202124;
        font-family: var(--ydirect-font-regular);
        font-weight: 400;
      }

      /* ===== Шестерёнка типа соответствия ===== */
      .ydirect-match-btn {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s;
        user-select: none;
        display: flex;
        align-items: center;
        opacity: 0.4;
      }

      .ydirect-match-btn svg {
        fill: #5f6368;
      }

      .ydirect-match-btn:hover {
        opacity: 1;
        background: #e8eaed;
      }

      /* ===== Кнопка редактирования ===== */
      .ydirect-word-edit {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s;
        user-select: none;
        display: flex;
        align-items: center;
        margin-left: 2px;
        opacity: 0.4;
      }

      .ydirect-word-edit svg {
        fill: #5f6368;
      }

      .ydirect-word-edit:hover {
        opacity: 1;
        background: #e8eaed;
      }

      /* ===== Попап редактирования слова ===== */
      .ydirect-edit-popover {
        width: 260px;
        box-sizing: border-box;
        background: #ffffff;
        border: 1px solid #dadce0;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        font-family: var(--ydirect-font-regular);
      }

      .ydirect-edit-input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #dadce0;
        border-radius: 6px;
        padding: 7px 9px;
        color: #202124;
        font-size: 13px;
        line-height: 18px;
        font-family: var(--ydirect-font-regular);
        outline: none;
      }

      .ydirect-edit-input:focus {
        border-color: #3782ff;
        box-shadow: 0 0 0 2px rgba(55, 130, 255, 0.12);
      }

      .ydirect-edit-error {
        min-height: 14px;
        margin-top: 6px;
        color: #d93025;
        font-size: 11px;
        line-height: 14px;
        font-family: var(--ydirect-font-regular);
      }

      .ydirect-edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 8px;
      }

      .ydirect-edit-actions button {
        border: 1px solid #dadce0;
        border-radius: 6px;
        padding: 5px 10px;
        background: #ffffff;
        color: #3c4043;
        cursor: pointer;
        font-size: 12px;
        line-height: 16px;
        font-family: 'YS Text', 'Helvetica Neue', Arial, sans-serif;
        font-feature-settings: "kern", "liga";
        font-kerning: auto;
        font-optical-sizing: auto;
        font-variation-settings: normal;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.15s;
      }

      .ydirect-edit-actions button svg {
        fill: #5f6368;
      }

      .ydirect-edit-actions button:hover {
        background: #f1f3f4;
      }

      .ydirect-edit-save {
        border-color: #3782ff !important;
        background: #3782ff !important;
        color: #ffffff !important;
      }

      .ydirect-edit-save svg {
        fill: #ffffff !important;
      }

      .ydirect-edit-save:hover {
        background: #1f6fed !important;
      }

      /* ===== Выпадающее меню типа соответствия ===== */
      .ydirect-match-dropdown {
        background: #ffffff;
        border: 1px solid #dadce0;
        border-radius: 8px;
        padding: 4px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        min-width: 240px;
      }

      .ydirect-match-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.1s;
        white-space: nowrap;
        color: #5f6368;
        font-family: var(--ydirect-font-medium);
        font-weight: 500;
      }

      .ydirect-match-indicator {
        width: 14px;
        height: 14px;
        flex: 0 0 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ydirect-match-indicator svg {
        display: block;
        width: 14px;
        height: 14px;
      }

      .ydirect-match-label {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ydirect-match-option:hover {
        background: #f1f3f4;
      }

      .ydirect-match-option.ydirect-match-active {
        background: #fff1ed;
        color: #fc3f1d;
        font-weight: 500;
      }

      .ydirect-match-option-none .ydirect-match-indicator::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        border: 1.5px solid #dadce0;
        border-radius: 50%;
      }

      .ydirect-match-option-none.ydirect-match-active .ydirect-match-indicator::before {
        background: #fc3f1d;
        border-color: #fc3f1d;
      }

      /* ===== Кнопка удаления ===== */
      .ydirect-word-remove {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        margin-left: 2px;
        opacity: 0.4;
      }

      .ydirect-word-remove svg {
        fill: #5f6368;
      }

      .ydirect-word-remove:hover {
        opacity: 1;
        background: #fce8e6;
      }

      .ydirect-word-remove:hover svg {
        fill: #d93025;
      }

      /* ===== Пустое сообщение ===== */
      .ydirect-empty-msg {
        text-align: center;
        color: #9aa0a6;
        padding: 30px 16px;
        font-style: normal;
        font-size: 13px;
        font-family: var(--ydirect-font-regular);
        font-weight: 400;
      }

      /* ===== Кнопки действий ===== */
      #ydirect-cleanup-actions {
        display: flex;
        gap: 8px;
        padding: 10px 16px;
        border-top: 1px solid #e0e0e0;
        background: #f8f9fa;
        border-radius: 0 0 12px 12px;
      }

      #ydirect-cleanup-actions button {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #dadce0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 400;
        font-size: 12px;
        font-feature-settings: "kern", "liga";
        font-kerning: auto;
        font-optical-sizing: auto;
        font-variation-settings: normal;
        transition: all 0.15s;
        background: #ffffff;
        color: #3c4043;
        font-family: 'YS Text', 'Helvetica Neue', Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      #ydirect-cleanup-actions button svg {
        fill: #5f6368;
      }

      #ydirect-cleanup-actions button:hover {
        background: #f1f3f4;
        border-color: #bdc1c6;
      }

      #ydirect-clear-btn:hover {
        background: #fce8e6;
        border-color: #f5c6c2;
        color: #d93025;
      }

      #ydirect-clear-btn:hover svg {
        fill: #d93025;
      }

      /* ===== Свёрнутая кнопка панели ===== */
      #ydirect-collapsed-btn {
        background: transparent;
        border: none;
        border-radius: 14px;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        min-width: 40px;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        position: relative;
        z-index: 100001;
        pointer-events: auto !important;
        user-select: none;
        appearance: none;
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: opacity 650ms cubic-bezier(0.16, 1, 0.3, 1),
                    transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      #ydirect-collapsed-btn *,
      #ydirect-collapsed-btn::before,
      #ydirect-collapsed-btn::after {
        pointer-events: none !important;
      }

      #ydirect-collapsed-btn.ydirect-collapsed-btn-enter {
        opacity: 0;
        transform: translateY(8px) scale(0.86);
      }

      #ydirect-collapsed-btn.ydirect-collapsed-btn-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      #ydirect-collapsed-btn .dc-UserBarItem__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        min-width: 32px;
        background: #fc3f1d;
        border-radius: 14px;
        box-sizing: border-box;
        color: #ffffff;
        opacity: 1 !important;
        transform: scale(0.88);
        transition: background 150ms linear,
                    transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      #ydirect-collapsed-btn.ydirect-collapsed-btn-visible .dc-UserBarItem__icon {
        transform: scale(1);
      }

      #ydirect-collapsed-btn svg,
      #ydirect-collapsed-btn path {
        width: 20px;
        height: 20px;
        fill: #ffffff;
      }

      #ydirect-collapsed-btn:hover {
        background: transparent;
      }

      #ydirect-collapsed-btn:hover .dc-UserBarItem__icon {
        background: #d42f15;
      }

      #ydirect-collapsed-btn:focus,
      #ydirect-collapsed-btn:active {
        opacity: 1;
      }

      /* ===== Кликабельные слова в таблице ===== */
      .ydirect-clickable-word {
        display: inline;
        padding: 1px 2px;
        margin: 0;
        border-radius: 3px;
        transition: all 0.15s;
        cursor: pointer;
        user-select: none;
        font-family: var(--ydirect-font-regular);
        font-weight: 400;
      }

      .ydirect-clickable-word:hover {
        background: rgba(252, 63, 29, 0.08);
      }

      .ydirect-ignore-word-hover .ydirect-clickable-word:not(.ydirect-word-already-added):hover,
      .ydirect-ignore-word-hover .ydirect-clickable-word:not(.ydirect-word-already-added):active {
        background: transparent !important;
        color: inherit !important;
      }

      .ydirect-word-already-added {
        cursor: pointer;
      }

      .ydirect-clickable-word:active {
        background: #fc3f1d;
        color: white;
      }

      .ydirect-word-added {
        background: #d93025 !important;
        color: white !important;
      }

      /* ===== Уже добавленные минус-слова ===== */
      .ydirect-word-already-added {
        background: rgba(217, 48, 37, 0.08);
        color: #c5221f;
        font-weight: 500;
      }

      .ydirect-word-already-added:hover {
        background: rgba(217, 48, 37, 0.14);
      }

      .ydirect-ignore-word-hover .ydirect-word-already-added:hover,
      .ydirect-ignore-word-hover .ydirect-word-already-added:active {
        background: rgba(217, 48, 37, 0.08) !important;
        color: #c5221f !important;
      }

      /* ===== Слово есть и отдельно, и в фразе — рамка ===== */
      .ydirect-word-double {
        outline: 2px solid #d93025;
        outline-offset: 1px;
      }

      /* ===== Drag-выделение (при перетаскивании) ===== */
      .ydirect-word-drag-selected {
        background: rgba(255, 152, 0, 0.2) !important;
        color: #e65100 !important;
        border-radius: 3px;
      }

      /* ===== Фразы в таблице ===== */
      .ydirect-phrase-highlighted {
        background: rgba(255, 152, 0, 0.1);
        color: #e65100;
        font-weight: 500;
      }

      .ydirect-phrase-highlighted:hover {
        background: rgba(255, 152, 0, 0.18);
      }

      /* ===== Flash при добавлении фразы ===== */
      .ydirect-phrase-added {
        background: rgba(255, 152, 0, 0.35) !important;
        color: white !important;
      }
    `;

    document.head.appendChild(style);
  }

  // ===================== ОТСЛЕЖИВАНИЕ НАВИГАЦИИ SPA =====================
  function initNavTracking() {
    // Отслеживаем popstate (кнопки назад/вперёд)
    window.addEventListener('popstate', checkPageDebounced);

    // Патчим pushState и replaceState для отслеживания навигации
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkPageDebounced();
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkPageDebounced();
    };

    // Дополнительная проверка через MutationObserver (на случай если Яндекс.Директ меняет URL иначе)
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkPageDebounced();
      }
    });
    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ===================== ИНИЦИАЛИЗАЦИЯ =====================
  function init() {
    loadWords();
    panelCollapsed = loadPanelCollapsed();
    injectStyles();
    initNavTracking();
    checkPage();
    initWordClicks();

    // Сохраняем позицию/размер при переключении вкладки
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && panelEl && panelEl.style.display !== 'none') {
        const pos = getPanelPosition();
        const w = panelEl.offsetWidth;
        const h = panelEl.offsetHeight;
        // Не сохраняем нулевые/минимальные значения
        if (pos && pos.x > 0 && pos.y > 0) savePanelPos(pos.x, pos.y);
        if (w > 220 && h > 160) savePanelSize(w, h);
      }
    });
  }

  // Ждём полной загрузки страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
