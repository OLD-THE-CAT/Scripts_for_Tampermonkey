// ==UserScript==
// @name         YBrowser. Закрытие попапа Яндекс Браузера
// @namespace    http://tampermonkey.net/
// @version      2.7.2
// @description  Автоматически закрывает всплывающие окна с предложением установить Яндекс Браузер и активирует поиск
// @author       ИП Ульянов (Станислав)
// @match        https://yandex.kz/*
// @match        https://yandex.ru/*
// @grant        none
// @run-at       document-start
// @all-frames   true
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YBrowser.%20%D0%97%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%BF%D0%B0%D0%BF%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%91%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YBrowser.%20%D0%97%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%BF%D0%B0%D0%BF%D0%B0%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%91%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0.user.js
// @icon         https://avatars.mds.yandex.net/get-bunker/128809/f91fbccb31d2222458da4bf97fe3588f0252365a/orig
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация для максимальной скорости
    const CONFIG = {
        turboInterval: 10, // Сверхбыстрая проверка каждые 10мс
        maxTurboChecks: 10, // Больше проверок для надежности
        keywords: ['браузер', 'установить', 'browser', 'install'],
        storageKey: 'yandex_popup_blocked_hashes',
        searchKeywords: ['поиск', 'search']
    };

    let turboCheckCount = 0;
    let searchFocused = false;
    let popupFound = false;

    // Оптимизированные селекторы для быстрого поиска
    const TURBO_SELECTORS = {
        popupSelectors: [
            '[class*="Distribution-SplashScreenModalContent"]',
            '[class*="simple-popup"]',
            '[class*="Modal"]',
            '[class*="Popup"]',
            '[class*="Dialog"]',
            '.modal',
            '.popup'
        ],
        closeSelectors: [
            '.simple-popup__close',
            'button[aria-label*="Закрыть"]',
            'button[class*="close"]',
            'button[class*="Close"]',
            '.close-button',
            '.CloseButton'
        ],
        searchSelectors: [
            'input[class*="search3__input"]',
            'input[name="text"]',
            '#text'
        ]
    };

    // Функция для работы с localStorage
    const storage = {
        getBlockedHashes() {
            try {
                const stored = localStorage.getItem(CONFIG.storageKey);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        },

        addBlockedHash(hash) {
            try {
                const blocked = this.getBlockedHashes();
                if (!blocked.includes(hash)) {
                    blocked.push(hash);
                    if (blocked.length > 50) blocked.shift();
                    localStorage.setItem(CONFIG.storageKey, JSON.stringify(blocked));
                }
            } catch (e) {}
        },

        isHashBlocked(hash) {
            return this.getBlockedHashes().includes(hash);
        }
    };

    // Быстрая генерация хэша
    function quickHash(element) {
        const text = element.textContent.trim().substring(0, 50);
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Турбо поиск попапов
    function turboFindPopups() {
        const foundPopups = [];

        // Быстрый поиск по селекторам
        for (const selector of TURBO_SELECTORS.popupSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.toLowerCase();
                if (CONFIG.keywords.some(keyword => text.includes(keyword))) {
                    const hash = quickHash(element);
                    if (!storage.isHashBlocked(hash)) {
                        foundPopups.push({ element, hash });
                    } else {
                        // Мгновенное скрытие заблокированных попапов
                        element.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;z-index:-9999!important;';
                    }
                }
            }
        }

        // Дополнительный поиск по тексту "установить"
        const textNodes = document.evaluate(
            "//text()[contains(translate(., 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ', 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'), 'установить') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'install')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const textNode = textNodes.snapshotItem(i);
            let element = textNode.parentElement;

            while (element && element !== document.body) {
                const className = element.className || '';
                if (className.includes('modal') || className.includes('popup') ||
                    className.includes('dialog') || className.includes('overlay') ||
                    className.includes('Distribution') || className.includes('SplashScreen')) {

                    const hash = quickHash(element);
                    if (!storage.isHashBlocked(hash)) {
                        const alreadyAdded = foundPopups.some(popup => popup.element === element);
                        if (!alreadyAdded) {
                            foundPopups.push({ element, hash });
                        }
                    }
                    break;
                }
                element = element.parentElement;
            }
        }

        return foundPopups;
    }

    // Турбо закрытие попапов
    function turboClosePopups() {
        const popups = turboFindPopups();

        for (const { element: popup, hash } of popups) {
            console.log('🚀 ТУРБО: Найден попап!');
            popupFound = true;

            // Поиск кнопки закрытия
            let closeButton = null;
            for (const selector of TURBO_SELECTORS.closeSelectors) {
                closeButton = popup.querySelector(selector);
                if (closeButton) break;
            }

            // Дополнительный поиск кнопки
            if (!closeButton) {
                const buttons = popup.querySelectorAll('button, [role="button"]');
                for (const button of buttons) {
                    const text = button.textContent.toLowerCase().trim();
                    const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();

                    if (text.includes('закрыть') || text.includes('close') ||
                        ariaLabel.includes('закрыть') || ariaLabel.includes('close') ||
                        text === '×' || text === '✕' || text === 'x') {
                        closeButton = button;
                        break;
                    }
                }
            }

            if (closeButton) {
                // Мгновенный клик без задержек
                closeButton.click();

                // Дополнительные события для надежности
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    const event = new MouseEvent(eventType, { bubbles: true, cancelable: true });
                    closeButton.dispatchEvent(event);
                });
            }

            // Принудительное скрытие попапа
            popup.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;z-index:-9999!important;';

            // Блокируем повторное появление
            storage.addBlockedHash(hash);

            // Активируем поиск
            setTimeout(() => turboFocusSearch(), 50);
        }

        return popups.length > 0;
    }

    // Турбо активация поиска
    function turboFocusSearch() {
        if (searchFocused) return;

        let searchInput = null;
        for (const selector of TURBO_SELECTORS.searchSelectors) {
            searchInput = document.querySelector(selector);
            if (searchInput) break;
        }

        if (!searchInput) {
            const inputs = document.querySelectorAll('input[type="text"], input:not([type])');
            for (const input of inputs) {
                const placeholder = (input.placeholder || '').toLowerCase();
                if (CONFIG.searchKeywords.some(keyword => placeholder.includes(keyword))) {
                    searchInput = input;
                    break;
                }
            }
        }

        if (searchInput) {
            // Мгновенная активация
            searchInput.focus();
            searchInput.click();

            const focusEvent = new FocusEvent('focus', { bubbles: true });
            searchInput.dispatchEvent(focusEvent);

            console.log('🚀 ТУРБО: Поиск активирован!');
            searchFocused = true;
        }
    }

    // Основная турбо функция
    function turboCheck() {
        turboCheckCount++;

        const found = turboClosePopups();

        if (!found && !searchFocused) {
            turboFocusSearch();
        }

        if (turboCheckCount >= CONFIG.maxTurboChecks) {
            console.log('🚀 ТУРБО: Максимум проверок достигнут');
            return;
        }

        // Продолжаем проверки
        setTimeout(turboCheck, CONFIG.turboInterval);
    }

    // Мгновенный MutationObserver
    const turboObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const className = node.className || '';
                        const textContent = node.textContent || '';

                        if ((className.includes('popup') || className.includes('modal') ||
                             className.includes('Distribution') || className.includes('SplashScreen')) ||
                            (textContent.toLowerCase().includes('установить') ||
                             textContent.toLowerCase().includes('браузер'))) {

                            // Мгновенная проверка
                            setTimeout(turboClosePopups, 1);
                            break;
                        }
                    }
                }
            }
        }
    });

    // Инициализация турбо режима
    function initTurbo() {
        console.log('🚀 ТУРБО РЕЖИМ АКТИВИРОВАН!');

        // Запускаем турбо проверки
        turboCheck();

        // Настраиваем наблюдатель
        if (document.body) {
            turboObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                turboObserver.observe(document.body, { childList: true, subtree: true });
            });
        }

        // Дополнительные проверки на ключевых событиях
        ['DOMContentLoaded', 'load'].forEach(event => {
            document.addEventListener(event, () => {
                setTimeout(turboClosePopups, 1);
                setTimeout(turboFocusSearch, 100);
            });
        });

        // Сброс флага поиска при клике
        document.addEventListener('click', (e) => {
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput && e.target !== searchInput) {
                searchFocused = false;
            }
        });
    }

    // Запуск
    initTurbo();
})();
