// ==UserScript==
// @name         GAds. Подсветка поисковой рекламы в Google
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Подсвечивает блоки поисковой рекламы в Google с возможностью выделения нескольких доменов
// @author       ИП Ульянов (Станислав)
// @include      /^https:\/\/.*google\.[a-z]+\/.*search.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20Google.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20Google.user.js
// @icon         https://img.icons8.com/color/48/google-ads.png
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_ID = 'google-ads-highlight-style';
    const STORAGE_KEY = 'gads_highlight_domains';

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            .google-ads-highlight {
                border: 2px solid #007bff !important;
                border-radius: 12px;
                padding: 12px;
                margin: 8px 0 !important;
                box-shadow: 0 0 8px rgba(0, 123, 255, 0.15);
                position: relative;
            }

            .google-ads-highlight > *:last-child {
                margin-bottom: 0 !important;
                padding-bottom: 0 !important;
            }

            .google-ads-domain-highlight {
                background-color: rgba(0, 123, 255, 0.15) !important;
            }

            #domainSettingsPanel {
                position: absolute;
                top: 100%;
                right: 0;
                background: #ffffff;
                border: 1px solid #dadce0;
                border-radius: 12px;
                padding: 24px;
                z-index: 9999;
                font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                width: 380px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
                display: none;
                backdrop-filter: blur(8px);
                animation: fadeIn 0.2s ease-out;
                margin-top: 8px;
                color: #202124;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            #domainSettingsPanel.show {
                display: block;
            }

            #domainSettingsPanel h3 {
                margin: 0 0 16px 0;
                color: #1a73e8;
                font-size: 18px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #domainSettingsPanel h3 svg {
                width: 20px;
                height: 20px;
                color: #1a73e8;
            }

            .domain-instruction {
                margin-bottom: 12px;
                color: #5f6368;
                font-size: 13px;
                font-weight: 400;
            }

            #domainSettingsPanel input {
                width: 100%;
                height: 44px;
                margin-bottom: 16px;
                font-size: 14px;
                padding: 0 12px;
                border: 2px solid #dadce0;
                border-radius: 8px;
                box-sizing: border-box;
                font-family: 'Google Sans', sans-serif;
                transition: border-color 0.2s ease;
                background: #ffffff;
                color: #202124;
            }

            #domainSettingsPanel input:focus {
                outline: none;
                border-color: #1a73e8;
                box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
            }

            #domainSettingsPanel input::placeholder {
                color: #9aa0a6;
                font-style: italic;
            }

            .button-group {
                display: flex;
                gap: 12px;
                justify-content: space-between;
                margin-top: 20px;
            }

            .button-group-left {
                display: flex;
                gap: 12px;
            }

            .button-group-right {
                display: flex;
                gap: 12px;
            }

            #domainSettingsPanel button {
                border: none;
                border-radius: 20px;
                padding: 10px 24px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                font-family: 'Google Sans', sans-serif;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            #domainSettingsPanel button::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
            }

            #domainSettingsPanel button:active::before {
                width: 300px;
                height: 300px;
            }

            #domainSettingsPanel .save-btn {
                background: linear-gradient(135deg, #1a73e8, #4285f4);
                color: white;
                box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
            }

            #domainSettingsPanel .save-btn:hover {
                background: linear-gradient(135deg, #1557b0, #3367d6);
                box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
                transform: translateY(-1px);
            }

            #domainSettingsPanel .clear-btn {
                background: linear-gradient(135deg, #ea4335, #d93025);
                color: white;
                box-shadow: 0 2px 8px rgba(234, 67, 53, 0.3);
            }

            #domainSettingsPanel .clear-btn:hover {
                background: linear-gradient(135deg, #d33b2c, #b52d20);
                box-shadow: 0 4px 12px rgba(234, 67, 53, 0.4);
                transform: translateY(-1px);
            }

            #domainSettingsPanel .close-btn {
                background: #f8f9fa;
                color: #5f6368;
                border: 1px solid #dadce0;
            }

            #domainSettingsPanel .close-btn:hover {
                background: #e8eaed;
                color: #202124;
                transform: translateY(-1px);
            }

            #domainToggleBtn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                margin-left: 6px;
                color: #5f6368;
                transition: all 0.2s ease;
                border-radius: 50%;
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: middle;
                width: 40px;
                height: 40px;
                box-sizing: border-box;
                flex-shrink: 0;
            }

            #domainToggleBtn:hover {
                color: #1a73e8;
                background: rgba(26, 115, 232, 0.08);
            }

            #domainToggleBtn svg {
                width: 20px;
                height: 20px;
                display: block;
            }

            .search-button-container {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 0;
                flex-shrink: 0;
            }

            /* Адаптация для мобильных устройств и уменьшенной поисковой строки */
            @media (max-width: 768px) {
                #domainToggleBtn {
                    width: 36px;
                    height: 36px;
                    padding: 6px;
                }

                #domainToggleBtn svg {
                    width: 18px;
                    height: 18px;
                }

                #domainSettingsPanel {
                    width: 320px;
                    right: -10px;
                }
            }

            /* Стили для закрепленной поисковой строки */
            .search-button-container.sticky-mode #domainToggleBtn {
                width: 36px;
                height: 36px;
                padding: 6px;
                margin-left: 4px;
            }

            .search-button-container.sticky-mode #domainToggleBtn svg {
                width: 18px;
                height: 18px;
            }

            .search-button-container.sticky-mode #domainSettingsPanel {
                width: 360px;
            }

            /* Тёмная тема - автоматическое переключение */
            @media (prefers-color-scheme: dark) {
                .google-ads-highlight {
                    border-color: #60a2ff !important;
                    box-shadow: 0 0 8px rgba(96, 162, 255, 0.15);
                }

                .google-ads-domain-highlight {
                    background-color: rgba(96, 162, 255, 0.08) !important;
                }

                #domainSettingsPanel {
                    background: #22272e;
                    border: 1px solid #32373e;
                    color: #e2e3e7;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2);
                }

                #domainSettingsPanel h3 {
                    color: #60a2ff;
                }

                #domainSettingsPanel h3 svg {
                    color: #60a2ff;
                }

                .domain-instruction {
                    color: #a6abb8;
                }

                #domainSettingsPanel input {
                    background: #23272d;
                    border: 2px solid #32373e;
                    color: #e2e3e7;
                }

                #domainSettingsPanel input:focus {
                    border-color: #60a2ff;
                    box-shadow: 0 0 0 3px rgba(96, 162, 255, 0.15);
                }

                #domainSettingsPanel input::placeholder {
                    color: #6b717e;
                }

                #domainSettingsPanel .close-btn {
                    background: #2e323a;
                    color: #a4a9b6;
                    border: 1px solid #32373e;
                }

                #domainSettingsPanel .close-btn:hover {
                    background: #353a44;
                    color: #ffffff;
                }

                #domainToggleBtn {
                    color: #a6abb8;
                }

                #domainToggleBtn:hover {
                    color: #60a2ff;
                    background: rgba(96, 162, 255, 0.08);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Функции для работы с хранилищем Tampermonkey
    function saveDomains(domains) {
        try {
            setTimeout(() => {
                GM_setValue(STORAGE_KEY, domains);
            }, 0);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения доменов:', error);
            return false;
        }
    }

    function loadDomains() {
        try {
            const domains = GM_getValue(STORAGE_KEY, '');
            return domains || '';
        } catch (error) {
            console.error('Ошибка загрузки доменов:', error);
            return '';
        }
    }

    function clearDomains() {
        try {
            setTimeout(() => {
                GM_setValue(STORAGE_KEY, '');
            }, 0);
            return true;
        } catch (error) {
            console.error('Ошибка очистки доменов:', error);
            return false;
        }
    }

    function updateButtonSize(container, searchButton) {
        const toggleBtn = document.getElementById('domainToggleBtn');
        if (!toggleBtn || !searchButton) return;

        // Определяем, находится ли поисковая строка в "sticky" режиме
        const searchRect = searchButton.getBoundingClientRect();
        const isSticky = searchRect.top <= 100; // Если поисковая строка близко к верху

        if (isSticky) {
            container.classList.add('sticky-mode');
        } else {
            container.classList.remove('sticky-mode');
        }
    }

    function createSettingsInterface() {
        // Ищем кнопку поиска по указанным атрибутам
        const searchButton = document.querySelector('button[class*="HZVG1b"][aria-label="Поиск"]') ||
                            document.querySelector('button[aria-label="Поиск"]') ||
                            document.querySelector('button.HZVG1b');

        if (!searchButton) {
            console.log('Кнопка поиска не найдена');
            return;
        }

        // Проверяем, не добавлена ли уже кнопка
        if (document.getElementById('domainToggleBtn')) {
            return;
        }

        // Создаем контейнер для кнопки поиска, если его нет
        let container = searchButton.parentElement;
        if (!container.classList.contains('search-button-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'search-button-container';
            container.insertBefore(wrapper, searchButton);
            wrapper.appendChild(searchButton);
            container = wrapper;
        }

        // Кнопка для открытия настроек с SVG иконкой
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'domainToggleBtn';
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
        `;
        toggleBtn.title = 'Настройка подсветки доменов';

        // Вставляем кнопку справа от кнопки поиска
        container.appendChild(toggleBtn);

        // Панель настроек в стиле Google Ads 2025
        const panel = document.createElement('div');
        panel.id = 'domainSettingsPanel';

        const title = document.createElement('h3');
        title.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
            Настройка подсветки доменов
        `;

        const instruction = document.createElement('div');
        instruction.className = 'domain-instruction';
        instruction.textContent = 'Укажите ваши домены через запятую';

        const domainInput = document.createElement('input');
        domainInput.id = 'domainInput';
        domainInput.type = 'text';
        domainInput.placeholder = 'example.com, competitor.ru, mysite.net';

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const buttonGroupLeft = document.createElement('div');
        buttonGroupLeft.className = 'button-group-left';

        const buttonGroupRight = document.createElement('div');
        buttonGroupRight.className = 'button-group-right';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Отмена';
        closeBtn.className = 'close-btn';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Очистить';
        clearBtn.className = 'clear-btn';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Сохранить';
        saveBtn.className = 'save-btn';

        // События
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentDomains = loadDomains();
            domainInput.value = currentDomains;
            panel.classList.toggle('show');

            // Фокус на input при открытии
            if (panel.classList.contains('show')) {
                setTimeout(() => domainInput.focus(), 100);
            }
        });

        saveBtn.addEventListener('click', () => {
            const domains = domainInput.value.trim();
            saveDomains(domains);

            // Закрываем панель сразу после сохранения
            panel.classList.remove('show');

            // Обновляем подсветку после сохранения
            setTimeout(() => {
                highlightDomainAds();
            }, 100);
        });

        clearBtn.addEventListener('click', () => {
            // Очищаем поле ввода
            domainInput.value = '';

            // Очищаем сохраненные домены
            clearDomains();

            // Обновляем подсветку (убираем все выделения доменов)
            setTimeout(() => {
                highlightDomainAds();
            }, 100);
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
        });

        // Закрытие панели по клику вне её
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
                panel.classList.remove('show');
            }
        });

        // Закрытие панели по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('show')) {
                panel.classList.remove('show');
            }
        });

        // Сохранение по Enter
        domainInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });

        // Сборка панели
        buttonGroupLeft.appendChild(closeBtn);
        buttonGroupRight.appendChild(clearBtn);
        buttonGroupRight.appendChild(saveBtn);

        buttonGroup.appendChild(buttonGroupLeft);
        buttonGroup.appendChild(buttonGroupRight);

        panel.appendChild(title);
        panel.appendChild(instruction);
        panel.appendChild(domainInput);
        panel.appendChild(buttonGroup);

        // Добавляем панель в контейнер кнопки для правильного позиционирования
        container.appendChild(panel);

        // Отслеживаем изменения размера поисковой строки при прокрутке
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateButtonSize(container, searchButton);
            }, 100);
        });

        // Отслеживаем изменения размера окна
        window.addEventListener('resize', () => {
            updateButtonSize(container, searchButton);
        });

        // Инициализируем размер кнопки
        updateButtonSize(container, searchButton);
    }

    function highlightGoogleAds() {
        // Поисковая реклама (по data-aavs)
        const searchAds = document.querySelectorAll('div[data-aavs]:not(.google-ads-highlight)');
        searchAds.forEach(ad => {
            ad.classList.add('google-ads-highlight');
        });
    }

    function highlightDomainAds() {
        const domainsStr = loadDomains();
        if (!domainsStr) {
            // Если доменов нет, убираем все выделения
            const ads = document.querySelectorAll('.google-ads-domain-highlight');
            ads.forEach(ad => {
                ad.classList.remove('google-ads-domain-highlight');
            });
            return;
        }

        const domains = domainsStr
            .split(',')
            .map(d => d.trim().toLowerCase())
            .filter(d => d.length > 0);

        if (domains.length === 0) {
            // Если доменов нет, убираем все выделения
            const ads = document.querySelectorAll('.google-ads-domain-highlight');
            ads.forEach(ad => {
                ad.classList.remove('google-ads-domain-highlight');
            });
            return;
        }

        const ads = document.querySelectorAll('.google-ads-highlight');
        ads.forEach(ad => {
            let shouldHighlight = false;

            // Проверяем все ссылки в рекламном блоке
            const links = ad.querySelectorAll('a[href]');
            for (const link of links) {
                const href = link.href.toLowerCase();
                if (domains.some(domain => href.includes(domain))) {
                    shouldHighlight = true;
                    break;
                }
            }

            // Проверяем текстовое содержимое
            if (!shouldHighlight) {
                const textContent = ad.textContent.toLowerCase();
                shouldHighlight = domains.some(domain => textContent.includes(domain));
            }

            // Применяем или убираем подсветку
            if (shouldHighlight) {
                ad.classList.add('google-ads-domain-highlight');
            } else {
                ad.classList.remove('google-ads-domain-highlight');
            }
        });
    }

    function processAds() {
        highlightGoogleAds();
        highlightDomainAds();
    }

    function initializeScript() {
        injectStyles();
        createSettingsInterface();
        processAds();
    }

    // Инициализация с задержкой для загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(() => {
        createSettingsInterface();
        processAds();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
