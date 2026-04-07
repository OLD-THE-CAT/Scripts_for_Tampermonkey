// ==UserScript==
// @name         GAds. Чистка поисковых запросов
// @namespace    https://github.com/
// @version      1.2.0
// @description  Добавляет панель для сбора минус-слов из поисковых запросов
// @author       ИП Ульянов (Станислав)
// @match        https://ads.google.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @updateURL    добавлю потом
// @downloadURL  добавлю потом
// @icon         добавлю потом
// ==/UserScript==

(function () {
  'use strict';

  let negativeWords = []; // массив объектов { word, matchType }
  let clickHandlerAttached = false;
  let attachDebounceTimer = null;
  let panelVisible = false;
  let panelEl = null;
  let activeMatchDropdown = null;
  let matchDropdownTimer = null;
  let panelCollapsed = false;
  let collapseBtn = null;
  let activeActionTooltip = null;

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
    tooltip.className = 'gads-action-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    tooltip.style.transform = 'translateX(-50%)';

    const textEl = document.createElement('div');
    textEl.className = 'gads-action-tooltip-text';
    textEl.textContent = text;
    tooltip.appendChild(textEl);

    if (options.confirm) {
      const btnContainer = document.createElement('div');
      btnContainer.className = 'gads-action-tooltip-btns';

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
      tooltip.classList.add('gads-action-tooltip-visible');
    });

    // Автозакрытие для информационных тултипов (не confirm)
    if (!options.confirm) {
      setTimeout(closeActionTooltip, 2000);
    }
  }

  // ===================== ТИПЫ СООТВЕТСТВИЯ =====================
  function createWordItem(word) {
    const w = word.toLowerCase();
    // Одиночные слова → broad, фразы → phrase
    const matchType = w.includes(' ') ? 'phrase' : 'broad';
    return { word: w, matchType: matchType, addedAt: Date.now() };
  }

  let currentSort = 'time'; // 'time' | 'alpha'
  let alphaSortAsc = true;

  function formatMatchItem(item) {
    const w = item.word;
    if (!w) return '';
    switch (item.matchType) {
      case 'broad': return w;
      case 'phrase': return '"' + w + '"';
      case 'exact': return '[' + w + ']';
      default: return '"' + w + '"';
    }
  }

  function getDisplayWords() {
    return negativeWords.map(formatMatchItem);
  }

  // ===================== ЗАГРУЗКА ДАННЫХ (Tampermonkey хранилище) =====================
  function loadWords() {
    try {
      const stored = GM_getValue('gads_words', []);
      // Миграция: если старые данные были string[], конвертируем в objects
      if (Array.isArray(stored) && stored.length > 0 && typeof stored[0] === 'string') {
        negativeWords = stored.map(w => createWordItem(w));
      } else {
        negativeWords = stored;
      }
    } catch (e) {
      negativeWords = [];
    }
  }

  function saveWords() {
    try {
      GM_setValue('gads_words', negativeWords);
    } catch (e) {
      /* ignore */
    }
  }

  // ===================== ПОЗИЦИЯ ПАНЕЛИ =====================
  function savePanelPos(x, y) {
    try {
      // Защита: не сохраняем нулевые координаты (явно ошибка отрисовки)
      if (Math.round(x) === 0 && Math.round(y) === 0) {
        return;
      }
      GM_setValue('gads_panel_pos', { x: Math.round(x), y: Math.round(y) });
    } catch (e) { /* ignore */ }
  }

  function loadPanelPos() {
    try {
      const val = GM_getValue('gads_panel_pos', null);
      // Защита: нулевые координаты — ошибка, игнорируем
      if (val && val.x === 0 && val.y === 0) {
        GM_setValue('gads_panel_pos', null);
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
      GM_setValue('gads_panel_size', { w: Math.round(w), h: Math.round(h) });
    } catch (e) { /* ignore */ }
  }

  function loadPanelSize() {
    try {
      const val = GM_getValue('gads_panel_size', null);
      // Защита: слишком маленький размер — ошибка, игнорируем
      if (val && (val.w < 220 || val.h < 160)) {
        GM_setValue('gads_panel_size', null);
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
    panelEl.id = 'gads-cleanup-panel';

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
      <div id="gads-cleanup-header">
        <span class="gads-header-title">
          <svg class="gads-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Минус-слова
        </span>
        <div id="gads-header-btns">
          <span id="gads-cleanup-count">${negativeWords.length}</span>
          <span id="gads-sort-alpha" class="gads-sort-btn" data-tooltip="По алфавиту">A-Z</span>
          <span id="gads-sort-time" class="gads-sort-btn gads-sort-active" data-tooltip="По времени добавления">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          </span>
          <span id="gads-collapse-btn" class="gads-collapse-btn" data-tooltip="Свернуть панель">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
          </span>
        </div>
      </div>
      <div id="gads-cleanup-resize"></div>
      <div id="gads-cleanup-words-list"></div>
      <div id="gads-cleanup-actions">
        <button id="gads-copy-btn" data-tooltip="Копировать все минус-слова в буфер обмена">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          <span>Копировать</span>
        </button>
        <button id="gads-clear-btn" data-tooltip="Удалить все минус-слова из списка">
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
    if (collapseBtn) collapseBtn.style.display = 'none';
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
    if (collapseBtn) collapseBtn.style.display = 'none';
    panelVisible = false;
    panelCollapsed = false;
  }

  function checkPage() {
    const url = window.location.href;
    const isSearchTerms = url.includes('searchterms');
    const isNegative = url.includes('negative');
    if (isSearchTerms || isNegative) {
      showPanel();
    } else {
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
    const list = document.getElementById('gads-cleanup-words-list');
    if (!list) return;

    list.innerHTML = '';

    if (negativeWords.length === 0) {
      list.innerHTML = '<div class="gads-empty-msg">Кликни на слово в запросе</div>';
    } else {
      const sorted = getSortedWords();
      sorted.forEach((item) => {
        const origIndex = negativeWords.indexOf(item);
        const wordEl = document.createElement('div');
        wordEl.className = 'gads-word-item';
        wordEl.innerHTML = `
          <span class="gads-word-text">${escapeHtml(formatMatchItem(item))}</span>
          <span class="gads-match-btn" data-index="${origIndex}" data-tooltip="Тип соответствия">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </span>
          <span class="gads-word-remove" data-index="${origIndex}" data-tooltip="Удалить">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </span>
        `;
        list.appendChild(wordEl);
      });

      list.querySelectorAll('.gads-word-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          removeWord(idx);
        });
      });

      list.querySelectorAll('.gads-match-btn').forEach(btn => {
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

    const countEl = document.getElementById('gads-cleanup-count');
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
    document.querySelectorAll('.gads-sort-btn').forEach(btn => btn.classList.remove('gads-sort-active'));
    const activeBtn = document.getElementById(type === 'time' ? 'gads-sort-time' : 'gads-sort-alpha');
    if (activeBtn) activeBtn.classList.add('gads-sort-active');
    // Если алфавит — показываем направление
    if (type === 'alpha') {
      activeBtn.textContent = alphaSortAsc ? 'A↑' : 'A↓';
    } else {
      document.getElementById('gads-sort-alpha').textContent = 'A-Z';
    }
    renderWordsList();
  }

  function attachSortEvents() {
    const alphaBtn = document.getElementById('gads-sort-alpha');
    const timeBtn = document.getElementById('gads-sort-time');
    if (alphaBtn) alphaBtn.addEventListener('click', () => applySort('alpha'));
    if (timeBtn) timeBtn.addEventListener('click', () => applySort('time'));
  }

  // ===================== СВОРАЧИВАНИЕ =====================
  function createCollapseButton() {
    collapseBtn = document.createElement('button');
    collapseBtn.id = 'gads-collapsed-btn';
    collapseBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
    collapseBtn.setAttribute('data-tooltip', 'Клик — открыть панель | Зажать 300мс — перетащить');
    document.body.appendChild(collapseBtn);

    // Drag-логика с задержкой
    let dragReady = false;
    let isDragging = false;
    let dragTimer = null;
    let startX, startY, origX, origY;

    collapseBtn.addEventListener('mousedown', (e) => {
      // Начинаем отсчёт — через 300мс кнопка готова к перетаскиванию
      dragReady = false;
      dragTimer = setTimeout(() => {
        dragReady = true;
        collapseBtn.classList.add('gads-drag-ready');
      }, 300);

      startX = e.clientX;
      startY = e.clientY;
      const rect = collapseBtn.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragReady) return;

      // Первый раз при перемещении включаем isDragging
      if (!isDragging) {
        isDragging = true;
        collapseBtn.style.transition = 'none';
      }

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      collapseBtn.style.left = (origX + dx) + 'px';
      collapseBtn.style.top = (origY + dy) + 'px';
    });

    document.addEventListener('mouseup', (e) => {
      // Очищаем таймер
      if (dragTimer) {
        clearTimeout(dragTimer);
        dragTimer = null;
      }

      // Проверяем, что клик был именно по кнопке
      const clickedOnButton = collapseBtn && (e.target === collapseBtn || collapseBtn.contains(e.target));

      // Если НЕ перетаскивали и клик был по кнопке — разворачиваем панель
      if (!isDragging && clickedOnButton) {
        expandPanel();
      }

      // Сохраняем позицию
      const rect = collapseBtn.getBoundingClientRect();
      savePanelPos(rect.left, rect.top);

      // Сбрасываем состояния
      dragReady = false;
      isDragging = false;
      collapseBtn.classList.remove('gads-drag-ready');
      collapseBtn.style.transition = '';
    });

    // Восстанавливаем позицию
    const pos = loadPanelPos();
    if (pos) {
      collapseBtn.style.left = pos.x + 'px';
      collapseBtn.style.top = pos.y + 'px';
    }
  }

  function collapsePanel() {
    if (panelCollapsed || !panelEl) return;

    // Сохраняем позицию ДО скрытия
    const pos = getPanelPosition();
    const w = panelEl.offsetWidth;
    const h = panelEl.offsetHeight;

    if (pos && pos.x > 0 && pos.y > 0) savePanelPos(pos.x, pos.y);
    if (w > 220 && h > 160) savePanelSize(w, h);

    // Анимация сворачивания
    panelEl.classList.add('gads-panel-hidden');

    panelCollapsed = true;
    panelVisible = false;

    // Показываем кнопку с анимацией после начала сворачивания панели
    setTimeout(() => {
      if (!collapseBtn) createCollapseButton();
      collapseBtn.style.display = 'flex';
      collapseBtn.style.left = (pos ? pos.x : 200) + 'px';
      collapseBtn.style.top = (pos ? pos.y : 200) + 'px';
      // Запускаем анимацию появления кнопки
      requestAnimationFrame(() => {
        collapseBtn.classList.add('gads-btn-visible');
      });
    }, 100);

    // Полностью скрываем панель после анимации
    setTimeout(() => {
      panelEl.style.display = 'none';
    }, 250);
  }

  function expandPanel() {
    if (!panelCollapsed || !panelEl) return;

    // Восстанавливаем позицию из localStorage
    let pos = loadPanelPos();
    if (!pos) pos = getPanelPosition();
    if (!pos) pos = { x: window.innerWidth - 320, y: window.innerHeight - 400 };

    applyPanelPosition(pos);
    applyPanelSize();

    // Убираем скрытую кнопку с анимацией
    if (collapseBtn) {
      collapseBtn.classList.remove('gads-btn-visible');
      setTimeout(() => { collapseBtn.style.display = 'none'; }, 200);
    }

    // Показываем панель — сначала display, потом анимация
    panelEl.style.display = 'flex';
    panelCollapsed = false;
    panelVisible = true;

    // Запускаем анимацию разворачивания
    requestAnimationFrame(() => {
      panelEl.classList.remove('gads-panel-hidden');
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
    const btn = document.getElementById('gads-collapse-btn');
    if (btn) btn.addEventListener('click', collapsePanel);
  }

  function toggleMatchDropdown(index, btnEl) {
    // Закрываем предыдущий dropdown
    closeMatchDropdown();

    const item = negativeWords[index];
    if (!item) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'gads-match-dropdown';
    dropdown.dataset.index = index;

    // Позиционируем прямо над шестерёнкой, выровнено по левому краю
    const btnRect = btnEl.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.left = (btnRect.left - 100 + 14) + 'px'; // сдвигаем влево (ширина меню ~120px, кнопка ~14px)
    dropdown.style.top = (btnRect.top - 4) + 'px';
    dropdown.style.transform = 'translateY(-100%)';
    dropdown.style.zIndex = '999999';

    const types = [
      { key: 'broad', label: 'Широкое' },
      { key: 'phrase', label: 'Фразовое' },
      { key: 'exact', label: 'Точное' }
    ];

    types.forEach(t => {
      const opt = document.createElement('div');
      opt.className = 'gads-match-option';
      if (item.matchType === t.key) opt.classList.add('gads-match-active');
      opt.textContent = t.label;
      opt.dataset.type = t.key;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        updateMatchType(index, t.key);
        closeMatchDropdown();
      });
      dropdown.appendChild(opt);
    });

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

  function updateMatchType(index, type) {
    if (negativeWords[index]) {
      negativeWords[index].matchType = type;
      saveWords();
      renderWordsList();
    }
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

    document.querySelectorAll('.gads-clickable-word').forEach(wordEl => {
      const word = wordEl.dataset.word;
      if (!word) return;
      const normalized = word.toLowerCase();

      wordEl.classList.remove('gads-word-already-added');
      wordEl.classList.remove('gads-phrase-highlighted');
      wordEl.classList.remove('gads-word-double');

      if (singleWords.has(normalized)) {
        wordEl.classList.add('gads-word-already-added');
        if (doubleWords.has(normalized)) {
          wordEl.classList.add('gads-word-double');
        }
        return;
      }
    });

    // Для фраз — ищем точные совпадения последовательности слов
    phrases.forEach(phrase => {
      const phraseWordsArr = phrase.split(/\s+/);
      const phraseLen = phraseWordsArr.length;

      document.querySelectorAll('text-field .gads-clickable-word').forEach(startSpan => {
        const parent = startSpan.parentElement;
        const allSpans = parent.querySelectorAll('.gads-clickable-word');
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
            spansArr[startIdx + i].classList.add('gads-phrase-highlighted');
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
    negativeWords.splice(index, 1);
    saveWords();
    renderWordsList();
    applyHighlightToExisting();
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
      const btn = document.getElementById('gads-clear-btn');
      showActionTooltip(btn, 'Список пуст');
      return;
    }
    const btn = document.getElementById('gads-clear-btn');
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
      const btn = document.getElementById('gads-copy-btn');
      showActionTooltip(btn, 'Список пуст, нечего копировать');
      return;
    }
    const text = negativeWords.map(formatMatchItem).join('\n');
    if (typeof GM_setClipboard !== 'undefined') {
      GM_setClipboard(text, 'text');
    } else {
      navigator.clipboard.writeText(text);
    }
    const btn = document.getElementById('gads-copy-btn');
    showActionTooltip(btn, 'Скопировано в буфер');
  }

  // ===================== ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ =====================
  function flashWord(word) {
    // Кратковременная подсветка в панели
    const list = document.getElementById('gads-cleanup-words-list');
    const lastItem = list?.lastElementChild;
    if (lastItem) {
      lastItem.classList.add('gads-word-item-added');
      setTimeout(() => lastItem.classList.remove('gads-word-item-added'), 800);
    }
  }

  // ===================== DRAG =====================
  function initDrag(panel) {
    const header = document.getElementById('gads-cleanup-header');
    let isDragging = false;
    let startX, startY, origX, origY;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('gads-word-remove')) return;
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
      isDragging = false;
      // Сохраняем финальную позицию
      const rect = panel.getBoundingClientRect();
      savePanelPos(rect.left, rect.top);
    });
  }

  // ===================== RESIZE =====================
  function initResize(panel) {
    const handle = document.getElementById('gads-cleanup-resize');
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
      isResizing = false;
      // Сохраняем финальный размер
      savePanelSize(panel.offsetWidth, panel.offsetHeight);
    });
  }

  // ===================== ОБРАБОТКА КЛИКОВ ПО СЛОВАМ =====================
  function initWordClicks() {
    // Наблюдатель за изменениями DOM (Google Ads — SPA)
    const observer = new MutationObserver(() => {
      if (attachDebounceTimer) clearTimeout(attachDebounceTimer);
      attachDebounceTimer = setTimeout(() => {
        attachWordClickHandlers();
        // Обновляем подсветку при появлении новых строк
        if (panelVisible) applyHighlightToExisting();
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
    // Не обрабатываем, если панель не видна
    if (!panelVisible) return;

    // Ищем ячейки с поисковыми запросами: ess-cell[essfield="query"] > text-field
    const queryCells = document.querySelectorAll('ess-cell[essfield="query"] > text-field');

    queryCells.forEach(textField => {
      if (textField.dataset.gadsWordHandler) return;

      // Получаем текст из text-field (это просто текстовый узел)
      const rawText = extractTextFromTextField(textField);
      if (!rawText || rawText.length < 2 || rawText.length > 500) return;

      // Разбиваем на слова
      const words = rawText.trim().split(/\s+/);
      if (words.length === 0) return;

      // Очищаем text-field и вставляем кликабельные слова
      textField.innerHTML = '';

      words.forEach((w, i) => {
        if (!w.trim()) return;
        const span = document.createElement('span');
        span.className = 'gads-clickable-word';
        span.dataset.word = w;
        span.dataset.wordIndex = i;
        span.textContent = w;
        span.title = 'Клик — минус-слово | Drag — выделить фразу';

        // Подсветка, если слово уже в списке
        if (negativeWords.includes(w.toLowerCase())) {
          span.classList.add('gads-word-already-added');
        }

        textField.appendChild(span);

        // Добавляем пробел между словами (кроме последнего)
        if (i < words.length - 1) {
          textField.appendChild(document.createTextNode(' '));
        }
      });

      textField.dataset.gadsWordHandler = 'true';
    });

    // Делегирование событий: обработчик клика на document
    if (!clickHandlerAttached) {
      clickHandlerAttached = true;

      // --- mousedown: начало выделения ---
      document.addEventListener('mousedown', (e) => {
        const wordEl = e.target.closest('.gads-clickable-word');
        if (!wordEl) return;

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
        const wordEl = e.target.closest('.gads-clickable-word');
        if (!wordEl || wordEl.parentElement !== selectTextField) return;

        // Подсвечиваем диапазон
        highlightRange(selectStartIndex, parseInt(wordEl.dataset.wordIndex, 10));
      }, true);

      // --- mouseup: завершение выделения ---
      document.addEventListener('mouseup', (e) => {
        if (!isSelecting) return;
        isSelecting = false;

        const targetEl = e.target.closest('.gads-clickable-word');
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
            targetEl.classList.remove('gads-word-already-added');
          } else {
            const added = addWord(word);
            if (added) {
              targetEl.classList.add('gads-word-added');
              setTimeout(() => targetEl.classList.remove('gads-word-added'), 500);
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
    }
  }

  /**
   * Подсвечивает диапазон слов при drag-выделении
   */
  function highlightRange(startIdx, endIdx) {
    clearDragSelection();
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    selectTextField.querySelectorAll('.gads-clickable-word').forEach(span => {
      const idx = parseInt(span.dataset.wordIndex, 10);
      if (idx >= min && idx <= max) {
        span.classList.add('gads-word-drag-selected');
      }
    });
  }

  /**
   * Убирает drag-выделение
   */
  function clearDragSelection() {
    document.querySelectorAll('.gads-word-drag-selected').forEach(el => {
      el.classList.remove('gads-word-drag-selected');
    });
  }

  /**
   * Собирает фразу из диапазона слов
   */
  function collectPhrase(startIdx, endIdx) {
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    const words = [];
    selectTextField.querySelectorAll('.gads-clickable-word').forEach(span => {
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
    selectTextField.querySelectorAll('.gads-clickable-word').forEach(span => {
      const idx = parseInt(span.dataset.wordIndex, 10);
      if (idx >= min && idx <= max) {
        span.classList.add('gads-phrase-added');
        setTimeout(() => span.classList.remove('gads-phrase-added'), 600);
      }
    });
  }

  /**
   * Извлекает текст из text-field, игнорируя HTML-комментарии и пустые узлы
   */
  function extractTextFromTextField(textField) {
    let text = '';
    textField.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    });
    return text.trim();
  }

  function escapeAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ===================== КНОПКИ =====================
  function attachButtonEvents() {
    const copyBtn = document.getElementById('gads-copy-btn');
    const clearBtn = document.getElementById('gads-clear-btn');

    if (copyBtn) copyBtn.addEventListener('click', copyAllWords);
    if (clearBtn) clearBtn.addEventListener('click', clearAllWords);
  }

  // ===================== СТИЛИ =====================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ===== Панель — Material Design 3 ===== */
      #gads-cleanup-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 380px;
        min-width: 220px;
        min-height: 160px;
        background: #ffffff;
        color: #202124;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        z-index: 100000;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        font-size: 13px;
        overflow: visible;
        border: 1px solid #e0e0e0;
        /* Анимация сворачивания/разворачивания */
        transform-origin: top right;
        transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Свёрнутое состояние */
      #gads-cleanup-panel.gads-panel-hidden {
        transform: scale(0.92);
        opacity: 0;
        pointer-events: none;
      }

      /* Развёрнутое состояние (по умолчанию) */
      #gads-cleanup-panel:not(.gads-panel-hidden) {
        transform: scale(1);
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
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
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
      .gads-action-tooltip {
        background: #3c4043;
        color: #ffffff;
        font-size: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        z-index: 999999;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        pointer-events: auto;
        opacity: 0;
        transform: translateX(-50%) translateY(4px);
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 240px;
        text-align: center;
      }

      .gads-action-tooltip.gads-action-tooltip-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .gads-action-tooltip-text {
        line-height: 1.4;
        margin-bottom: 0;
      }

      .gads-action-tooltip-btns {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.15);
      }

      .gads-action-tooltip-btns button {
        padding: 4px 14px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        transition: background 0.15s;
      }

      .gads-action-tooltip-btns button:first-child {
        background: rgba(255,255,255,0.1);
        color: #dadce0;
      }

      .gads-action-tooltip-btns button:first-child:hover {
        background: rgba(255,255,255,0.2);
      }

      .gads-action-tooltip-btns button:last-child {
        background: #1a73e8;
        color: #ffffff;
      }

      .gads-action-tooltip-btns button:last-child:hover {
        background: #1557b0;
      }

      /* ===== Шапка ===== */
      #gads-cleanup-header {
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

      .gads-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }

      .gads-icon {
        fill: #5f6368;
        flex-shrink: 0;
      }

      /* ===== Группа кнопок в шапке ===== */
      #gads-header-btns {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
      }

      /* ===== Кнопки сортировки ===== */
      .gads-sort-btn {
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
      }

      .gads-sort-btn svg {
        fill: #5f6368;
      }

      .gads-sort-btn:hover {
        background: #f1f3f4;
        border-color: #bdc1c6;
      }

      .gads-sort-btn.gads-sort-active {
        background: #e8f0fe;
        border-color: #aecbfa;
        color: #1a73e8;
      }

      .gads-sort-btn.gads-sort-active svg {
        fill: #1a73e8;
      }

      /* ===== Кнопка сворачивания ===== */
      .gads-collapse-btn {
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
      }

      .gads-collapse-btn svg {
        fill: #5f6368;
        transition: transform 0.2s;
      }

      .gads-collapse-btn:hover {
        background: #e8eaed;
      }

      .gads-collapse-btn:hover svg {
        transform: rotate(180deg);
      }

      /* ===== Счётчик ===== */
      #gads-cleanup-count {
        background: #1a73e8;
        color: white;
        border-radius: 10px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        padding: 0 5px;
        margin-right: 2px;
        flex-shrink: 0;
      }

      /* ===== Resize handle ===== */
      #gads-cleanup-resize {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 14px;
        height: 14px;
        cursor: nwse-resize;
        opacity: 0.4;
      }

      #gads-cleanup-resize::after {
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
      #gads-cleanup-words-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px 0;
        min-width: 0;
      }

      #gads-cleanup-words-list::-webkit-scrollbar {
        width: 6px;
      }

      #gads-cleanup-words-list::-webkit-scrollbar-thumb {
        background: #dadce0;
        border-radius: 3px;
      }

      #gads-cleanup-words-list::-webkit-scrollbar-thumb:hover {
        background: #bdc1c6;
      }

      .gads-word-item {
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

      .gads-word-item:hover {
        background: #f1f3f4;
      }

      .gads-word-item-added {
        background: #e8f0fe;
        animation: gads-flash 0.8s ease;
      }

      @keyframes gads-flash {
        0% { background: #d2e3fc; }
        100% { background: #ffffff; }
      }

      .gads-word-text {
        word-break: break-word;
        flex: 1;
        font-size: 13px;
        color: #202124;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
      }

      /* ===== Шестерёнка типа соответствия ===== */
      .gads-match-btn {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s;
        user-select: none;
        display: flex;
        align-items: center;
        opacity: 0.4;
      }

      .gads-match-btn svg {
        fill: #5f6368;
      }

      .gads-match-btn:hover {
        opacity: 1;
        background: #e8eaed;
      }

      /* ===== Выпадающее меню типа соответствия ===== */
      .gads-match-dropdown {
        background: #ffffff;
        border: 1px solid #dadce0;
        border-radius: 8px;
        padding: 4px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        min-width: 120px;
      }

      .gads-match-option {
        padding: 8px 14px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.1s;
        white-space: nowrap;
        color: #5f6368;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
      }

      .gads-match-option:hover {
        background: #f1f3f4;
      }

      .gads-match-option.gads-match-active {
        background: #e8f0fe;
        color: #1a73e8;
        font-weight: 500;
      }

      .gads-match-option.gads-match-active::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #1a73e8;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: middle;
      }

      .gads-match-option:not(.gads-match-active)::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1.5px solid #dadce0;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: middle;
      }

      /* ===== Кнопка удаления ===== */
      .gads-word-remove {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        margin-left: 2px;
        opacity: 0.4;
      }

      .gads-word-remove svg {
        fill: #5f6368;
      }

      .gads-word-remove:hover {
        opacity: 1;
        background: #fce8e6;
      }

      .gads-word-remove:hover svg {
        fill: #d93025;
      }

      /* ===== Пустое сообщение ===== */
      .gads-empty-msg {
        text-align: center;
        color: #9aa0a6;
        padding: 30px 16px;
        font-style: normal;
        font-size: 13px;
      }

      /* ===== Кнопки действий ===== */
      #gads-cleanup-actions {
        display: flex;
        gap: 8px;
        padding: 10px 16px;
        border-top: 1px solid #e0e0e0;
        background: #f8f9fa;
        border-radius: 0 0 12px 12px;
      }

      #gads-cleanup-actions button {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #dadce0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        transition: all 0.15s;
        background: #ffffff;
        color: #3c4043;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      #gads-cleanup-actions button svg {
        fill: #5f6368;
      }

      #gads-cleanup-actions button:hover {
        background: #f1f3f4;
        border-color: #bdc1c6;
      }

      #gads-clear-btn:hover {
        background: #fce8e6;
        border-color: #f5c6c2;
        color: #d93025;
      }

      #gads-clear-btn:hover svg {
        fill: #d93025;
      }

      /* ===== Свёрнутая кнопка панели ===== */
      #gads-collapsed-btn {
        position: fixed;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: #1a73e8;
        border: none;
        color: #ffffff;
        cursor: pointer;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3), 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.2s;
        user-select: none;
        /* Анимация появления */
        transform: scale(0.8);
        opacity: 0;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    background 0.2s, box-shadow 0.2s;
      }

      #gads-collapsed-btn.gads-btn-visible {
        transform: scale(1);
        opacity: 1;
      }

      #gads-collapsed-btn svg {
        fill: #ffffff;
      }

      #gads-collapsed-btn:hover {
        background: #1557b0;
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4), 0 6px 16px rgba(0,0,0,0.2);
        transform: scale(1.08);
      }

      /* Визуальный эффект — готова к перетаскиванию */
      #gads-collapsed-btn.gads-drag-ready {
        cursor: grab;
        border: 2px solid #ffffff;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3), 0 4px 16px rgba(26, 115, 232, 0.5);
        animation: gads-drag-pulse 0.6s ease infinite;
      }

      #gads-collapsed-btn.gads-drag-ready svg {
        fill: #ffffff;
      }

      #gads-collapsed-btn.gads-drag-ready:active {
        cursor: grabbing;
      }

      @keyframes gads-drag-pulse {
        0% { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(26, 115, 232, 0.4); transform: scale(1); }
        50% { box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.4), 0 6px 18px rgba(26, 115, 232, 0.6); transform: scale(1.06); }
        100% { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(26, 115, 232, 0.4); transform: scale(1); }
      }

      /* ===== Кликабельные слова в таблице ===== */
      .gads-clickable-word {
        display: inline;
        padding: 1px 2px;
        margin: 0;
        border-radius: 3px;
        transition: all 0.15s;
        cursor: pointer;
        user-select: none;
      }

      .gads-clickable-word:hover {
        background: rgba(26, 115, 232, 0.08);
      }

      .gads-word-already-added {
        cursor: pointer;
      }

      .gads-clickable-word:active {
        background: #1a73e8;
        color: white;
      }

      .gads-word-added {
        background: #d93025 !important;
        color: white !important;
      }

      /* ===== Уже добавленные минус-слова ===== */
      .gads-word-already-added {
        background: rgba(217, 48, 37, 0.08);
        color: #c5221f;
        font-weight: 500;
      }

      .gads-word-already-added:hover {
        background: rgba(217, 48, 37, 0.14);
      }

      /* ===== Слово есть и отдельно, и в фразе — рамка ===== */
      .gads-word-double {
        outline: 2px solid #d93025;
        outline-offset: 1px;
      }

      /* ===== Drag-выделение (при перетаскивании) ===== */
      .gads-word-drag-selected {
        background: rgba(255, 152, 0, 0.2) !important;
        color: #e65100 !important;
        border-radius: 3px;
      }

      /* ===== Фразы в таблице ===== */
      .gads-phrase-highlighted {
        background: rgba(255, 152, 0, 0.1);
        color: #e65100;
        font-weight: 500;
      }

      .gads-phrase-highlighted:hover {
        background: rgba(255, 152, 0, 0.18);
      }

      /* ===== Flash при добавлении фразы ===== */
      .gads-phrase-added {
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

    // Дополнительная проверка через MutationObserver (на случай если Google Ads меняет URL иначе)
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
