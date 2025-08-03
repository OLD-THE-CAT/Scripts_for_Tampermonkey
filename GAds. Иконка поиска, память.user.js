// ==UserScript==
// @name         GAds. Иконка поиска + память
// @namespace    http://tampermonkey.net/
// @version      3.1.2
// @description  Исправление иконки поиска в Google Ad Preview без мерцания с автообновлением
// @author       ИП Ульянов
// @match        https://ads.google.com/anon/AdPreview*
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0,%20%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0,%20%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C.user.js
// @grant        none
// @icon         https://img.icons8.com/color/48/google-ads.png
// ==/UserScript==

(function() {
    'use strict';

    let isInitialized = false;
    let fontLoaded = false;

    // CSS для предотвращения мерцания - применяется сразу
    function addAntiFlickerCSS() {
        const style = document.createElement('style');
        style.id = 'anti-flicker-css';
        style.textContent = `
            /* Скрываем все потенциально проблемные элементы */
            i[class*="material-icon"]:not(.search-icon-fixed),
            i.material-icons:not(.search-icon-fixed),
            span[class*="material-icon"]:not(.search-icon-fixed) {
                opacity: 0 !important;
                transition: opacity 0.3s ease-in-out !important;
            }

            /* Показываем исправленные элементы */
            .search-icon-fixed {
                opacity: 1 !important;
                font-family: 'Material Icons', sans-serif !important;
                font-weight: normal !important;
                font-style: normal !important;
                font-size: 24px !important;
                line-height: 1 !important;
                text-transform: none !important;
                display: inline-block !important;
                -webkit-font-smoothing: antialiased !important;
                text-rendering: optimizeLegibility !important;
                -moz-osx-font-smoothing: grayscale !important;
                font-feature-settings: 'liga' !important;
            }

            /* Альтернативный метод через Unicode */
            .search-icon-unicode {
                font-size: 0 !important;
                position: relative !important;
                opacity: 1 !important;
            }

            .search-icon-unicode:before {
                content: "\\e8b6" !important;
                font-family: "Material Icons", sans-serif !important;
                font-size: 24px !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Anti-flicker CSS добавлен');
    }

    // Синхронная загрузка Material Icons
    function loadMaterialIcons() {
        return new Promise((resolve) => {
            const existingLink = document.querySelector('link[href*="material-icons"]');
            if (existingLink) {
                console.log('Material Icons уже загружен');
                fontLoaded = true;
                resolve(true);
                return;
            }

            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            link.rel = 'stylesheet';
            link.crossOrigin = 'anonymous';

            link.onload = () => {
                console.log('✅ Material Icons загружен успешно');
                fontLoaded = true;
                resolve(true);
            };

            link.onerror = () => {
                console.log('❌ Ошибка загрузки Material Icons');
                fontLoaded = false;
                resolve(false);
            };

            document.head.appendChild(link);
        });
    }

    // Плавное исправление иконок
    async function fixSearchIconsSmooth() {
        console.log('Запуск плавного исправления иконок...');

        const selectors = [
            'i[class*="material-icon"]',
            'i.material-icons',
            'i.material-icons-extended',
            'span[class*="material-icon"]',
            '[class*="icon"] i',
            'button i',
            'form i'
        ];

        let fixedCount = 0;

        for (const selector of selectors) {
            const elements = document.querySelectorAll(`${selector}:not(.search-icon-fixed):not(.search-icon-unicode)`);

            for (const element of elements) {
                const text = element.textContent.trim();

                if (text === 'search' || text === 'Search') {
                    await fixSingleIcon(element);
                    fixedCount++;
                }
            }
        }

        // Агрессивный поиск если ничего не найдено
        if (fixedCount === 0) {
            fixedCount += await aggressiveIconSearch();
        }

        console.log(`✅ Исправлено иконок: ${fixedCount}`);
        return fixedCount;
    }

    // Исправление одной иконки
    async function fixSingleIcon(element) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (fontLoaded) {
                    element.classList.add('search-icon-fixed');
                } else {
                    element.classList.add('search-icon-unicode');
                }

                element.setAttribute('data-icon', 'search');
                console.log('🔧 Иконка исправлена:', element);
                resolve();
            }, 10);
        });
    }

    // Агрессивный поиск элементов с текстом "search"
    async function aggressiveIconSearch() {
        console.log('Запуск агрессивного поиска...');

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.nodeValue.trim() === 'search' ?
                        NodeFilter.FILTER_ACCEPT :
                        NodeFilter.FILTER_REJECT;
                }
            }
        );

        let foundCount = 0;
        let node;

        while (node = walker.nextNode()) {
            const element = node.parentElement;

            if (element &&
                !element.classList.contains('search-icon-fixed') &&
                !element.classList.contains('search-icon-unicode')) {

                await fixSingleIcon(element);
                foundCount++;
            }
        }

        console.log(`Агрессивный поиск нашел: ${foundCount} элементов`);
        return foundCount;
    }

    // Наблюдение за изменениями DOM с дебаунсом
    function setupDOMObserver() {
        let timeoutId;

        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const hasIcon = node.querySelector &&
                                (node.querySelector('[class*="material-icon"]') ||
                                 node.textContent.includes('search'));

                            if (hasIcon) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldCheck) break;
            }

            if (shouldCheck) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    console.log('🔄 Обнаружены изменения DOM, исправляем иконки...');
                    fixSearchIconsSmooth();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👁️ DOM Observer активирован');
        return observer;
    }

    // Проверка готовности шрифта
    async function checkFontReadiness() {
        if (!document.fonts || !document.fonts.check) {
            return false;
        }

        try {
            const isMaterialIconsReady = document.fonts.check('24px Material Icons');
            console.log(`Статус Material Icons: ${isMaterialIconsReady ? '✅ готов' : '⏳ загружается'}`);
            return isMaterialIconsReady;
        } catch (error) {
            console.log('Ошибка проверки шрифта:', error);
            return false;
        }
    }

    // Диагностика системы
    function runDiagnostics() {
        console.log('=== 🔍 ДИАГНОСТИКА ===');
        console.log('URL:', window.location.href);
        console.log('Готовность документа:', document.readyState);
        console.log('Версия скрипта: 3.1 (с автообновлением)');

        const materialIcons = document.querySelectorAll('[class*="material-icon"]');
        const searchElements = Array.from(document.querySelectorAll('*'))
            .filter(el => el.textContent.trim() === 'search' && el.children.length === 0);

        console.log(`Найдено material-icon элементов: ${materialIcons.length}`);
        console.log(`Найдено элементов с текстом "search": ${searchElements.length}`);
    }

    // Основная инициализация
    async function initialize() {
        if (isInitialized) {
            console.log('⚠️ Скрипт уже инициализирован');
            return;
        }

        console.log('🚀 Запуск улучшенного исправления иконок поиска с автообновлением...');

        addAntiFlickerCSS();
        runDiagnostics();

        try {
            await loadMaterialIcons();

            if (fontLoaded) {
                let attempts = 0;
                while (attempts < 10) {
                    const isReady = await checkFontReadiness();
                    if (isReady) break;

                    await new Promise(resolve => setTimeout(resolve, 200));
                    attempts++;
                }
            }

            await fixSearchIconsSmooth();
            setupDOMObserver();

            setTimeout(() => fixSearchIconsSmooth(), 2000);
            setTimeout(() => fixSearchIconsSmooth(), 5000);

            setInterval(() => {
                fixSearchIconsSmooth();
            }, 15000);

            isInitialized = true;
            console.log('✅ Система исправления иконок полностью активирована');

        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
        }
    }

    // Запуск скрипта
    function startScript() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        setTimeout(initialize, 500);
    }

    startScript();

})();
