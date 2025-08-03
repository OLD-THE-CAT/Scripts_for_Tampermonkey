// ==UserScript==
// @name         YDirect. Проставляем прогноз ставок автоматически
// @namespace    http://tampermonkey.net/
// @version      3.7.1
// @description  Автоматизация проставления прогноза трафика с поддержкой нового интерфейса Яндекс.Директ
// @author       ИП Ульянов (Станислав)
// @match        https://direct.yandex.ru/*
// @match        https://direct.yandex.kz/*

// @icon         data:image/png;base64,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
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ✅ ЗАГРУЖАЕМ СТИЛИ СРАЗУ ПРИ ЗАПУСКЕ СКРИПТА
    (function loadStyles() {
        if (document.getElementById('yandex-2025-styles')) return;

        const style = document.createElement('style');
        style.id = 'yandex-2025-styles';
        style.textContent = `
            @keyframes yandex-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes yandex-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.01); opacity: 0.92; }
            }
            .yandex-progress-text {
                animation: yandex-pulse 2.2s ease-in-out infinite;
            }
            .yandex-button {
                font-family: YS Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                font-size: 14px;
                font-weight: 500;
                border-radius: 8px;
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.15s ease-out;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                position: relative;
                overflow: visible;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                vertical-align: middle;
            }
            .yandex-button:hover {
                transform: translateY(-1px);
            }
            .yandex-button:active {
                transform: translateY(0);
            }
            .yandex-input {
                font-family: YS Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                font-size: 14px;
                font-weight: 400;
                border-radius: 6px;
                border: 1px solid #d1d5db;
                background: #ffffff;
                color: #374151;
                transition: all 0.15s ease-out;
                outline: none;
            }
            .yandex-input:focus {
                border-color: #2563EB;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
            }
            .yandex-input:hover:not(:focus) {
                border-color: #9ca3af;
            }
            .yandex-settings-popup {
                position: fixed !important;
                background: #ffffff !important;
                border: 2px solid #2563EB !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3) !important;
                padding: 20px !important;
                z-index: 999999 !important;
                font-family: YS Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif !important;
                width: 300px !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                transform: none !important;
                pointer-events: auto !important;
            }
            .yandex-settings-title {
                font-size: 16px !important;
                font-weight: 600 !important;
                color: #1e40af !important;
                margin-bottom: 16px !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }
            .yandex-toggle {
                position: relative !important;
                width: 50px !important;
                height: 28px !important;
                background: #d1d5db !important;
                border-radius: 14px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                flex-shrink: 0 !important;
            }
            .yandex-toggle.active {
                background: #2563EB !important;
            }
            .yandex-toggle-handle {
                position: absolute !important;
                top: 2px !important;
                left: 2px !important;
                width: 24px !important;
                height: 24px !important;
                background: #ffffff !important;
                border-radius: 12px !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            }
            .yandex-toggle.active .yandex-toggle-handle {
                transform: translateX(22px) !important;
            }
            .yandex-range-inputs {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                justify-content: space-between !important;
                margin-top: 12px !important;
            }
            .yandex-range-input {
                width: 70px !important;
                height: 36px !important;
                padding: 0 10px !important;
                text-align: center !important;
                border: 1px solid #d1d5db !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                transition: all 0.15s ease !important;
            }
            .yandex-range-input:focus {
                border-color: #2563EB !important;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
                outline: none !important;
            }
            @keyframes slide-in-notification {
                0% { transform: translateX(100%) scale(0.95); opacity: 0; }
                100% { transform: translateX(0) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    })();

    let AUTO_PROGNOZ_VALUE = '85';
    const STEP_DELAY = 300;
    const SCROLL_DELAY = 350;
    const MICRO_SCROLL_STEP = 50;
    const STUCK_DETECTION_TIME = 15000;
    const POPUP_WAIT = 800;
    const POPUP_READY_DELAY = 500;
    const SAVE_WAIT = 1200;
    const RECHECK_DELAY = 1500;

    // ✅ ЕДИНСТВЕННОЕ УСЛОВИЕ ВЫХОДА - таймер активности
    const TABLE_FINISH_TIMEOUT = 15000; // 15 секунд без активности

    let stopFlag = false;
    let buttonsAdded = false;
    let isProcessing = false;
    let progressIndicator = null;
    let currentPopup = null; // ✅ Отслеживание текущего popup

    // ✅ НОВЫЕ ПЕРЕМЕННЫЕ для диапазонного режима
    let rangeMode = false;
    let rangeMin = 75;
    let rangeMax = 100;

    let lastVisibleRowIds = [];
    let lastRowChangeTime = Date.now();
    let maxSeenIndex = 0;
    let lastNewRowTimestamp = Date.now(); // Время последней активности скрипта

    // ✅ ФУНКЦИЯ сброса таймера при любой активности
    function resetTableTimer() {
        lastNewRowTimestamp = Date.now();
        console.log(`⏰ Таймер завершения таблицы сброшен (max index: ${maxSeenIndex})`);
    }

    // ✅ ФУНКЦИЯ сохранения настроек в localStorage
    function saveSettings() {
        const settings = {
            rangeMode: rangeMode,
            rangeMin: rangeMin,
            rangeMax: rangeMax,
            targetValue: AUTO_PROGNOZ_VALUE
        };
        localStorage.setItem('yandex-prognoz-settings', JSON.stringify(settings));
        console.log('💾 Настройки сохранены:', settings);
    }

    // ✅ ФУНКЦИЯ загрузки настроек из localStorage
    function loadSettings() {
        try {
            const saved = localStorage.getItem('yandex-prognoz-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                rangeMode = settings.rangeMode || false;
                rangeMin = settings.rangeMin || 75;
                rangeMax = settings.rangeMax || 100;
                AUTO_PROGNOZ_VALUE = settings.targetValue || '85';
                console.log('📁 Настройки загружены:', settings);
            }
        } catch (e) {
            console.log('❌ Ошибка загрузки настроек:', e);
        }
    }

    // ✅ ФУНКЦИЯ создания индикатора состояния диапазонного режима
    function createRangeModeIndicator() {
        let indicator = document.getElementById('range-mode-indicator');
        if (indicator) {
            indicator.remove();
        }

        indicator = document.createElement('div');
        indicator.id = 'range-mode-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease-out;
            z-index: 1000;
            pointer-events: none;
        `;

        updateRangeModeIndicator(indicator);
        return indicator;
    }

    // ✅ ФУНКЦИЯ обновления цвета индикатора
    function updateRangeModeIndicator(indicator = null) {
        if (!indicator) {
            indicator = document.getElementById('range-mode-indicator');
        }

        if (indicator) {
            if (rangeMode) {
                indicator.style.background = '#2563EB';
                indicator.title = `Диапазонный режим включен (${rangeMin}-${rangeMax})`;
            } else {
                indicator.style.background = '#dc2626';
                indicator.title = 'Диапазонный режим выключен';
            }
        }
    }

    // ✅ ФУНКЦИЯ проверки нужно ли изменять прогноз
    function shouldUpdatePrognosis(currentValue, targetValue) {
        const current = parseInt(currentValue);
        const target = parseInt(targetValue);

        if (isNaN(current) || isNaN(target)) return true;

        if (rangeMode) {
            // В диапазонном режиме проверяем, попадает ли текущее значение в диапазон
            const inRange = current >= rangeMin && current <= rangeMax;
            if (inRange) {
                console.log(`📊 Значение ${current} в диапазоне [${rangeMin}-${rangeMax}], не изменяем`);
                return false; // Не нужно изменять
            }
        }

        // Обычная проверка или значение вне диапазона
        return current !== target;
    }

    // ✅ ОБНОВЛЕННАЯ ФУНКЦИЯ создания popup БЕЗ кнопки закрытия
    function showSettingsPopup(buttonElement) {
        console.log('🔧 Показываем popup настроек');

        // Закрываем существующий popup если есть
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
            console.log('❌ Закрыли существующий popup');
            return; // ✅ Выходим, если popup уже был открыт (переключение)
        }

        // Получаем позицию кнопки
        const buttonRect = buttonElement.getBoundingClientRect();
        console.log('📍 Позиция кнопки:', buttonRect);

        // Создаем popup
        const popup = document.createElement('div');
        popup.className = 'yandex-settings-popup';
        popup.id = 'yandex-settings-popup';

        // ✅ ПРИНУДИТЕЛЬНОЕ позиционирование с важными стилями
        const popupLeft = Math.max(10, buttonRect.right - 300);
        const popupTop = buttonRect.bottom + 10;

        popup.style.cssText = `
            position: fixed !important;
            left: ${popupLeft}px !important;
            top: ${popupTop}px !important;
            background: #ffffff !important;
            border: 2px solid #2563EB !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3) !important;
            padding: 20px !important;
            z-index: 999999 !important;
            width: 300px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: YS Text, Arial, sans-serif !important;
        `;

        // ✅ ОБНОВЛЕННЫЙ HTML БЕЗ кнопки закрытия и С иконкой шестеренки
        popup.innerHTML = `
            <div class="yandex-settings-title">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.373 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                </svg>
                <span style="flex: 1;">Диапазонный режим</span>
                <div class="yandex-toggle ${rangeMode ? 'active' : ''}" id="range-mode-toggle">
                    <div class="yandex-toggle-handle"></div>
                </div>
            </div>

            <div class="yandex-range-inputs">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">От</span>
                <input type="number" class="yandex-range-input" id="range-min" value="${rangeMin}" min="1" max="999">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">До</span>
                <input type="number" class="yandex-range-input" id="range-max" value="${rangeMax}" min="1" max="999">
            </div>
        `;

        // ✅ Добавляем в body (не в контейнер!)
        document.body.appendChild(popup);
        currentPopup = popup;

        console.log('✅ Popup добавлен в DOM, позиция:', `left: ${popupLeft}px, top: ${popupTop}px`);

        // ✅ ОБРАБОТЧИКИ СОБЫТИЙ (БЕЗ кнопки закрытия)

        // Переключатель режима
        const toggle = popup.querySelector('#range-mode-toggle');
        if (toggle) {
            toggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                rangeMode = !rangeMode;
                toggle.className = `yandex-toggle ${rangeMode ? 'active' : ''}`;
                saveSettings();
                updateRangeModeIndicator();
                console.log(`🎛️ Диапазонный режим: ${rangeMode ? 'ВКЛ' : 'ВЫКЛ'}`);
            };
        }

        // Поля ввода диапазона
        const minInput = popup.querySelector('#range-min');
        const maxInput = popup.querySelector('#range-max');

        if (minInput) {
            minInput.onchange = function() {
                const newMin = parseInt(this.value) || 75;
                if (newMin >= rangeMax) {
                    rangeMin = rangeMax - 1;
                    this.value = rangeMin;
                } else {
                    rangeMin = newMin;
                }
                saveSettings();
                updateRangeModeIndicator();
                console.log(`📊 Минимум диапазона: ${rangeMin}`);
            };
        }

        if (maxInput) {
            maxInput.onchange = function() {
                const newMax = parseInt(this.value) || 100;
                if (newMax <= rangeMin) {
                    rangeMax = rangeMin + 1;
                    this.value = rangeMax;
                } else {
                    rangeMax = newMax;
                }
                saveSettings();
                updateRangeModeIndicator();
                console.log(`📊 Максимум диапазона: ${rangeMax}`);
            };
        }

        // Предотвращаем закрытие при клике внутри popup
        popup.onclick = function(e) {
            e.stopPropagation();
        };

        console.log('🎯 Popup готов к использованию');
    }

    // Индикатор прогресса БЕЗ РАМКИ
    function createProgressIndicator() {
        if (progressIndicator) return;

        progressIndicator = document.createElement('div');
        progressIndicator.id = 'yandex-progress';
        progressIndicator.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-left: 12px;
            padding: 6px 12px;
            background: rgba(37, 99, 235, 0.05);
            border-radius: 8px;
            font-family: YS Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
            font-size: 13px;
            font-weight: 400;
            color: #1e40af;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.15s ease-out;
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 14px;
            height: 14px;
            border: 2px solid rgba(37, 99, 235, 0.2);
            border-top: 2px solid #2563EB;
            border-radius: 50%;
            animation: yandex-spin 1s linear infinite;
        `;

        const statusText = document.createElement('span');
        statusText.className = 'yandex-progress-text';
        statusText.textContent = 'Инициализация...';

        progressIndicator.appendChild(spinner);
        progressIndicator.appendChild(statusText);

        return progressIndicator;
    }

    function updateProgress(status, details = '') {
        if (!progressIndicator) return;

        const statusText = progressIndicator.querySelector('.yandex-progress-text');
        if (statusText) {
            statusText.textContent = details ? `${status} ${details}` : status;
        }

        progressIndicator.style.opacity = '1';
        progressIndicator.style.transform = 'scale(1)';
    }

    function hideProgress() {
        if (progressIndicator) {
            progressIndicator.style.opacity = '0';
            progressIndicator.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (progressIndicator && progressIndicator.parentNode) {
                    progressIndicator.parentNode.removeChild(progressIndicator);
                    progressIndicator = null;
                }
            }, 150);
        }
    }

    // Функция для обновления главной кнопки между состояниями
    function updateMainButton(isRunning) {
        const btn = document.getElementById('yandex-prognoz-main');
        if (!btn) return;

        if (isRunning) {
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="4" y="4" width="8" height="8" rx="1"/>
                </svg>
                Остановить
            `;
            btn.style.background = '#ffffff';
            btn.style.color = '#d63638';
            btn.style.borderColor = '#d63638';

            btn.onmouseover = () => {
                btn.style.background = '#fff5f5';
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 2px 8px rgba(214, 54, 56, 0.2)';
            };
            btn.onmouseout = () => {
                btn.style.background = '#ffffff';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            };

            btn.onclick = function() {
                stopFlag = true;
                isProcessing = false;
                updateProgress('Остановлено');
                setTimeout(() => {
                    hideProgress();
                    updateMainButton(false);
                }, 2000);
            };
        } else {
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 50 50" style="margin-right: 6px;">
                    <polygon points="15,10 40,25 15,40" fill="currentColor" />
                </svg>
                Проставить прогноз
            `;
            btn.style.background = '#2563EB';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#2563EB';

            btn.onmouseover = () => {
                btn.style.background = '#1d4ed8';
                btn.style.borderColor = '#1d4ed8';
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
            };
            btn.onmouseout = () => {
                btn.style.background = '#2563EB';
                btn.style.borderColor = '#2563EB';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            };

            btn.onclick = function() {
                const inputField = document.getElementById('yandex-prognoz-input');
                AUTO_PROGNOZ_VALUE = inputField.value || '85';
                stopFlag = false;
                lastVisibleRowIds = [];
                lastRowChangeTime = Date.now();
                maxSeenIndex = 0;
                resetTableTimer(); // ✅ Сброс при старте
                updateMainButton(true);
                autoPrognosisAll();
            };
        }
    }

    function addButtons() {
        if (!window.location.href.includes('phrases')) {
            const container = document.getElementById('yandex-prognoz-container');
            if (container) container.remove();
            buttonsAdded = false;
            return;
        }

        if (buttonsAdded) {
            // ✅ Проверяем и обновляем индикатор при каждом вызове
            updateRangeModeIndicator();
            return;
        }

        // ✅ ПОИСК МЕСТА ДЛЯ РАЗМЕЩЕНИЯ КНОПОК
        const usersProfileButton = document.querySelector('[data-key="usersProfile"][title="Профили пользователей"]');

        let targetElement = null;

        if (usersProfileButton) {
            targetElement = usersProfileButton.parentElement || usersProfileButton;
            console.log('✅ Найдена кнопка "Профили пользователей", размещаем элементы управления рядом');
        } else {
            const menu = document.querySelector('.grid-header-menu, .grid-header-menu__content_portal, [class*="header-menu"]');
            if (menu) {
                targetElement = menu;
                console.log('✅ Используем fallback - размещение в меню шапки таблицы');
            }
        }

        if (!targetElement) {
            console.log('❌ Не найдено подходящее место для размещения кнопок');
            return;
        }

        let btnContainer = document.getElementById('yandex-prognoz-container');
        if (!btnContainer) {
            btnContainer = document.createElement('div');
            btnContainer.id = 'yandex-prognoz-container';
            btnContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-left: 16px;
                position: relative;
            `;

            // Размещаем контейнер после найденного элемента
            if (usersProfileButton) {
                const parentContainer = usersProfileButton.closest('[class*="menu"], [class*="toolbar"], [class*="header"]') || usersProfileButton.parentElement;
                if (parentContainer && parentContainer.parentElement) {
                    parentContainer.parentElement.insertBefore(btnContainer, parentContainer.nextSibling);
                } else {
                    targetElement.appendChild(btnContainer);
                }
            } else {
                targetElement.appendChild(btnContainer);
            }
        }

        let inputField = document.getElementById('yandex-prognoz-input');
        if (!inputField) {
            inputField = document.createElement('input');
            inputField.id = 'yandex-prognoz-input';
            inputField.type = 'text';
            inputField.value = AUTO_PROGNOZ_VALUE;
            inputField.placeholder = '85';
            inputField.className = 'yandex-input';
            inputField.style.cssText = `
                width: 60px;
                height: 32px;
                padding: 0 8px;
                text-align: center;
                font-weight: 400;
            `;

            inputField.onchange = (e) => {
                AUTO_PROGNOZ_VALUE = e.target.value;
                saveSettings();
            };

            btnContainer.appendChild(inputField);
        }

        let mainBtn = document.getElementById('yandex-prognoz-main');
        if (!mainBtn) {
            mainBtn = document.createElement('button');
            mainBtn.id = 'yandex-prognoz-main';
            mainBtn.className = 'yandex-button';
            mainBtn.style.cssText = `
                height: 32px;
                padding: 0 14px;
                border: 1px solid transparent;
            `;

            btnContainer.appendChild(mainBtn);
            updateMainButton(false);
        }

        // ✅ КНОПКА НАСТРОЕК (шестеренка) с ПЕРЕКЛЮЧЕНИЕМ popup
        let settingsBtn = document.getElementById('yandex-prognoz-settings');
        if (!settingsBtn) {
            settingsBtn = document.createElement('button');
            settingsBtn.id = 'yandex-prognoz-settings';
            settingsBtn.className = 'yandex-button';
            settingsBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                </svg>
            `;
            settingsBtn.style.cssText = `
                height: 32px;
                width: 32px;
                padding: 0;
                border: 1px solid #d1d5db;
                background: #ffffff;
                color: #6b7280;
                position: relative;
                overflow: visible;
            `;

            // ✅ Добавляем индикатор
            const indicator = createRangeModeIndicator();
            settingsBtn.appendChild(indicator);

            settingsBtn.onmouseover = () => {
                settingsBtn.style.background = '#f9fafb';
                settingsBtn.style.borderColor = '#2563EB';
                settingsBtn.style.color = '#2563EB';
                settingsBtn.style.transform = 'translateY(-1px)';
            };
            settingsBtn.onmouseout = () => {
                settingsBtn.style.background = '#ffffff';
                settingsBtn.style.borderColor = '#d1d5db';
                settingsBtn.style.color = '#6b7280';
                settingsBtn.style.transform = 'translateY(0)';
            };

            // ✅ ОБРАБОТЧИК клика - ПЕРЕКЛЮЧЕНИЕ popup
            settingsBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('🎯 Клик по кнопке настроек');
                showSettingsPopup(settingsBtn); // ✅ Функция сама проверит, нужно открыть или закрыть
            };

            btnContainer.appendChild(settingsBtn);
        }

        buttonsAdded = true;
    }

    // ✅ ПРОСТОЕ ЗАКРЫТИЕ popup при клике вне его (БЕЗ изменений)
    document.addEventListener('click', function(e) {
        if (currentPopup && !currentPopup.contains(e.target)) {
            const settingsBtn = document.getElementById('yandex-prognoz-settings');
            if (settingsBtn && !settingsBtn.contains(e.target)) {
                console.log('👆 Клик вне popup - закрываем');
                currentPopup.remove();
                currentPopup = null;
            }
        }
    });

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function setNativeValue(element, value) {
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        const tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(event);
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function waitForPopup(maxAttempts = 50, retryDelay = 100) {
        updateProgress('Ожидание диалога');

        for (let i = 0; i < maxAttempts; i++) {
            const popup = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]') ||
                         document.querySelector('.dc-Popup[role="popup"]') ||
                         document.querySelector('div[class*="dc-Popup"]');

            if (popup) {
                const rect = popup.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const inputs = popup.querySelectorAll('input.Textinput-Control');
                    if (inputs.length > 0) {
                        const textInputs = Array.from(inputs).filter(input =>
                            input.type === 'text' &&
                            input.offsetWidth > 0 &&
                            input.offsetHeight > 0 &&
                            !input.disabled &&
                            !input.readOnly
                        );

                        if (textInputs.length > 0) {
                            await sleep(POPUP_READY_DELAY);
                            return popup;
                        }
                    }
                }
            }
            await sleep(retryDelay);
        }
        return null;
    }

    async function fillPrognosisField(newValue) {
        updateProgress('Заполнение значения');
        resetTableTimer();

        const popup = await waitForPopup();
        if (!popup) {
            return false;
        }

        const popupStillExists = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]');
        if (!popupStillExists) {
            return false;
        }

        const inputs = popup.querySelectorAll('input.Textinput-Control');
        const textInputs = Array.from(inputs).filter(input =>
            input.type === 'text' &&
            input.offsetWidth > 0 &&
            input.offsetHeight > 0 &&
            !input.disabled &&
            !input.readOnly
        );

        if (textInputs.length === 0) return false;

        const targetInput = textInputs[textInputs.length - 1];
        const targetValue = newValue + ',00';

        await sleep(100);

        targetInput.focus();
        await sleep(150);

        targetInput.select();
        await sleep(100);

        setNativeValue(targetInput, targetValue);
        await sleep(150);

        let attempts = 0;
        while (attempts < 10) {
            const popupCheck = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]');
            if (!popupCheck) {
                return false;
            }

            if (targetInput.value === targetValue) {
                updateProgress('Значение установлено');
                return true;
            }

            await sleep(100);
            setNativeValue(targetInput, targetValue);
            attempts++;
        }

        return targetInput.value.includes(newValue);
    }

    async function waitForSave(maxWaitTime = SAVE_WAIT) {
        updateProgress('Сохранение');
        resetTableTimer();

        const startTime = Date.now();
        let checkInterval = 50;

        while (Date.now() - startTime < maxWaitTime) {
            const popup = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]');
            if (!popup) {
                updateProgress('Сохранено');
                return true;
            }

            const loading = document.querySelector('[class*="loading"], [class*="spinner"], [class*="saving"]');
            if (loading && loading.offsetWidth > 0) {
                updateProgress('Применение');
                checkInterval = 100;
            }

            await sleep(checkInterval);
        }

        const popup = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]');
        return !popup;
    }

    function getCurrentPrognosis(row) {
        try {
            const prognosisElement = row.querySelector('span.phrase-traffic-forecast__value');
            if (prognosisElement) {
                return prognosisElement.textContent.trim();
            }

            const alternativeSelectors = [
                '.phrase-traffic-forecast__value',
                '[class*="traffic-forecast"] [class*="value"]',
                '[class*="traffic"] [class*="forecast"] span',
                'td[data-testid*="traffic"] span',
                'td[data-testid*="forecast"] span'
            ];

            for (let selector of alternativeSelectors) {
                const element = row.querySelector(selector);
                if (element && element.textContent.trim()) {
                    const value = element.textContent.trim();
                    if (/^\d+$/.test(value)) {
                        return value;
                    }
                }
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    function isPrognosisCorrect(row, targetValue) {
        const currentValue = getCurrentPrognosis(row);
        if (!currentValue) return false;

        return !shouldUpdatePrognosis(currentValue, targetValue);
    }

    function getCurrentVisibleRows() {
        const rows = Array.from(document.querySelectorAll('div.Grid_row__6YN9a[data-index]'));
        return rows.filter(row => {
            const idx = row.getAttribute('data-index');
            return idx && !isNaN(parseInt(idx));
        }).sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top;
        });
    }

    function isRowVisible(row) {
        const rect = row.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return rect.top < windowHeight - 50 && rect.bottom > 50;
    }

    function isAutotargeting(row) {
        try {
            const phrase = row.querySelector('h3.phrase-cell__title');
            if (!phrase) return false;

            const phraseText = phrase.textContent.trim().toLowerCase();

            const autoTargetingKeywords = [
                'автотаргетинг',
                'auto-targeting',
                'autotargeting',
                'автоматическое нацеливание',
                'dynamic remarketing',
                'динамический ремаркетинг'
            ];

            const isAutoTarget = autoTargetingKeywords.some(keyword => phraseText.includes(keyword));

            if (isAutoTarget) {
                console.log(`🎯 Обнаружен автотаргетинг: "${phraseText}"`);
            }

            return isAutoTarget;
        } catch (e) {
            return false;
        }
    }

    function findPriceCell(row) {
        return row.querySelector('span.editable-cell__block.phrase-money-cell-editor');
    }

    async function scrollRowIntoView(row) {
        const rect = row.getBoundingClientRect();
        const windowCenter = window.innerHeight / 2;

        if (Math.abs(rect.top - windowCenter) > 150) {
            row.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            await sleep(SCROLL_DELAY);
        } else {
            await sleep(75);
        }
    }

    function updateMaxSeenIndex(currentVisibleRows) {
        let currentMaxIndex = maxSeenIndex;

        currentVisibleRows.forEach(row => {
            const dataIndex = parseInt(row.getAttribute('data-index'));
            if (!isNaN(dataIndex) && dataIndex > currentMaxIndex) {
                currentMaxIndex = dataIndex;
            }
        });

        if (currentMaxIndex > maxSeenIndex) {
            const previousMax = maxSeenIndex;
            maxSeenIndex = currentMaxIndex;
            resetTableTimer();
            console.log(`📈 data-index увеличился: ${previousMax} → ${maxSeenIndex}`);
            return true;
        }

        return false;
    }

    function isTableFinished() {
        const timeSinceLastActivity = Date.now() - lastNewRowTimestamp;

        const isFinished = timeSinceLastActivity >= TABLE_FINISH_TIMEOUT;

        if (isFinished) {
            console.log(`🏁 Таблица завершена! Максимальный data-index: ${maxSeenIndex}, время без активности: ${timeSinceLastActivity/1000}с`);
        }

        return isFinished;
    }

    function checkTableProgress(currentVisibleRows) {
        const hasNewRows = updateMaxSeenIndex(currentVisibleRows);

        if (hasNewRows) {
            return 'progress';
        }

        if (isTableFinished()) {
            return 'finished';
        }

        return 'waiting';
    }

    function checkIfStuck(currentVisibleRows) {
        const currentRowIds = currentVisibleRows.map(row => row.getAttribute('data-index')).sort();
        const currentRowIdsString = currentRowIds.join(',');
        const lastRowIdsString = lastVisibleRowIds.join(',');

        if (currentRowIdsString !== lastRowIdsString) {
            lastVisibleRowIds = currentRowIds;
            lastRowChangeTime = Date.now();
            return false;
        }

        const timeSinceLastChange = Date.now() - lastRowChangeTime;
        return timeSinceLastChange > STUCK_DETECTION_TIME;
    }

    async function smartReturnToTop() {
        updateProgress('Возврат к началу динамической таблицы');
        console.log('🔼 Начинаем возврат к началу таблицы');
        resetTableTimer();

        let attempt = 1;
        const maxAttempts = 10;

        while (attempt <= maxAttempts) {
            updateProgress('Попытка возврата', `${attempt}/${maxAttempts}`);
            console.log(`🔄 Попытка ${attempt} возврата к началу`);

            const firstRow = document.querySelector('div.Grid_row__6YN9a[data-index="0"]') ||
                           document.querySelector('div.Grid_row__6YN9a[data-index="1"]') ||
                           document.querySelector('div.Grid_row__6YN9a:first-of-type');

            if (firstRow) {
                console.log('📍 Найдена первая строка, прокручиваем к ней');
                firstRow.scrollIntoView({ behavior: 'auto', block: 'start' });
                await sleep(1000);

                const currentRows = getCurrentVisibleRows();
                if (currentRows.length > 0) {
                    const firstVisibleIndex = Math.min(...currentRows.map(row =>
                        parseInt(row.getAttribute('data-index'))
                    ).filter(idx => !isNaN(idx)));

                    console.log(`🎯 Первый видимый индекс: ${firstVisibleIndex}`);

                    if (firstVisibleIndex <= 5) {
                        console.log('✅ Успешно вернулись к началу таблицы');
                        updateProgress('Возврат к началу завершен');
                        resetTableTimer();
                        return true;
                    }
                }
            }

            const scrollMethods = [
                () => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                },
                () => {
                    const containers = [
                        document.querySelector('.grid-container'),
                        document.querySelector('[class*="Grid"]'),
                        document.querySelector('[class*="table"]'),
                        document.querySelector('[class*="scroll"]'),
                        document.documentElement,
                        document.body
                    ].filter(el => el);

                    containers.forEach(container => {
                        if (container.scrollTop) {
                            container.scrollTop = 0;
                        }
                    });
                },
                () => {
                    const scrollableElements = document.querySelectorAll('[style*="overflow"], [class*="scroll"]');
                    scrollableElements.forEach(el => {
                        if (el.scrollTop > 0) {
                            el.scrollTop = 0;
                        }
                    });
                }
            ];

            scrollMethods[attempt % scrollMethods.length]();
            await sleep(1000);

            for (let i = 0; i < 20; i++) {
                window.scrollBy({ top: -500, behavior: 'auto' });
                await sleep(100);

                if (window.pageYOffset === 0) {
                    break;
                }
            }

            await sleep(1000);
            attempt++;
        }

        console.log('⚠️ Не удалось гарантированно вернуться к началу, продолжаем');
        updateProgress('Продолжаем с текущей позиции');
        return false;
    }

    async function smoothScrollDown() {
        const currentVisibleRows = getCurrentVisibleRows();

        const isStuck = checkIfStuck(currentVisibleRows);

        if (isStuck) {
            updateProgress('Быстрый переход');
            window.scrollBy({ top: 800, behavior: 'auto' });
            await sleep(800);
            lastRowChangeTime = Date.now();
            resetTableTimer();
            return true;
        }

        const beforeScrollY = window.pageYOffset;

        window.scrollBy({ top: MICRO_SCROLL_STEP, behavior: 'auto' });
        await sleep(200);

        let afterScrollY = window.pageYOffset;

        if (afterScrollY === beforeScrollY) {
            window.scrollTo({ top: beforeScrollY + MICRO_SCROLL_STEP, behavior: 'auto' });
            await sleep(200);
            afterScrollY = window.pageYOffset;

            if (afterScrollY === beforeScrollY) {
                document.documentElement.scrollTop = beforeScrollY + MICRO_SCROLL_STEP;
                await sleep(200);
                afterScrollY = window.pageYOffset;

                if (afterScrollY === beforeScrollY) {
                    document.body.scrollTop = beforeScrollY + MICRO_SCROLL_STEP;
                    await sleep(200);
                    afterScrollY = window.pageYOffset;

                    if (afterScrollY === beforeScrollY) {
                        const allRows = getCurrentVisibleRows();
                        if (allRows.length > 0) {
                            const lastRow = allRows[allRows.length - 1];
                            lastRow.scrollIntoView({ behavior: 'auto', block: 'end' });
                            await sleep(400);
                            afterScrollY = window.pageYOffset;
                        }
                    }
                }
            }
        }

        const scrollSuccessful = afterScrollY > beforeScrollY;

        if (scrollSuccessful) {
            resetTableTimer();
            console.log(`✅ Успешная прокрутка: ${beforeScrollY} → ${afterScrollY}`);
        } else {
            console.log(`⚠️ Прокрутка неуспешна: позиция не изменилась (${beforeScrollY})`);
        }

        await sleep(SCROLL_DELAY);
        return scrollSuccessful;
    }

    async function processRow(row, targetValue, attempt = 1, maxAttempts = 3) {
        const idx = row.getAttribute('data-index');

        resetTableTimer();

        if (isAutotargeting(row)) {
            console.log(`🎯 Строка ${idx}: обнаружен автотаргетинг в processRow, прерываем`);
            return { success: false, reason: 'autotargeting_detected' };
        }

        updateProgress('Обработка строки', `№${idx}`);

        if (isPrognosisCorrect(row, targetValue)) {
            const currentValue = getCurrentPrognosis(row);
            if (rangeMode && currentValue) {
                const current = parseInt(currentValue);
                if (current >= rangeMin && current <= rangeMax) {
                    console.log(`📊 Строка ${idx}: значение ${current} в диапазоне [${rangeMin}-${rangeMax}], пропускаем`);
                    return { success: true, reason: 'in_range' };
                }
            }
            return { success: true, reason: 'already_correct' };
        }

        await scrollRowIntoView(row);
        resetTableTimer();

        const priceCell = findPriceCell(row);
        if (!priceCell) {
            return { success: false, reason: 'no_price_cell' };
        }

        if (isAutotargeting(row)) {
            console.log(`🎯 Строка ${idx}: автотаргетинг обнаружен перед кликом`);
            return { success: false, reason: 'autotargeting_before_click' };
        }

        updateProgress('Открытие редактора', `№${idx}`);

        await sleep(200);
        priceCell.click();
        await sleep(300);
        resetTableTimer();

        const filled = await fillPrognosisField(targetValue);
        if (!filled) {
            updateProgress('Ошибка заполнения', `№${idx}`);

            const popup = document.querySelector('div[id*="react-aria"][class*="dc-Popup"]');
            if (popup) {
                const closeBtn = popup.querySelector('button[aria-label="Закрыть"], [class*="close"], button[data-testid*="close"]');
                if (closeBtn) {
                    closeBtn.click();
                    await sleep(400);
                }
            }
            return { success: false, reason: 'fill_failed' };
        }

        const saveBtn = document.querySelector('button[data-testid="PopupConfirm.Save"]');
        if (!saveBtn) {
            return { success: false, reason: 'no_save_btn' };
        }

        await sleep(150);
        saveBtn.click();
        resetTableTimer();

        const saved = await waitForSave();
        if (!saved) {
            updateProgress('Тайм-аут сохранения', `№${idx}`);
        }

        updateProgress('Проверка результата', `№${idx}`);
        await sleep(RECHECK_DELAY);
        resetTableTimer();

        const updatedRows = getCurrentVisibleRows();
        const updatedRow = updatedRows.find(r => r.getAttribute('data-index') === idx);

        if (!updatedRow) {
            return { success: true, reason: 'row_moved_out_of_view' };
        }

        if (isPrognosisCorrect(updatedRow, targetValue)) {
            updateProgress('Строка обработана', `№${idx} ✓`);
            return { success: true, reason: 'processed_successfully' };
        } else {
            if (attempt < maxAttempts) {
                updateProgress('Повторная попытка', `№${idx} (${attempt + 1}/${maxAttempts})`);
                await sleep(1000);
                return await processRow(updatedRow, targetValue, attempt + 1, maxAttempts);
            } else {
                return { success: false, reason: 'max_attempts_reached' };
            }
        }
    }

    function thoroughRowAnalysis(currentVisibleRows, processedIds, failedIds, alreadyCorrectIds, targetValue) {
        let rowsToProcess = [];

        currentVisibleRows.forEach(row => {
            const idx = row.getAttribute('data-index');
            if (!idx) return;

            if (processedIds.has(idx) || failedIds.has(idx)) return;

            if (isAutotargeting(row)) return;

            if (!findPriceCell(row)) return;

            const currentValue = getCurrentPrognosis(row);
            if (currentValue === null) return;

            if (!shouldUpdatePrognosis(currentValue, targetValue)) {
                alreadyCorrectIds.add(idx);
            } else {
                rowsToProcess.push({ row: row, idx: idx });
            }
        });

        return rowsToProcess;
    }

    async function findAndCheckRowByIndex(targetIndex, targetValue, processedIds, failedIds, alreadyCorrectIds) {
        resetTableTimer();

        for (let attempt = 0; attempt < 15; attempt++) {
            const allRows = getCurrentVisibleRows();
            const targetRow = allRows.find(row => row.getAttribute('data-index') === targetIndex.toString());

            if (targetRow) {
                if (isAutotargeting(targetRow)) {
                    console.log(`🎯 Строка ${targetIndex}: автотаргетинг, пропускаем`);
                    return 'autotargeting';
                }

                if (processedIds.has(targetIndex.toString())) return 'already_processed';
                if (failedIds.has(targetIndex.toString())) return 'already_failed';
                if (!findPriceCell(targetRow)) return 'no_price_cell';

                const currentValue = getCurrentPrognosis(targetRow);

                if (!shouldUpdatePrognosis(currentValue, targetValue)) {
                    alreadyCorrectIds.add(targetIndex.toString());
                    return 'already_correct';
                } else {
                    if (isAutotargeting(targetRow)) {
                        console.log(`🎯 Строка ${targetIndex}: обнаружен автотаргетинг при повторной проверке`);
                        return 'autotargeting';
                    }

                    const result = await processRow(targetRow, targetValue);

                    if (result.success) {
                        processedIds.add(targetIndex.toString());
                        return 'processed_successfully';
                    } else {
                        failedIds.set(targetIndex.toString(), result);
                        return 'processing_failed';
                    }
                }
            } else {
                if (attempt < 14) {
                    const visibleRows = getCurrentVisibleRows();
                    if (visibleRows.length > 0) {
                        const visibleIndexes = visibleRows.map(r => parseInt(r.getAttribute('data-index'))).filter(i => !isNaN(i));
                        const minVisible = Math.min(...visibleIndexes);
                        const maxVisible = Math.max(...visibleIndexes);

                        if (targetIndex < minVisible) {
                            window.scrollBy({ top: -MICRO_SCROLL_STEP, behavior: 'auto' });
                        } else if (targetIndex > maxVisible) {
                            await smoothScrollDown();
                        } else {
                            window.scrollBy({ top: MICRO_SCROLL_STEP, behavior: 'auto' });
                        }
                        resetTableTimer();
                    } else {
                        await smoothScrollDown();
                    }

                    await sleep(SCROLL_DELAY);
                }
            }
        }

        return 'not_found';
    }

    async function sequentialIndexCheck(maxSeenIndex, targetValue) {
        let processedIds = new Set();
        let failedIds = new Map();
        let alreadyCorrectIds = new Set();

        updateProgress('К началу списка');
        window.scrollTo({ top: 0, behavior: 'auto' });
        await sleep(1500);
        resetTableTimer();

        lastVisibleRowIds = [];
        lastRowChangeTime = Date.now();

        for (let i = 0; i <= maxSeenIndex; i++) {
            if (stopFlag) break;

            updateProgress('Точная проверка', `№${i} из ${maxSeenIndex}`);

            const result = await findAndCheckRowByIndex(i, targetValue, processedIds, failedIds, alreadyCorrectIds);
            await sleep(STEP_DELAY);
            resetTableTimer();
        }

        return { processedIds, failedIds, alreadyCorrectIds };
    }

    async function checkLast10Rows(allSeenRows, processedIds, failedIds, alreadyCorrectIds, targetValue) {
        updateProgress('Финальная проверка');
        resetTableTimer();

        const sortedRows = Array.from(allSeenRows.entries())
            .sort(([idxA], [idxB]) => parseInt(idxB) - parseInt(idxA))
            .slice(0, 10);

        for (let [idx, rowData] of sortedRows) {
            if (stopFlag) break;

            if (processedIds.has(idx) || failedIds.has(idx) || alreadyCorrectIds.has(idx)) {
                continue;
            }

            updateProgress('Контрольная проверка', `№${idx}`);

            try {
                if (isAutotargeting(rowData.row)) {
                    console.log(`🎯 Финальная проверка: строка ${idx} - автотаргетинг, пропускаем`);
                    continue;
                }

                rowData.row.scrollIntoView({ behavior: 'auto', block: 'center' });
                await sleep(500);
                resetTableTimer();

                const currentRows = getCurrentVisibleRows();
                const currentRow = currentRows.find(r => r.getAttribute('data-index') === idx);

                if (!currentRow) continue;

                if (isAutotargeting(currentRow)) {
                    console.log(`🎯 Финальная проверка: текущая строка ${idx} - автотаргетинг`);
                    continue;
                }

                if (isPrognosisCorrect(currentRow, targetValue)) {
                    alreadyCorrectIds.add(idx);
                } else {
                    const result = await processRow(currentRow, targetValue);

                    if (result.success) {
                        processedIds.add(idx);
                    } else {
                        failedIds.set(idx, result);
                    }

                    await sleep(STEP_DELAY);
                }
                resetTableTimer();
            } catch (error) {
                console.log(`❌ Ошибка обработки строки ${idx}:`, error);
            }
        }
    }

    async function autoPrognosisAll() {
        stopFlag = false;
        isProcessing = true;

        const btnContainer = document.getElementById('yandex-prognoz-container');
        if (btnContainer) {
            const indicator = createProgressIndicator();
            btnContainer.appendChild(indicator);
        }

        const modeText = rangeMode ? `Диапазон [${rangeMin}-${rangeMax}]` : `Цель: ${AUTO_PROGNOZ_VALUE}`;
        updateProgress('Подготовка', modeText);

        let processedIds = new Set();
        let failedIds = new Map();
        let alreadyCorrectIds = new Set();
        let allSeenRows = new Map();

        let consecutiveFailedScrolls = 0;
        const MAX_FAILED_SCROLLS = 5;

        updateProgress('К началу');
        window.scrollTo({ top: 0, behavior: 'auto' });
        await sleep(1500);
        resetTableTimer();

        try {
            updateProgress('Этап 1: Поиск строк по таблице');

            while (!stopFlag) {
                const currentVisibleRows = getCurrentVisibleRows();

                currentVisibleRows.forEach(row => {
                    const idx = row.getAttribute('data-index');
                    if (idx) {
                        allSeenRows.set(idx, { row: row });
                    }
                });

                const tableStatus = checkTableProgress(currentVisibleRows);

                if (tableStatus === 'finished') {
                    updateProgress('Конец таблицы достигнут', `max data-index: ${maxSeenIndex}`);
                    console.log('🏁 Таблица завершена по таймауту активности');
                    break;
                }

                const timeWithoutActivity = Date.now() - lastNewRowTimestamp;
                const secondsLeft = Math.max(0, Math.ceil((TABLE_FINISH_TIMEOUT - timeWithoutActivity) / 1000));

                if (tableStatus === 'progress') {
                    updateProgress('Новые строки найдены', `max: ${maxSeenIndex}`);
                    consecutiveFailedScrolls = 0;
                } else if (tableStatus === 'waiting') {
                    updateProgress('Ожидание активности', `max: ${maxSeenIndex}, осталось: ${secondsLeft}с`);
                }

                const rowsToProcess = thoroughRowAnalysis(
                    currentVisibleRows,
                    processedIds,
                    failedIds,
                    alreadyCorrectIds,
                    AUTO_PROGNOZ_VALUE
                );

                if (rowsToProcess.length > 0) {
                    resetTableTimer();
                    consecutiveFailedScrolls = 0;

                    for (let item of rowsToProcess) {
                        if (stopFlag) break;

                        const result = await processRow(item.row, AUTO_PROGNOZ_VALUE);

                        if (result.success) {
                            if (result.reason === 'already_correct' || result.reason === 'in_range') {
                                alreadyCorrectIds.add(item.idx);
                            } else {
                                processedIds.add(item.idx);
                            }
                        } else {
                            if (result.reason && result.reason.includes('autotargeting')) {
                                console.log(`🎯 Автотаргетинг в строке ${item.idx} пропущен`);
                            } else {
                                failedIds.set(item.idx, result);
                            }
                        }

                        await sleep(STEP_DELAY);
                        resetTableTimer();
                    }
                }

                const scrollSuccess = await smoothScrollDown();

                if (!scrollSuccess) {
                    consecutiveFailedScrolls++;
                    console.log(`⚠️ Неуспешная прокрутка ${consecutiveFailedScrolls}/${MAX_FAILED_SCROLLS}`);

                    if (consecutiveFailedScrolls >= MAX_FAILED_SCROLLS) {
                        console.log('🏁 Достигнут предел неуспешных попыток прокрутки - таблица завершена');
                        updateProgress('Конец таблицы достигнут', 'нет новых строк для прокрутки');
                        break;
                    }
                } else {
                    consecutiveFailedScrolls = 0;
                }
            }

            if (!stopFlag) {
                await smartReturnToTop();
            }

            if (!stopFlag && maxSeenIndex > 0) {
                updateProgress('Этап 2: Точная проверка всех строк');

                const sequentialResults = await sequentialIndexCheck(maxSeenIndex, AUTO_PROGNOZ_VALUE);

                sequentialResults.processedIds.forEach(id => processedIds.add(id));
                sequentialResults.alreadyCorrectIds.forEach(id => alreadyCorrectIds.add(id));
                for (let [id, error] of sequentialResults.failedIds.entries()) {
                    failedIds.set(id, error);
                }
            }

            if (!stopFlag) {
                updateProgress('Этап 3: Финальный контроль');
                await checkLast10Rows(allSeenRows, processedIds, failedIds, alreadyCorrectIds, AUTO_PROGNOZ_VALUE);
            }

        } finally {
            isProcessing = false;
        }

        updateProgress('Завершено');

        setTimeout(() => {
            hideProgress();
            updateMainButton(false);

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ffffff;
                color: #1e40af;
                border: 1px solid #2563EB;
                border-radius: 8px;
                padding: 16px 20px;
                font-family: YS Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                font-size: 14px;
                font-weight: 400;
                box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
                z-index: 10000;
                animation: slide-in-notification 0.3s ease-out;
                min-width: 260px;
                max-width: 320px;
            `;

            const processedCount = processedIds.size;
            const skippedCount = alreadyCorrectIds.size;
            const failedCount = failedIds.size;

            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 20px; height: 20px; background: #2563EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                        </svg>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; margin-bottom: 2px; color: #1e40af;">Прогноз обновлён</div>
                        <div style="opacity: 0.7; font-size: 13px; color: #64748b;">
                            Изменено: ${processedCount} • Пропущено: ${skippedCount} • Макс.индекс: ${maxSeenIndex}
                            ${rangeMode ? ` • Диапазон: ${rangeMin}-${rangeMax}` : ''}
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slide-in-notification 0.2s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 200);
            }, 4000);

        }, 1500);
    }

    // ✅ ЗАГРУЖАЕМ НАСТРОЙКИ ПРИ ЗАПУСКЕ
    loadSettings();

    setInterval(addButtons, 1000);

})();
