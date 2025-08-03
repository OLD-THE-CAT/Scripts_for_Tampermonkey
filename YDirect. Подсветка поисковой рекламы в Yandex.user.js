// ==UserScript==
// @name         YDirect. Подсветка поисковой рекламы в Yandex
// @namespace    http://tampermonkey.net/
// @version      3.7.1
// @description  Подсвечивает рекламные блоки Яндекса с выделением собственного домена
// @author       ИП Ульянов (Станислав)
// @match        https://yandex.ru/search*
// @match        https://yandex.com/search*
// @match        https://yandex.by/search*
// @match        https://yandex.kz/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YDirect.%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20Yandex.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/YDirect.%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%D0%BE%D0%B9%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%20Yandex.user.js
// @icon         data:image/png;base64,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
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем, нужно ли отключить скрипт на текущей странице
    function shouldDisableScript() {
        const currentUrl = window.location.href;
        const disablePatterns = ['/images/', '/video/', '/maps/', '/all'];

        return disablePatterns.some(pattern => currentUrl.includes(pattern));
    }

    // Если скрипт должен быть отключен, завершаем выполнение
    if (shouldDisableScript()) {
        console.log('YDirect скрипт отключен на данной странице');
        return;
    }

    // Цвета подсветки
    const COLORS = {
        normal: 'red',
        myDomain: 'rgba(255, 0, 0, 0.05)'
    };

    const markedBlocks = new Set();
    let MY_DOMAINS = [];

    // Иконка "Глаз с фокусом"
    const TARGET_ICON_SVG = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
        </svg>
    `;

    // Функция определения темы браузера
    function isDarkTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Загружаем сохраненные домены
    function loadDomains() {
        const savedDomains = GM_getValue('myDomains', '');
        MY_DOMAINS = savedDomains ? savedDomains.split(',').map(d => d.trim().toLowerCase()) : [];
        return MY_DOMAINS;
    }

    // Сохраняем домены
    function saveDomains(domains) {
        const cleanDomains = domains.split(',')
            .map(d => d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''))
            .filter(d => d.length > 0);
        MY_DOMAINS = cleanDomains;
        GM_setValue('myDomains', cleanDomains.join(','));
    }

    // Очищаем домены
    function clearDomains() {
        MY_DOMAINS = [];
        GM_setValue('myDomains', '');
    }

    // Создаем кнопку настроек рядом с профилем
    function createSettingsButton() {
        const headerUser = document.querySelector('.HeaderUser');
        if (!headerUser || document.getElementById('ydirect-settings-btn')) return;

        const isDark = isDarkTheme();

        const button = document.createElement('div');
        button.id = 'ydirect-settings-btn';
        button.innerHTML = TARGET_ICON_SVG;
        button.title = 'Настройки доменов для подсветки рекламы';
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            margin-right: 12px;
            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            vertical-align: middle;
            position: relative;
            overflow: hidden;
            color: ${isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
        `;

        // Добавляем эффект свечения при наведении
        button.addEventListener('mouseenter', () => {
            button.style.background = isDark ?
                'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))' :
                'linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.1))';
            button.style.border = `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`;
            button.style.color = isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
            button.style.transform = 'scale(1.05) translateY(-1px)';
            button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            button.style.backdropFilter = 'blur(8px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
            button.style.border = 'none';
            button.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = 'none';
            button.style.backdropFilter = 'none';
        });

        // Создаем выпадающую панель с поддержкой тем
        const dropdownPanel = document.createElement('div');
        dropdownPanel.id = 'ydirect-dropdown-panel';
        dropdownPanel.style.cssText = `
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 380px;
            background: ${isDark ?
                'linear-gradient(145deg, #2a2a2a, #1e1e1e)' :
                'linear-gradient(145deg, #ffffff, #f8f9fa)'};
            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
            border-radius: 16px;
            padding: 20px;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.3),
                0 8px 25px rgba(0, 0, 0, 0.2),
                0 0 0 1px ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'} inset;
            z-index: 10000;
            display: none;
            backdrop-filter: blur(20px);
            transform: translateY(-10px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: ${isDark ? '#ffffff' : '#1a1a1a'};
        `;

        const currentDomains = MY_DOMAINS.join(', ');
        dropdownPanel.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                gap: 8px;
            ">
                <div style="
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                ">
                    ${TARGET_ICON_SVG}
                </div>
                <div>
                    <div style="
                        font-size: 16px;
                        font-weight: 600;
                        color: ${isDark ? '#ffffff' : '#1a1a1a'};
                        margin-bottom: 2px;
                    ">Настройка подсветки доменов</div>
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    color: ${isDark ? '#ffffff' : '#333333'};
                    margin-bottom: 6px;
                ">Укажите ваши домены через запятую</label>
                <input type="text" id="domains-input" placeholder="example.com, site.ru, mysite.com"
                       style="
                           width: 100%;
                           padding: 12px 16px;
                           border: 2px solid ${isDark ? '#444444' : '#e1e5e9'};
                           border-radius: 12px;
                           font-size: 14px;
                           box-sizing: border-box;
                           background: ${isDark ? '#333333' : '#ffffff'};
                           color: ${isDark ? '#ffffff' : '#000000'};
                           transition: all 0.2s ease;
                           outline: none;
                       "
                       value="${currentDomains}">
            </div>

            <div style="
                display: flex;
                gap: 10px;
                justify-content: space-between;
            ">
                <button id="cancel-domains-btn" style="
                    padding: 10px 20px;
                    border: 2px solid ${isDark ? '#555555' : '#e1e5e9'};
                    background: ${isDark ? '#444444' : '#ffffff'};
                    color: ${isDark ? '#ffffff' : '#666666'};
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">Отмена</button>

                <div style="display: flex; gap: 10px;">
                    <button id="clear-domains-btn" style="
                        padding: 10px 20px;
                        border: 2px solid #ff6b6b;
                        background: ${isDark ? '#444444' : '#ffffff'};
                        color: #ff6b6b;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">Очистить</button>

                    <button id="save-domains-btn" style="
                        padding: 10px 20px;
                        border: none;
                        background: linear-gradient(135deg, #00d2ff, #3a7bd5);
                        color: white;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 15px rgba(58, 123, 213, 0.3);
                    ">Сохранить</button>
                </div>
            </div>
        `;

        // Создаем контейнер
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            display: inline-block;
            vertical-align: middle;
        `;

        container.appendChild(button);
        container.appendChild(dropdownPanel);
        headerUser.parentNode.insertBefore(container, headerUser);

        // Обработчики для элементов интерфейса
        const domainsInput = dropdownPanel.querySelector('#domains-input');
        const saveBtn = dropdownPanel.querySelector('#save-domains-btn');
        const cancelBtn = dropdownPanel.querySelector('#cancel-domains-btn');
        const clearBtn = dropdownPanel.querySelector('#clear-domains-btn');

        // Анимация для поля ввода
        domainsInput.addEventListener('focus', () => {
            domainsInput.style.borderColor = '#3a7bd5';
            domainsInput.style.boxShadow = '0 0 0 3px rgba(58, 123, 213, 0.1)';
        });

        domainsInput.addEventListener('blur', () => {
            domainsInput.style.borderColor = isDark ? '#444444' : '#e1e5e9';
            domainsInput.style.boxShadow = 'none';
        });

        // Анимация для кнопки "Сохранить"
        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.transform = 'translateY(-2px)';
            saveBtn.style.boxShadow = '0 6px 20px rgba(58, 123, 213, 0.4)';
        });

        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.transform = 'translateY(0)';
            saveBtn.style.boxShadow = '0 4px 15px rgba(58, 123, 213, 0.3)';
        });

        // Анимация для кнопки "Отмена"
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.borderColor = isDark ? '#666666' : '#cccccc';
            cancelBtn.style.background = isDark ? '#555555' : '#f8f9fa';
        });

        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.borderColor = isDark ? '#555555' : '#e1e5e9';
            cancelBtn.style.background = isDark ? '#444444' : '#ffffff';
        });

        // Анимация для кнопки "Очистить"
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.background = '#ff6b6b';
            clearBtn.style.color = 'white';
            clearBtn.style.transform = 'translateY(-2px)';
            clearBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.background = isDark ? '#444444' : '#ffffff';
            clearBtn.style.color = '#ff6b6b';
            clearBtn.style.transform = 'translateY(0)';
            clearBtn.style.boxShadow = 'none';
        });

        // Логика показа/скрытия панели
        let isDropdownVisible = false;

        function showDropdown() {
            isDropdownVisible = true;
            dropdownPanel.style.display = 'block';
            setTimeout(() => {
                dropdownPanel.style.transform = 'translateY(0)';
                dropdownPanel.style.opacity = '1';
            }, 10);
            setTimeout(() => domainsInput.focus(), 300);
        }

        function hideDropdown() {
            isDropdownVisible = false;
            dropdownPanel.style.transform = 'translateY(-10px)';
            dropdownPanel.style.opacity = '0';
            setTimeout(() => {
                dropdownPanel.style.display = 'none';
            }, 300);
        }

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDropdownVisible) {
                hideDropdown();
            } else {
                showDropdown();
            }
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                hideDropdown();
            }
        });

        // Обработчик сохранения
        function saveDomainsList() {
            const domains = domainsInput.value.trim();
            saveDomains(domains);
            hideDropdown();
            updateHighlighting();
        }

        // Обработчик очистки
        function clearDomainsList() {
            clearDomains();
            domainsInput.value = '';
            hideDropdown();
            updateHighlighting();
        }

        // Функция обновления подсветки
        function updateHighlighting() {
            setTimeout(() => {
                markedBlocks.clear();
                document.querySelectorAll('[data-admarked]').forEach(el => {
                    el.removeAttribute('data-admarked');
                    const overlay = el.querySelector('.ad-highlight-overlay');
                    if (overlay) overlay.remove();
                });
                highlightAds();
            }, 100);
        }

        domainsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveDomainsList();
            }
        });

        saveBtn.addEventListener('click', saveDomainsList);
        cancelBtn.addEventListener('click', hideDropdown);
        clearBtn.addEventListener('click', clearDomainsList);

        // Обновление темы при изменении системных настроек
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            container.remove();
            setTimeout(() => createSettingsButton(), 100);
        });
    }

    function extractDomainFromUrl(url) {
        try {
            if (!url) return '';
            let domain = url.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
            domain = domain.replace(/^www\./, '');
            return domain.toLowerCase();
        } catch (e) {
            return '';
        }
    }

    // ОБНОВЛЕННАЯ функция проверки своих доменов для новой структуры
    function checkIfMyDomain(element) {
        if (MY_DOMAINS.length === 0) return false;

        // Проверяем обычные ссылки
        const links = element.querySelectorAll('a[href]');
        for (let link of links) {
            const href = link.getAttribute('href');
            if (href) {
                const domain = extractDomainFromUrl(href);
                if (MY_DOMAINS.includes(domain)) {
                    return true;
                }
            }
        }

        // Проверяем data-vnl атрибуты (новый формат)
        const dataVnlElements = element.querySelectorAll('[data-vnl]');
        for (let element of dataVnlElements) {
            try {
                const dataVnl = element.getAttribute('data-vnl');
                if (dataVnl) {
                    const vnlData = JSON.parse(dataVnl);
                    const url = vnlData.noRedirectUrl || '';
                    if (url) {
                        const domain = extractDomainFromUrl(url);
                        if (MY_DOMAINS.includes(domain)) {
                            return true;
                        }
                    }
                }
            } catch (e) {
                // Если JSON не парсится, ищем домен в строке
                const dataVnl = element.getAttribute('data-vnl');
                if (dataVnl) {
                    for (let domain of MY_DOMAINS) {
                        if (dataVnl.includes(domain)) {
                            return true;
                        }
                    }
                }
            }
        }

        // Оставляем поддержку старого формата data-click
        const dataClickLinks = element.querySelectorAll('[data-click]');
        for (let link of dataClickLinks) {
            try {
                const dataClick = link.getAttribute('data-click');
                if (dataClick) {
                    const data = JSON.parse(dataClick);
                    const url = data.arguments?.url || '';
                    if (url) {
                        const domain = extractDomainFromUrl(url);
                        if (MY_DOMAINS.includes(domain)) {
                            return true;
                        }
                    }
                }
            } catch (e) {}
        }

        return false;
    }

    function markBlock(block, isMyDomain = false) {
        if (block.dataset.admarked || markedBlocks.has(block)) return;

        let parent = block.parentElement;
        while (parent) {
            if (parent.dataset.admarked || markedBlocks.has(parent)) {
                return;
            }
            parent = parent.parentElement;
        }

        const markedChildren = block.querySelectorAll('[data-admarked="true"]');
        markedChildren.forEach(child => {
            const overlay = child.querySelector('.ad-highlight-overlay');
            if (overlay) overlay.remove();
            child.removeAttribute('data-admarked');
            markedBlocks.delete(child);
        });

        block.dataset.admarked = 'true';
        markedBlocks.add(block);
        block.style.position = 'relative';

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.right = 0;
        overlay.style.bottom = 0;
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '1000';
        overlay.className = 'ad-highlight-overlay';

        if (isMyDomain) {
            overlay.style.backgroundColor = COLORS.myDomain;
            overlay.style.border = '2px solid red';
            overlay.style.borderRadius = 'inherit';
        } else {
            overlay.style.border = '2px solid ' + COLORS.normal;
            overlay.style.borderRadius = 'inherit';
        }

        block.appendChild(overlay);
    }

    // ОБНОВЛЕННАЯ функция определения рекламы для новой структуры
    function isAdElement(element) {
        // Проверяем data-vnl атрибут (новый формат)
        const dataVnl = element.getAttribute('data-vnl');
        if (dataVnl) {
            try {
                // Пытаемся распарсить JSON
                const vnlData = JSON.parse(dataVnl);
                const url = vnlData.noRedirectUrl || '';

                // Проверяем наличие рекламных параметров в URL
                return url.includes('yclid=') ||
                       url.includes('utm_source=') ||
                       url.includes('utm_campaign=') ||
                       url.includes('utm_medium=');
            } catch (e) {
                // Если не удалось распарсить JSON, проверяем строку напрямую
                return dataVnl.includes('yclid=') ||
                       dataVnl.includes('utm_source=') ||
                       dataVnl.includes('utm_campaign=') ||
                       dataVnl.includes('utm_medium=');
            }
        }

        // Оставляем поддержку старого формата data-click на всякий случай
        const dataClick = element.getAttribute('data-click');
        return dataClick && (
            dataClick.includes('yclid=') ||
            dataClick.includes('utm_source=') ||
            dataClick.includes('utm_campaign=') ||
            dataClick.includes('utm_medium=')
        );
    }

    function isSearchResultBlock(element) {
        const hasTitle = element.querySelector('h1, h2, h3, [role="heading"], a[data-click], a[data-vnl]');
        const hasLink = element.querySelector('a[href]');
        const hasDescription = element.textContent.length > 50;

        const hasReasonableSize = element.offsetHeight > 40 &&
                                element.offsetHeight < 800 &&
                                element.offsetWidth > 200;

        const style = getComputedStyle(element);
        const isInFlow = style.position === 'static' || style.position === 'relative';

        return hasTitle && hasLink && hasDescription && hasReasonableSize && isInFlow;
    }

    function findSearchResultContainer(startElement) {
        let current = startElement;
        let candidates = [];

        for (let i = 0; i < 15 && current && current !== document.body; i++) {
            if (current.offsetHeight > window.innerHeight * 1.5 ||
                current.offsetWidth > window.innerWidth * 0.95) {
                current = current.parentElement;
                continue;
            }

            if (current.tagName === 'HEADER' || current.tagName === 'FOOTER' ||
                current.tagName === 'NAV' || current.id === 'header' ||
                current.id === 'footer') {
                current = current.parentElement;
                continue;
            }

            if (isSearchResultBlock(current)) {
                candidates.push({
                    element: current,
                    score: calculateBlockScore(current),
                    level: i
                });
            }

            current = current.parentElement;
        }

        if (candidates.length === 0) return null;

        candidates.sort((a, b) => {
            if (Math.abs(a.score - b.score) < 0.1) {
                return a.level - b.level;
            }
            return b.score - a.score;
        });

        return candidates[0].element;
    }

    function calculateBlockScore(element) {
        let score = 0;

        // Обновлено для новой структуры
        const dataClickLinks = element.querySelectorAll('a[data-click], a[data-vnl]');
        score += dataClickLinks.length * 0.3;

        if (element.querySelector('h1, h2, h3, [role="heading"]')) score += 0.5;

        const height = element.offsetHeight;
        if (height > 60 && height < 400) score += 0.4;

        const textLength = element.textContent.trim().length;
        if (textLength > 100 && textLength < 1000) score += 0.3;

        const borderRadius = getComputedStyle(element).borderRadius;
        if (borderRadius !== '0px') score += 0.2;

        const childElements = element.querySelectorAll('*').length;
        if (childElements > 100) score -= 0.3;

        if (element.tagName === 'LI' || element.tagName === 'ARTICLE') score += 0.2;

        return Math.max(0, score);
    }

    function highlightProductGalleryCards() {
        document.querySelectorAll('div[class*="EProductSnippet2"][class*="AdvProductGalleryCard"]:not([data-admarked])').forEach(card => {
            const isMyDomain = checkIfMyDomain(card);
            markBlock(card, isMyDomain);
        });
    }

    // ОБНОВЛЕННАЯ основная функция поиска и подсветки рекламы
    function highlightSearchAds() {
        const processedElements = new Set();
        const foundBlocks = new Set();

        // Ищем элементы с data-vnl (новый формат)
        document.querySelectorAll('[data-vnl]').forEach(element => {
            if (processedElements.has(element) || !isAdElement(element)) return;

            try {
                const container = findSearchResultContainer(element);

                if (container && !markedBlocks.has(container) && !foundBlocks.has(container)) {
                    // Проверяем наличие рекламного контента в новом формате
                    const hasAdContent = container.querySelector('[data-vnl*="yclid="]') ||
                                       container.querySelector('[data-vnl*="utm_source="]') ||
                                       container.querySelector('[data-vnl*="utm_campaign="]') ||
                                       // Проверяем элементы с data-vnl на предмет рекламных параметров
                                       Array.from(container.querySelectorAll('[data-vnl]')).some(el => {
                                           return isAdElement(el);
                                       });

                    if (hasAdContent) {
                        foundBlocks.add(container);

                        container.querySelectorAll('[data-vnl]').forEach(child => {
                            processedElements.add(child);
                        });
                    }
                }
            } catch (e) {
                console.warn('Error processing element:', e);
            }
        });

        // Дополнительно ищем по классам карточек
        document.querySelectorAll('.serp-item.serp-item_card').forEach(card => {
            if (markedBlocks.has(card) || foundBlocks.has(card)) return;

            // Проверяем наличие рекламных элементов в карточке
            const hasAdElements = Array.from(card.querySelectorAll('[data-vnl]')).some(el => {
                return isAdElement(el);
            });

            if (hasAdElements) {
                foundBlocks.add(card);
            }
        });

        // Оставляем поддержку старого формата data-click
        document.querySelectorAll('[data-click]').forEach(element => {
            if (processedElements.has(element) || !isAdElement(element)) return;

            try {
                const container = findSearchResultContainer(element);

                if (container && !markedBlocks.has(container) && !foundBlocks.has(container)) {
                    const hasAdContent = container.querySelector('[data-click*="yclid="]') ||
                                       container.querySelector('[data-click*="utm_source="]') ||
                                       container.querySelector('[data-click*="utm_campaign="]');

                    if (hasAdContent) {
                        foundBlocks.add(container);

                        container.querySelectorAll('[data-click]').forEach(child => {
                            processedElements.add(child);
                        });
                    }
                }
            } catch (e) {
                console.warn('Error processing element:', e);
            }
        });

        foundBlocks.forEach(block => {
            const isMyDomain = checkIfMyDomain(block);
            markBlock(block, isMyDomain);
        });
    }

    function highlightAds() {
        highlightSearchAds();
        highlightProductGalleryCards();
    }

    // Инициализация
    function init() {
        loadDomains();

        const createButtonInterval = setInterval(() => {
            if (document.querySelector('.HeaderUser')) {
                createSettingsButton();
                clearInterval(createButtonInterval);
            }
        }, 500);

        setTimeout(highlightAds, 500);

        const observer = new MutationObserver(() => {
            if (!document.getElementById('ydirect-settings-btn')) {
                createSettingsButton();
            }
            setTimeout(highlightAds, 100);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    init();
})();
