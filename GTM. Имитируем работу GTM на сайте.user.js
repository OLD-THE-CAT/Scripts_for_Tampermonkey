// ==UserScript==
// @name         GTM. Имитируем работу GTM на сайте
// @namespace    http://tampermonkey.net
// @version      6.2.7
// @description  Продвинутый инжектор GTM с управлением через tagmanager.google.com
// @author       ИП Ульянов (Станислав)
// @match        https://tagmanager.google.com/*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GTM.%20%D0%98%D0%BC%D0%B8%D1%82%D0%B8%D1%80%D1%83%D0%B5%D0%BC%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%83%20GTM%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GTM.%20%D0%98%D0%BC%D0%B8%D1%82%D0%B8%D1%80%D1%83%D0%B5%D0%BC%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%83%20GTM%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5.user.js
// @icon         data:image/x-icon;base64,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
// ==/UserScript==

(function() {
    'use strict';

    // Определяем режим работы скрипта
    const currentDomain = window.location.hostname;
    let currentURL = window.location.href;
    let shouldShowButton = false;
    let floatingButton = null;
    let buttonCheckInterval = null;
    let workingIndicator = null;
    let collapseTimeout = null;
    let expandTimeout = null;

    // НОВАЯ функция для проверки запрещенных слов в URL
    function urlContainsForbiddenWords() {
        const forbiddenWords = ['versions', 'admin'];
        const currentUrl = window.location.href.toLowerCase();

        return forbiddenWords.some(word => currentUrl.includes(word));
    }

    // ОБНОВЛЕННАЯ функция для проверки условий показа кнопки
    function checkButtonConditions() {
        const isGTMSite = window.location.hostname === 'tagmanager.google.com';
        const hasForbiddenWords = urlContainsForbiddenWords();

        // Показываем кнопку только если это GTM сайт И URL не содержит запрещенные слова
        return isGTMSite && !hasForbiddenWords;
    }

    // Функция для поиска контейнера GTM ID
    function findGTMContainer() {
        // Приоритетный поиск по правильному элементу
        const priorityContainer = document.querySelector('a.gtm-container-public-id.md-gtm-theme');
        if (priorityContainer) {
            return priorityContainer;
        }

        // Альтернативные селекторы
        const selectors = [
            '.gtm-container-public-id[container="ctrl.container"]',
            '.gtm-container-public-id',
            '[data-gtm-id]',
            '.container-id',
            '.gtm-container-id'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        return null;
    }

    // Функция для автоматического извлечения GTM ID
    function extractGTMId() {
        // Приоритетный поиск в правильном элементе
        const priorityElement = document.querySelector('a.gtm-container-public-id.md-gtm-theme');
        if (priorityElement && priorityElement.textContent) {
            const text = priorityElement.textContent.trim();
            const match = text.match(/GTM-[A-Z0-9]+/);
            if (match) {
                return match[0];
            }
        }

        // Поиск в URL
        const urlMatch = window.location.href.match(/GTM-[A-Z0-9]+/);
        if (urlMatch) {
            return urlMatch[0];
        }

        // Поиск в различных элементах
        const selectors = [
            '.gtm-container-public-id',
            '[data-gtm-id]',
            '.container-id',
            '.gtm-container-id',
            '[class*="container"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim() || element.getAttribute('data-gtm-id') || element.value;
                if (text && text.match(/GTM-[A-Z0-9]+/)) {
                    const match = text.match(/GTM-[A-Z0-9]+/);
                    if (match) {
                        return match[0];
                    }
                }
            }
        }

        // Поиск в тексте страницы как последний вариант
        const bodyText = document.body.textContent;
        const textMatch = bodyText.match(/GTM-[A-Z0-9]+/);
        if (textMatch) {
            return textMatch[0];
        }

        return '';
    }

    // Функция для преобразования URL в домен
    function urlToDomain(input) {
        if (!input || typeof input !== 'string') return '';

        let url = input.trim();

        // Исправляем некорректные протоколы
        url = url.replace(/^https?\/\//, 'https://');

        // Добавляем протокол если его нет
        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url;
        }

        try {
            const urlObj = new URL(url);
            let domain = urlObj.hostname;

            // Убираем www. если есть
            domain = domain.replace(/^www\./, '');

            return domain;
        } catch (e) {
            // Если URL некорректный, пытаемся извлечь домен вручную
            const match = url.match(/^https?:\/\/(?:www\.)?([^\/\s]+)/);
            if (match) {
                return match[1];
            }

            // Последняя попытка - считаем что это уже домен
            const cleanDomain = input.replace(/^https?:?\/?\/?(?:www\.)?/, '').replace(/\/.*$/, '');
            return cleanDomain;
        }
    }

    // Общие стили для обоих режимов
    const commonStyles = `
        .gtm-injector-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .gtm-injector-modal {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
            width: 520px;
            max-width: 90vw;
            animation: modalSlideIn 0.3s ease-out;
            overflow: hidden;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .gtm-injector-header {
            background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
            color: white;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .gtm-injector-header-icon {
            width: 32px;
            height: 32px;
            opacity: 0.9;
            flex-shrink: 0;
        }

        .gtm-injector-header-content {
            flex: 1;
        }

        .gtm-injector-title {
            font-size: 24px;
            font-weight: 500;
            margin: 0 0 8px 0;
            text-align: left;
        }

        .gtm-injector-subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
            text-align: left;
        }

        .gtm-injector-content {
            padding: 32px 24px;
        }

        .gtm-injector-field {
            margin-bottom: 24px;
        }

        .gtm-injector-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #202124;
            margin-bottom: 8px;
        }

        .gtm-injector-input {
            width: 100%;
            height: 48px;
            border: 2px solid #dadce0;
            border-radius: 8px;
            padding: 0 16px;
            font-size: 16px;
            color: #202124 !important;
            background: #fff !important;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }

        .gtm-injector-input:focus {
            outline: none;
            border-color: #1a73e8;
            box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
        }

        .gtm-injector-input:disabled {
            background: #f8f9fa !important;
            color: #9aa0a6 !important;
            cursor: not-allowed;
        }

        .gtm-injector-input::placeholder {
            color: #9aa0a6 !important;
        }

        .gtm-injector-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            padding: 0 24px 24px;
        }

        .gtm-injector-btn {
            height: 40px;
            padding: 0 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 80px;
        }

        .gtm-injector-btn-secondary {
            background: #f8f9fa;
            color: #3c4043;
        }

        .gtm-injector-btn-secondary:hover {
            background: #f1f3f4;
        }

        .gtm-injector-btn-primary {
            background: #1a73e8;
            color: white;
        }

        .gtm-injector-btn-primary:hover {
            background: #1557b0;
            box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
        }

        .gtm-injector-btn-primary:disabled {
            background: #dadce0;
            color: #9aa0a6;
            cursor: not-allowed;
        }

        .gtm-injector-btn-danger {
            background: #ea4335;
            color: white;
        }

        .gtm-injector-btn-danger:hover {
            background: #d33b2c;
            box-shadow: 0 2px 8px rgba(234, 67, 53, 0.3);
        }

        .gtm-settings-button {
            height: 32px;
            padding: 0 12px;
            background: #f9f9f9;
            border: 1px solid #dadce0;
            border-radius: 4px;
            color: #5f6368;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            outline: none;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-weight: 500;
            font-size: 14px;
            margin-right: 12px;
            text-decoration: none;
            vertical-align: middle;
            line-height: 1;
            box-sizing: border-box;
            opacity: 0;
            transform: translateY(-5px);
        }

        .gtm-settings-button.show {
            opacity: 1;
            transform: translateY(0);
        }

        .gtm-settings-button:hover {
            background: #f1f1f1;
            border-color: #bbb;
            color: #333;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .gtm-settings-button svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            margin-right: 8px;
        }

        /* Обеспечиваем правильное выравнивание родительского контейнера */
        .gtm-container-public-id[container="ctrl.container"] {
            display: flex !important;
            align-items: center !important;
            gap: 8px;
        }

        /* Альтернативный селектор для выравнивания */
        .gtm-container-public-id.md-gtm-theme {
            display: inline-flex !important;
            align-items: center !important;
        }

        /* Обеспечиваем что родительский div тоже выровнен */
        .gtm-page-header-status-messages.gms-container-status-header {
            display: flex !important;
            align-items: center !important;
            min-height: 48px;
        }
    `;

    // Стили для управляющего интерфейса
    const managementStyles = `
        .gtm-config-list {
            margin-bottom: 24px;
            border: 1px solid #dadce0;
            border-radius: 8px;
            overflow: visible;
        }

        .gtm-config-item {
            padding: 16px;
            border-bottom: 1px solid #f1f3f4;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .gtm-config-item:last-child {
            border-bottom: none;
        }

        .gtm-config-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .gtm-config-domain {
            font-weight: 500;
            color: #202124;
            margin-bottom: 0;
        }

        .gtm-config-gtm {
            font-size: 12px;
            color: #5f6368;
        }

        .gtm-config-separator {
            font-weight: normal;
            color: #202124;
            font-size: 14px;
        }

        .gtm-config-status {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
        }

        .gtm-config-status.active {
            background-color: #137333;
        }

        .gtm-config-status.inactive {
            background-color: #d93025;
        }

        .gtm-config-status.paused {
            background-color: #ea8600;
        }

        .gtm-config-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .gtm-config-icon-btn {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .gtm-config-icon-btn:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-8px);
            background: #202124;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            z-index: 2147483647 !important;
            pointer-events: none;
        }

        .gtm-config-btn-edit {
            background: #e8f0fe;
            color: #1a73e8;
        }

        .gtm-config-btn-edit:hover {
            background: #d2e3fc;
            transform: scale(1.1);
        }

        .gtm-config-btn-edit svg {
            stroke: #1a73e8;
        }

        .gtm-config-btn-pause {
            background: #fef7e0;
            color: #ea8600;
        }

        .gtm-config-btn-pause:hover {
            background: #fdd663;
            transform: scale(1.1);
        }

        .gtm-config-btn-pause.paused {
            background: #e8f5e8;
            color: #137333;
        }

        .gtm-config-btn-pause.paused:hover {
            background: #ceead6;
            color: #137333;
        }

        .gtm-config-btn-pause.paused svg {
            fill: #137333;
        }

        .gtm-config-btn-delete {
            background: #fce8e6;
            color: #d93025;
        }

        .gtm-config-btn-delete:hover {
            background: #fad2cf;
            transform: scale(1.1);
        }

        .gtm-config-btn-delete svg {
            stroke: #d93025;
        }

        .gtm-empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #5f6368;
        }

        .gtm-empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }
    `;

    // НОВЫЕ стили для рабочего режима с автосворачиванием
    const workingStyles = `
        .gtm-working-indicator {
            position: fixed;
            top: 8px;
            left: 8px;
            background: #137333;
            color: white;
            padding: 2px 6px;
            border-radius: 8px;
            font-family: 'Roboto', 'Arial', sans-serif;
            font-size: 9px;
            font-weight: 500;
            z-index: 2147483646;
            animation: slideInLeft 0.3s ease-out;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            height: 18px;
            line-height: 18px;
            white-space: nowrap;
            display: flex;
            align-items: center;
            transition: all 0.4s ease;
            cursor: pointer;
            user-select: none;
        }

        .gtm-working-indicator.collapsed {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            padding: 0;
            overflow: hidden;
            background: #137333;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .gtm-working-indicator.collapsed::before {
            content: "✓";
            font-size: 10px;
            font-weight: bold;
            color: white;
        }

        .gtm-working-indicator:not(.collapsed):hover {
            transform: scale(1.05);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .gtm-working-indicator.collapsed:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 6px rgba(19, 115, 51, 0.4);
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;

    // Функции для работы с конфигурациями в хранилище Tampermonkey
    function saveConfiguration(domain, gtmId, isActive = true) {
        const configs = getAllConfigurations();
        configs[domain] = {
            gtmId: gtmId,
            isActive: isActive,
            isPaused: false,
            dateCreated: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        GM_setValue('gtm_configurations', JSON.stringify(configs));
    }

    function getAllConfigurations() {
        try {
            const configs = GM_getValue('gtm_configurations', '{}');
            return JSON.parse(configs);
        } catch(e) {
            return {};
        }
    }

    function getConfigurationForDomain(domain) {
        const configs = getAllConfigurations();
        return configs[domain] || null;
    }

    function deleteConfiguration(domain) {
        const configs = getAllConfigurations();
        delete configs[domain];
        GM_setValue('gtm_configurations', JSON.stringify(configs));
    }

    function updateConfigurationStatus(domain, isActive) {
        const configs = getAllConfigurations();
        if (configs[domain]) {
            configs[domain].isActive = isActive;
            configs[domain].lastUsed = new Date().toISOString();
            GM_setValue('gtm_configurations', JSON.stringify(configs));
        }
    }

    function toggleConfigurationPause(domain) {
        const configs = getAllConfigurations();
        if (configs[domain]) {
            configs[domain].isPaused = !configs[domain].isPaused;
            configs[domain].lastUsed = new Date().toISOString();
            GM_setValue('gtm_configurations', JSON.stringify(configs));
        }
    }

    // Функции для инжекции GTM
    function injectGTM(gtmId) {
        if (document.querySelector(`script[src*="${gtmId}"]`)) {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        script.setAttribute('data-gtm-injector', 'true');
        document.head.appendChild(script);

        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        noscript.setAttribute('data-gtm-injector', 'true');
        document.body.insertBefore(noscript, document.body.firstChild);

        window.dataLayer.push({
            event: 'gtm.injector.connected',
            gtm_id: gtmId,
            domain: currentDomain,
            timestamp: new Date().toISOString()
        });
    }

    function removeGTM() {
        const scripts = document.querySelectorAll('script[data-gtm-injector="true"]');
        scripts.forEach(script => script.remove());

        const noscripts = document.querySelectorAll('noscript[data-gtm-injector="true"]');
        noscripts.forEach(noscript => noscript.remove());

        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'gtm.injector.disconnected',
                timestamp: new Date().toISOString()
            });
        }
    }

    // Глобальные функции для кнопок
    window.editConfig = function(domain) {
        const config = getConfigurationForDomain(domain);
        if (config) {
            const domainInput = document.getElementById('gtm-domain-input');
            const gtmInput = document.getElementById('gtm-id-input');
            if (domainInput && gtmInput) {
                domainInput.value = domain;
                gtmInput.value = config.gtmId;
                const validateInputs = window.validateInputs;
                if (validateInputs) validateInputs();
            }
        }
    };

    window.togglePauseConfig = function(domain) {
        toggleConfigurationPause(domain);
        const overlay = document.querySelector('.gtm-injector-overlay');
        if (overlay) overlay.remove();
        createManagementUI();
        showNotification(`Конфигурация для ${domain} ${getAllConfigurations()[domain].isPaused ? 'приостановлена' : 'возобновлена'}!`);
    };

    window.deleteConfig = function(domain) {
        if (confirm(`Удалить конфигурацию для ${domain}?`)) {
            deleteConfiguration(domain);
            const overlay = document.querySelector('.gtm-injector-overlay');
            if (overlay) overlay.remove();
            createManagementUI();
            showNotification(`Конфигурация для ${domain} удалена!`);
        }
    };

    // НОВЫЕ функции для управления сворачиванием/разворачиванием
    function collapseIndicator() {
        if (!workingIndicator) return;

        workingIndicator.classList.add('collapsed');
        workingIndicator.textContent = '';
    }

    function expandIndicator(gtmId) {
        if (!workingIndicator) return;

        workingIndicator.classList.remove('collapsed');
        workingIndicator.textContent = `${gtmId} · Инжектирован`;

        // Очищаем предыдущий таймер сворачивания
        if (expandTimeout) {
            clearTimeout(expandTimeout);
        }

        // Устанавливаем таймер на сворачивание через 3 секунды при наведении
        expandTimeout = setTimeout(() => {
            collapseIndicator();
        }, 3000);
    }

    function setupIndicatorEvents(gtmId) {
        if (!workingIndicator) return;

        workingIndicator.addEventListener('mouseenter', () => {
            if (workingIndicator.classList.contains('collapsed')) {
                expandIndicator(gtmId);
            }
        });

        workingIndicator.addEventListener('mouseleave', () => {
            if (expandTimeout) {
                clearTimeout(expandTimeout);
            }
            // Быстрое сворачивание при уходе мыши
            expandTimeout = setTimeout(() => {
                collapseIndicator();
            }, 500);
        });
    }

    // Функция для управляющего интерфейса
    function createManagementUI() {
        if (document.querySelector('.gtm-injector-overlay')) return;

        const configs = getAllConfigurations();
        const configEntries = Object.entries(configs);

        const autoGTMId = extractGTMId();

        const overlay = document.createElement('div');
        overlay.className = 'gtm-injector-overlay';
        overlay.innerHTML = `
            <div class="gtm-injector-modal">
                <div class="gtm-injector-header">
                    <svg class="gtm-injector-header-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    <div class="gtm-injector-header-content">
                        <h2 class="gtm-injector-title">GTM Injector - Управление</h2>
                        <p class="gtm-injector-subtitle">Настройка имитации GTM для сайтов клиентов</p>
                    </div>
                </div>
                <div class="gtm-injector-content">
                    <div class="gtm-injector-field">
                        <label class="gtm-injector-label" for="gtm-domain-input">
                            Домен сайта клиента
                        </label>
                        <input
                            type="text"
                            id="gtm-domain-input"
                            class="gtm-injector-input"
                            placeholder="example.com или https://example.com/"
                            value=""
                        >
                    </div>
                    <div class="gtm-injector-field">
                        <label class="gtm-injector-label" for="gtm-id-input">
                            GTM Container ID
                        </label>
                        <input
                            type="text"
                            id="gtm-id-input"
                            class="gtm-injector-input"
                            placeholder="GTM-XXXXXXXX"
                            value="${autoGTMId}"
                        >
                    </div>
                    ${configEntries.length > 0 ? `
                        <div class="gtm-injector-field">
                            <label class="gtm-injector-label">Активные конфигурации</label>
                            <div class="gtm-config-list">
                                ${configEntries.map(([domain, config]) => {
                                    const status = config.isPaused ? 'paused' : (config.isActive ? 'active' : 'inactive');

                                    return `
                                    <div class="gtm-config-item">
                                        <div class="gtm-config-info">
                                            <div class="gtm-config-status ${status}"></div>
                                            <div class="gtm-config-domain">${domain}</div>
                                            <div class="gtm-config-separator">·</div>
                                            <div class="gtm-config-gtm">${config.gtmId}</div>
                                        </div>
                                        <div class="gtm-config-actions">
                                            <button class="gtm-config-icon-btn gtm-config-btn-edit"
                                                    data-tooltip="Редактировать">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button class="gtm-config-icon-btn gtm-config-btn-pause ${config.isPaused ? 'paused' : ''}"
                                                    data-tooltip="${config.isPaused ? 'Возобновить' : 'Приостановить'}">
                                                ${config.isPaused ? `
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <polygon points="5,3 19,12 5,21"></polygon>
                                                    </svg>
                                                ` : `
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <rect x="6" y="4" width="4" height="16"></rect>
                                                        <rect x="14" y="4" width="4" height="16"></rect>
                                                    </svg>
                                                `}
                                            </button>
                                            <button class="gtm-config-icon-btn gtm-config-btn-delete"
                                                    data-tooltip="Удалить">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="3,6 5,6 21,6"></polyline>
                                                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="gtm-empty-state">
                            <div class="gtm-empty-state-icon">🎯</div>
                            <div>Пока нет настроенных конфигураций</div>
                            <div style="font-size: 12px; margin-top: 8px;">Добавьте первую конфигурацию выше</div>
                        </div>
                    `}
                </div>
                <div class="gtm-injector-actions">
                    <button class="gtm-injector-btn gtm-injector-btn-secondary" id="gtm-cancel-btn">
                        Закрыть
                    </button>
                    <button class="gtm-injector-btn gtm-injector-btn-primary" id="gtm-save-btn">
                        Сохранить конфигурацию
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const domainInput = document.getElementById('gtm-domain-input');
        const gtmInput = document.getElementById('gtm-id-input');
        const saveBtn = document.getElementById('gtm-save-btn');
        const cancelBtn = document.getElementById('gtm-cancel-btn');

        // Валидация полей
        function validateInputs() {
            const domain = domainInput.value.trim();
            const gtmId = gtmInput.value.trim();

            const isDomainValid = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
            const isGtmValid = /^GTM-[A-Z0-9]{6,}$/i.test(gtmId);

            saveBtn.disabled = !isDomainValid || !isGtmValid;
        }

        window.validateInputs = validateInputs;

        domainInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                const pastedValue = this.value;
                const domain = urlToDomain(pastedValue);
                if (domain && domain !== pastedValue) {
                    this.value = domain;
                    validateInputs();
                }
            }, 10);
        });

        domainInput.addEventListener('input', validateInputs);
        gtmInput.addEventListener('input', validateInputs);

        saveBtn.addEventListener('click', function() {
            const domain = domainInput.value.trim();
            const gtmId = gtmInput.value.trim().toUpperCase();

            saveConfiguration(domain, gtmId, true);
            overlay.remove();

            showNotification(`Конфигурация для ${domain} сохранена!`);
        });

        cancelBtn.addEventListener('click', function() {
            overlay.remove();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        overlay.addEventListener('click', function(e) {
            if (e.target.closest('.gtm-config-btn-edit')) {
                const domain = e.target.closest('.gtm-config-item').querySelector('.gtm-config-domain').textContent;
                window.editConfig(domain);
            } else if (e.target.closest('.gtm-config-btn-pause')) {
                const domain = e.target.closest('.gtm-config-item').querySelector('.gtm-config-domain').textContent;
                window.togglePauseConfig(domain);
            } else if (e.target.closest('.gtm-config-btn-delete')) {
                const domain = e.target.closest('.gtm-config-item').querySelector('.gtm-config-domain').textContent;
                window.deleteConfig(domain);
            }
        });

        validateInputs();
        setTimeout(() => domainInput.focus(), 100);
    }

    // ОБНОВЛЕННАЯ функция для рабочего режима с автосворачиванием
    function createWorkingIndicator(gtmId) {
        // Удаляем существующее уведомление если есть
        if (workingIndicator) {
            workingIndicator.remove();
        }

        workingIndicator = document.createElement('div');
        workingIndicator.className = 'gtm-working-indicator';
        workingIndicator.textContent = `${gtmId} · Инжектирован`;

        document.body.appendChild(workingIndicator);

        // Настраиваем события наведения
        setupIndicatorEvents(gtmId);

        // Устанавливаем автосворачивание через 10 секунд
        collapseTimeout = setTimeout(() => {
            collapseIndicator();
        }, 10000);
    }

    // Вспомогательные функции
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #137333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 2147483647;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function addStyles() {
        if (document.getElementById('gtm-injector-styles')) return;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'gtm-injector-styles';

        if (shouldShowButton) {
            styleSheet.textContent = commonStyles + managementStyles;
        } else {
            styleSheet.textContent = commonStyles + workingStyles;
        }

        document.head.appendChild(styleSheet);
    }

    // УЛУЧШЕННАЯ функция для динамического управления кнопкой
    function updateButtonVisibility() {
        const newShouldShow = checkButtonConditions();

        if (newShouldShow !== shouldShowButton) {
            shouldShowButton = newShouldShow;

            if (shouldShowButton) {
                createSettingsButton();
                addStyles();
                startButtonMonitoring();
            } else {
                if (floatingButton) {
                    floatingButton.remove();
                    floatingButton = null;
                }
                stopButtonMonitoring();
            }
        }
    }

    // НОВАЯ функция для мониторинга кнопки
    function startButtonMonitoring() {
        // Останавливаем предыдущий мониторинг если есть
        stopButtonMonitoring();

        // Запускаем регулярную проверку кнопки
        buttonCheckInterval = setInterval(() => {
            if (!document.querySelector('.gtm-settings-button')) {
                createSettingsButton();
            }
        }, 1000); // Проверяем каждую секунду
    }

    function stopButtonMonitoring() {
        if (buttonCheckInterval) {
            clearInterval(buttonCheckInterval);
            buttonCheckInterval = null;
        }
    }

    // УЛУЧШЕННАЯ функция для отслеживания изменений URL
    function setupURLWatcher() {
        // Усиленный MutationObserver
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                // Проверяем изменения в DOM
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
                // Проверяем изменения атрибутов
                if (mutation.type === 'attributes') {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                // Проверяем URL
                if (window.location.href !== currentURL) {
                    currentURL = window.location.href;
                    updateButtonVisibility();
                }

                // Проверяем наличие кнопки
                if (shouldShowButton && !document.querySelector('.gtm-settings-button')) {
                    setTimeout(createSettingsButton, 100);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });

        // Отслеживание изменений истории браузера
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                currentURL = window.location.href;
                updateButtonVisibility();
            }, 100);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                currentURL = window.location.href;
                updateButtonVisibility();
            }, 100);
        };

        window.addEventListener('popstate', () => {
            setTimeout(() => {
                currentURL = window.location.href;
                updateButtonVisibility();
            }, 100);
        });

        // Дополнительное отслеживание фокуса окна
        window.addEventListener('focus', () => {
            setTimeout(() => {
                if (shouldShowButton && !document.querySelector('.gtm-settings-button')) {
                    createSettingsButton();
                }
            }, 500);
        });
    }

    // Функция для создания кнопки настроек с правильным размещением и плавным появлением
    function createSettingsButton() {
        if (!shouldShowButton) return;

        const container = findGTMContainer();

        if (!container) {
            setTimeout(createSettingsButton, 1000);
            return;
        }

        // Удаляем существующую кнопку если есть
        const existingButton = document.querySelector('.gtm-settings-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Создаем кнопку
        floatingButton = document.createElement('button');
        floatingButton.className = 'gtm-settings-button';
        floatingButton.title = 'GTM Injector - Управление конфигурациями';

        floatingButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            GTM Инжектор
        `;

        floatingButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            createManagementUI();
        });

        // Размещаем кнопку слева от контейнера GTM ID
        container.parentNode.insertBefore(floatingButton, container);

        // Принудительно применяем стили к родительским элементам
        const parentContainer = container.parentNode;
        if (parentContainer) {
            parentContainer.style.display = 'flex';
            parentContainer.style.alignItems = 'center';
            parentContainer.style.gap = '8px';
        }

        // Запускаем плавное появление
        setTimeout(() => {
            floatingButton.classList.add('show');
        }, 50);
    }

    // Основная функция инициализации
    function init() {
        shouldShowButton = checkButtonConditions();
        addStyles();

        if (window.location.hostname === 'tagmanager.google.com') {
            if (shouldShowButton) {
                createSettingsButton();
                setupURLWatcher();
                startButtonMonitoring();
            } else {
                setupURLWatcher();
            }
        } else {
            // Рабочий режим на целевых сайтах
            const config = getConfigurationForDomain(currentDomain);

            if (config && config.isActive && !config.isPaused) {
                injectGTM(config.gtmId);
                createWorkingIndicator(config.gtmId);
                updateConfigurationStatus(currentDomain, true);
            }
        }
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // УСИЛЕННЫЕ дополнительные проверки для надежности
    setTimeout(() => {
        if (window.location.hostname === 'tagmanager.google.com') {
            if (shouldShowButton && !document.querySelector('.gtm-settings-button')) {
                createSettingsButton();
            }
        }
    }, 1000);

    setTimeout(() => {
        if (window.location.hostname === 'tagmanager.google.com') {
            if (shouldShowButton && !document.querySelector('.gtm-settings-button')) {
                createSettingsButton();
            }
        }
    }, 3000);

    setTimeout(() => {
        if (window.location.hostname === 'tagmanager.google.com') {
            if (shouldShowButton && !document.querySelector('.gtm-settings-button')) {
                createSettingsButton();
            }
        }
    }, 5000);

})();
