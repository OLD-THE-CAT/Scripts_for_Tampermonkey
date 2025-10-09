// ==UserScript==
// @name         YDirect. Чистка РСЯ площадок
// @namespace    http://tampermonkey.net/
// @version      4.10
// @description  Изменен заголовок на "Чистка РСЯ площадок"
// @author       ИП Ульянов
// @match        https://direct.yandex.ru/*
// @match        https://direct.yandex.kz/*
// @grant        none
// @icon         data:image/png;base64,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
// ==/UserScript==

(function() {
    'use strict';

    // --- Helpers ---
    function getKeywords() {
        let val = localStorage.getItem('checkbox_keywords');
        return val ? val.split(',').map(x=>x.trim()).filter(Boolean) : ['com.','.app','games','game','dsp.','dsp-','dsp'];
    }
    function setKeywords(valArr) {
        let all = Array.from(new Set(valArr.map(x => x.trim()).filter(Boolean)));
        localStorage.setItem('checkbox_keywords', all.join(','));
    }
    function getExclude() {
        let val = localStorage.getItem('checkbox_exclude');
        return val ? val.split(',').map(x=>x.trim()).filter(Boolean) : ['ru.yandex.mobile.zen','ru.avito.app','ru.yandex.mail','ru.investing.com','yandex','avito','ru.mail'];
    }
    function setExclude(valArr) {
        let all = Array.from(new Set(valArr.map(x => x.trim()).filter(Boolean)));
        localStorage.setItem('checkbox_exclude', all.join(','));
    }
    function panelShouldBeVisible() {
        return window.location.href.includes('stat_type=pages');
    }

    // --- Theme helpers ---
    function getTheme() {
        const saved = localStorage.getItem('checkbox_theme');
        if (saved && saved !== 'auto') return saved;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    function setTheme(theme) {
        localStorage.setItem('checkbox_theme', theme);
    }
    function getAccentColor() {
        return localStorage.getItem('checkbox_accent') || '#ff3333';
    }

    // --- Position helpers (только для панели) ---
    function savePanelPosition(x, y) {
        localStorage.setItem('custom_checkbox_panel_pos', JSON.stringify({x, y}));
    }
    function loadPanelPosition() {
        try {
            let pos = JSON.parse(localStorage.getItem('custom_checkbox_panel_pos'));
            return pos && typeof pos.x === 'number' && typeof pos.y === 'number' ? pos : {x: null, y: null};
        } catch {
            return {x: null, y: null};
        }
    }

    function arrToTextarea(arr) {
        return arr.join('\n');
    }
    function textareaToArr(txt) {
        return txt.split('\n').map(x=>x.trim()).filter(Boolean);
    }

    // --- Функция поиска якорного элемента ---
    function findAnchorElement() {
        let anchor = document.querySelector('[data-testid="RecommendationStories.IconTrigger"]');
        if (anchor) return anchor;

        anchor = document.querySelector('.dc-UserBarItem');
        if (anchor) return anchor;

        return null;
    }

    // --- Функция автоматической подстройки размера панели ---
    function adjustPanelSize(panel) {
        if (!panel) return;

        // Убираем фиксированные размеры
        panel.style.width = 'auto';
        panel.style.height = 'auto';
        panel.style.maxWidth = '450px';
        panel.style.minWidth = '350px';

        // Позволяем контенту определить размер
        const content = panel.querySelector('#panel-content');
        if (content) {
            content.style.width = 'auto';
            content.style.height = 'auto';
        }

        // Проверяем, не выходит ли панель за границы экрана
        setTimeout(() => {
            const rect = panel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Корректируем позицию если панель выходит за границы
            if (rect.right > viewportWidth) {
                panel.style.left = (viewportWidth - rect.width - 20) + 'px';
            }
            if (rect.bottom > viewportHeight) {
                panel.style.top = (viewportHeight - rect.height - 20) + 'px';
            }
            if (rect.left < 0) {
                panel.style.left = '20px';
            }
            if (rect.top < 0) {
                panel.style.top = '20px';
            }
        }, 10);
    }

    // --- Темы ---
    const themes = {
        dark: {
            panelBg: 'linear-gradient(145deg, rgba(18,18,23,0.98) 0%, rgba(25,25,35,0.95) 100%)',
            headerBg: 'linear-gradient(135deg, #ff3333 0%, #ff6b6b 50%, #0066cc 100%)',
            cardBg: 'rgba(255,255,255,0.05)',
            textColor: '#ffffff',
            textSecondary: 'rgba(255,255,255,0.7)',
            textMuted: 'rgba(255,255,255,0.5)',
            inputBg: 'rgba(255,255,255,0.08)',
            inputBorder: 'rgba(255,255,255,0.15)',
            inputFocusBorder: '#ff3333',
            buttonBg: 'rgba(255,51,51,0.15)',
            buttonBorder: 'rgba(255,51,51,0.3)',
            buttonColor: '#ff6b6b',
            successColor: '#4caf50',
            warningColor: '#ff9800',
            errorColor: '#f44336'
        },
        light: {
            panelBg: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            headerBg: 'linear-gradient(135deg, #ff3333 0%, #ff6b6b 50%, #0066cc 100%)',
            cardBg: 'rgba(255,255,255,0.8)',
            textColor: '#1a1a1a',
            textSecondary: 'rgba(26,26,26,0.7)',
            textMuted: 'rgba(26,26,26,0.5)',
            inputBg: 'rgba(255,255,255,0.9)',
            inputBorder: 'rgba(0,0,0,0.12)',
            inputFocusBorder: '#ff3333',
            buttonBg: 'rgba(255,51,51,0.1)',
            buttonBorder: 'rgba(255,51,51,0.2)',
            buttonColor: '#d32f2f',
            successColor: '#2e7d32',
            warningColor: '#f57c00',
            errorColor: '#d32f2f'
        }
    };

    // --- Глобальные переменные для drag&drop ---
    let isDragging = false;
    let dragElement = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // --- Функция копирования ---
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return Promise.resolve();
        }
    }

    // --- Функция показа тостов ---
    function showToast(message, type = 'success') {
        const currentTheme = themes[getTheme()];
        const toast = document.createElement('div');

        const colors = {
            success: currentTheme.successColor,
            warning: currentTheme.warningColor,
            error: currentTheme.errorColor
        };

        const icons = {
            success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>`,
            warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`
        };

        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="color:${colors[type]};flex-shrink:0;">${icons[type]}</div>
                <div style="color:${currentTheme.textColor};font-weight:500;font-size:13px;">${message}</div>
            </div>
        `;

        toast.style = `
            position:fixed;top:20px;right:20px;z-index:20000;
            background:${currentTheme.cardBg};
            backdrop-filter:blur(20px);
            border:1px solid ${colors[type]}40;
            border-radius:10px;
            padding:12px 16px;
            box-shadow:0 6px 24px rgba(0,0,0,0.15);
            transform:translateX(100%);
            transition:all 0.4s ease;
            max-width:320px;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    // --- Создание компактного textarea с кнопкой копирования (БЕЗ АНИМАЦИЙ) ---
    function createTextareaWithCopyButton(placeholder, initialValue, rows = 3) {
        const currentTheme = themes[getTheme()];
        const container = document.createElement('div');
        container.style = 'position:relative;margin-bottom:12px;';

        const textarea = document.createElement('textarea');
        textarea.value = initialValue;
        textarea.rows = rows;
        textarea.placeholder = placeholder;
        textarea.style = `
            width:100%;
            padding:10px 12px;
            border:1px solid ${currentTheme.inputBorder};
            border-radius:8px;
            font-size:13px;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
            resize:vertical;
            padding-right:45px;
            box-sizing:border-box;
            background:${currentTheme.inputBg};
            backdrop-filter:blur(10px);
            color:${currentTheme.textColor};
            line-height:1.4;
            min-height:80px;
        `;

        // УБРАНЫ ПЛАВНЫЕ АНИМАЦИИ - только мгновенное изменение цветов
        textarea.addEventListener('focus', () => {
            textarea.style.border = `1px solid ${currentTheme.inputFocusBorder}`;
            textarea.style.boxShadow = `0 0 0 3px ${currentTheme.inputFocusBorder}20`;
        });

        textarea.addEventListener('blur', () => {
            textarea.style.border = `1px solid ${currentTheme.inputBorder}`;
            textarea.style.boxShadow = 'none';
        });

        // Автоматическая подстройка размера при изменении содержимого (БЕЗ АНИМАЦИИ)
        textarea.addEventListener('input', () => {
            // Подстраиваем высоту textarea мгновенно
            textarea.style.height = 'auto';
            textarea.style.height = Math.max(80, textarea.scrollHeight) + 'px';

            // Подстраиваем размер панели
            const panel = document.getElementById('custom-checkbox-panel');
            if (panel) {
                adjustPanelSize(panel);
            }
        });

        const copyButton = document.createElement('button');
        copyButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyButton.title = 'Копировать';
        copyButton.style = `
            position:absolute;
            top:8px;
            right:8px;
            width:28px;
            height:28px;
            background:${currentTheme.buttonBg};
            border:1px solid ${currentTheme.buttonBorder};
            border-radius:6px;
            cursor:pointer;
            color:${currentTheme.buttonColor};
            display:none;
            align-items:center;
            justify-content:center;
            backdrop-filter:blur(10px);
            z-index:2;
            transition:all 0.2s ease;
        `;

        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.transform = 'scale(1.1)';
        });

        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.transform = 'scale(1)';
        });

        container.addEventListener('mouseenter', () => {
            if (textarea.value.trim()) {
                copyButton.style.display = 'flex';
            }
        });

        container.addEventListener('mouseleave', () => {
            copyButton.style.display = 'none';
        });

        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            copyToClipboard(textarea.value).then(() => {
                copyButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                `;
                copyButton.style.color = currentTheme.successColor;
                showToast('Скопировано', 'success');
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                    copyButton.style.color = currentTheme.buttonColor;
                }, 2000);
            }).catch(() => {
                showToast('Ошибка копирования', 'error');
            });
        });

        container.appendChild(textarea);
        container.appendChild(copyButton);

        return { container, textarea };
    }

    // --- Глобальные обработчики drag&drop ---
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !dragElement) return;
        e.preventDefault();

        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;

        dragElement.style.left = newX + 'px';
        dragElement.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging || !dragElement) return;

        isDragging = false;
        dragElement.style.cursor = 'grab';

        if (dragElement.id === 'custom-checkbox-panel') {
            savePanelPosition(dragElement.offsetLeft, dragElement.offsetTop);
        }

        dragElement = null;
        document.body.style.userSelect = "";
    });

    function addOrRemovePanel() {
        let panel = document.getElementById('custom-checkbox-panel');
        let toggleBtn = document.getElementById('custom-checkbox-toggle');
        if (panelShouldBeVisible()) {
            if (!panel && !toggleBtn) addCustomPanel();
        } else {
            if (panel) panel.remove();
            if (toggleBtn) toggleBtn.remove();
        }
    }

    function addCustomPanel() {
        if (document.getElementById('custom-checkbox-panel')) return;

        const currentTheme = themes[getTheme()];
        const accentColor = getAccentColor();

        // --- Toggle button привязан к якорному элементу ---
        function showToggleBtn(show) {
            let btn = document.getElementById('custom-checkbox-toggle');
            if (show) {
                if (btn) return;

                const anchorElement = findAnchorElement();
                if (!anchorElement) {
                    console.warn('Якорный элемент не найден, используем фиксированную позицию');
                }

                btn = document.createElement('button');
                btn.id = 'custom-checkbox-toggle';
                btn.title = 'Открыть панель чистки РСЯ';
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                `;

                if (anchorElement) {
                    btn.style = `
                        position:absolute;z-index:10000;width:36px;height:36px;
                        display:flex;align-items:center;justify-content:center;
                        background:linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%);
                        border-radius:8px;border:none;
                        box-shadow:0 4px 15px ${accentColor}40;
                        color:#ffffff;cursor:pointer;
                        backdrop-filter:blur(10px);
                        top:100%;
                        left:0;
                        margin-top:8px;
                    `;

                    anchorElement.style.position = 'relative';
                    anchorElement.appendChild(btn);
                } else {
                    btn.style = `
                        position:fixed;z-index:10000;width:42px;height:42px;
                        display:flex;align-items:center;justify-content:center;
                        background:linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%);
                        border-radius:10px;border:none;
                        box-shadow:0 6px 20px ${accentColor}40;
                        color:#ffffff;cursor:grab;
                        backdrop-filter:blur(10px);
                        left:20px;
                        top:20px;
                    `;
                    document.body.appendChild(btn);
                }

                btn.addEventListener('mouseenter', () => {
                    if (!isDragging) {
                        btn.style.transform = 'scale(1.05)';
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    if (!isDragging) {
                        btn.style.transform = 'scale(1)';
                    }
                });

                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!isDragging) {
                        btn.remove();
                        showPanel();
                    }
                });

            } else {
                if (btn) btn.remove();
            }
        }

        // --- Панель с автоматическими размерами ---
        function showPanel() {
            let panel = document.getElementById('custom-checkbox-panel');
            if (panel) {
                panel.style.display = '';
                adjustPanelSize(panel);
            }
        }

        function hidePanelWithAnim() {
            let panel = document.getElementById('custom-checkbox-panel');
            if (panel) {
                panel.style.display = 'none';
                showToggleBtn(true);
            }
        }

        const panel = document.createElement('div');
        panel.id = 'custom-checkbox-panel';
        panel.style = `
            position:fixed;z-index:9999;
            background:${currentTheme.panelBg};
            backdrop-filter:blur(25px);
            border:1px solid ${currentTheme.inputBorder};
            border-radius:16px;
            box-shadow:0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05);
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
            color:${currentTheme.textColor};
            box-sizing:border-box;
            overflow:visible;
            width:auto;
            height:auto;
            max-width:450px;
            min-width:350px;
        `;

        let panelPos = loadPanelPosition();
        if (panelPos.x !== null && panelPos.y !== null) {
            panel.style.left = panelPos.x + 'px';
            panel.style.top = panelPos.y + 'px';
        } else {
            panel.style.top = '20px';
            panel.style.right = '20px';
        }

        // --- Drag&Drop панели ---
        panel.addEventListener('mousedown', function(e) {
            if (e.target !== panel && (!e.target.closest || !e.target.closest('#custom-checkbox-panel'))) return;
            if (e.clientY - panel.getBoundingClientRect().top > 60) return;

            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            dragElement = panel;

            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            panel.style.cursor = 'move';
            document.body.style.userSelect = "none";
        });

        // --- Заголовок (ИЗМЕНЕН НА "Чистка РСЯ площадок") ---
        const header = document.createElement('div');
        header.style = `
            padding:16px 20px 12px 20px;
            background:${currentTheme.headerBg};
            margin:-1px -1px 0 -1px;
            border-radius:16px 16px 0 0;
            cursor:move;
            position:relative;
            overflow:hidden;
        `;

        const headerDecor = document.createElement('div');
        headerDecor.style = `
            position:absolute;
            top:0;right:0;
            width:80px;height:80px;
            background:radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius:50%;
            transform:translate(25px, -25px);
        `;
        header.appendChild(headerDecor);

        const headerTitle = document.createElement('div');
        headerTitle.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;position:relative;z-index:1;">
                <div style="width:28px;height:28px;background:rgba(255,255,255,0.2);border-radius:6px;display:flex;align-items:center;justify-content:center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                </div>
                <div>
                    <div style="font-size:16px;font-weight:700;">Чистка РСЯ площадок</div>
                </div>
            </div>
        `;
        headerTitle.style = 'color:#ffffff;';
        header.appendChild(headerTitle);

        // --- Переключатель темы ---
        const themeToggle = document.createElement('button');
        const currentThemeType = getTheme();
        themeToggle.innerHTML = currentThemeType === 'dark' ?
            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>` :
            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>`;
        themeToggle.title = currentThemeType === 'dark' ? 'Светлая тема' : 'Темная тема';
        themeToggle.style = `
            position:absolute;top:14px;right:50px;
            width:32px;height:32px;
            background:rgba(255,255,255,0.15);
            border:1px solid rgba(255,255,255,0.2);
            border-radius:8px;cursor:pointer;
            color:#ffffff;display:flex;align-items:center;justify-content:center;
            transition:all 0.3s ease;
            z-index:2;
        `;
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.background = 'rgba(255,255,255,0.25)';
            themeToggle.style.transform = 'scale(1.05)';
        });
        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.background = 'rgba(255,255,255,0.15)';
            themeToggle.style.transform = 'scale(1)';
        });
        themeToggle.onclick = () => {
            const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            location.reload();
        };
        header.appendChild(themeToggle);

        // --- Кнопка сворачивания ---
        const minimizeBtn = document.createElement('button');
        minimizeBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        `;
        minimizeBtn.title = 'Свернуть';
        minimizeBtn.style = `
            position:absolute;top:14px;right:14px;
            width:32px;height:32px;
            background:rgba(255,255,255,0.15);
            border:1px solid rgba(255,255,255,0.2);
            border-radius:8px;cursor:pointer;
            color:#ffffff;display:flex;align-items:center;justify-content:center;
            transition:all 0.3s ease;
            z-index:2;
        `;
        minimizeBtn.addEventListener('mouseenter', () => {
            minimizeBtn.style.background = 'rgba(255,255,255,0.25)';
            minimizeBtn.style.transform = 'scale(1.05)';
        });
        minimizeBtn.addEventListener('mouseleave', () => {
            minimizeBtn.style.background = 'rgba(255,255,255,0.15)';
            minimizeBtn.style.transform = 'scale(1)';
        });
        minimizeBtn.onclick = () => {
            hidePanelWithAnim();
        };
        header.appendChild(minimizeBtn);

        panel.appendChild(header);

        // --- Контент с автоматическими размерами ---
        const content = document.createElement('div');
        content.id = 'panel-content';
        content.style = `
            padding:16px;
            width:100%;
            box-sizing:border-box;
        `;

        // Ключевые слова
        const kwLabel = document.createElement('div');
        kwLabel.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;font-weight:600;margin-bottom:6px;color:${currentTheme.textColor};">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
                Ключевые слова
            </div>
            <div style="font-size:11px;color:${currentTheme.textSecondary};margin-bottom:8px;">Площадки с этими словами будут выбраны</div>
        `;
        content.appendChild(kwLabel);

        const kwTextareaContainer = createTextareaWithCopyButton(
            'Введите ключевые слова...',
            arrToTextarea(getKeywords()),
            3
        );
        const kwArea = kwTextareaContainer.textarea;
        content.appendChild(kwTextareaContainer.container);

        // Исключения
        const exLabel = document.createElement('div');
        exLabel.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;font-weight:600;margin-bottom:6px;color:${currentTheme.textColor};">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Исключения
            </div>
            <div style="font-size:11px;color:${currentTheme.textSecondary};margin-bottom:8px;">Площадки с этими словами будут пропущены</div>
        `;
        content.appendChild(exLabel);

        const exTextareaContainer = createTextareaWithCopyButton(
            'Введите исключения...',
            arrToTextarea(getExclude()),
            3
        );
        const exArea = exTextareaContainer.textarea;
        content.appendChild(exTextareaContainer.container);

        // Кнопка "Сохранить"
        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17,21 17,13 7,13 7,21"></polyline>
                <polyline points="7,3 7,8 15,8"></polyline>
            </svg>
            Сохранить
        `;
        saveBtn.style = `
            display:none;width:100%;margin-bottom:12px;
            padding:10px 16px;font-size:13px;font-weight:600;
            background:linear-gradient(135deg, ${currentTheme.warningColor} 0%, ${currentTheme.warningColor}dd 100%);
            color:#ffffff;border:none;border-radius:8px;cursor:pointer;
            transition:all 0.3s ease;
            box-shadow:0 3px 10px ${currentTheme.warningColor}40;
        `;
        content.appendChild(saveBtn);

        function showSaveBtn() {
            saveBtn.style.display = '';
            // Подстраиваем размер панели при появлении кнопки
            setTimeout(() => adjustPanelSize(panel), 10);
        }
        function hideSaveBtn() {
            saveBtn.style.display = 'none';
            // Подстраиваем размер панели при скрытии кнопки
            setTimeout(() => adjustPanelSize(panel), 10);
        }

        kwArea.addEventListener('input', showSaveBtn);
        exArea.addEventListener('input', showSaveBtn);

        saveBtn.onclick = function() {
            setKeywords(textareaToArr(kwArea.value));
            setExclude(textareaToArr(exArea.value));
            kwArea.value = arrToTextarea(getKeywords());
            exArea.value = arrToTextarea(getExclude());
            hideSaveBtn();
            showToast('Настройки сохранены', 'success');
        };

        // Главная кнопка
        const mainBtn = document.createElement('button');
        mainBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            Выбрать площадки
        `;
        mainBtn.style = `
            width:100%;margin-bottom:12px;
            padding:12px 16px;font-size:14px;font-weight:600;
            background:linear-gradient(135deg, ${currentTheme.successColor} 0%, ${currentTheme.successColor}dd 100%);
            color:#ffffff;border:none;border-radius:8px;cursor:pointer;
            transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px ${currentTheme.successColor}40;
        `;

        mainBtn.addEventListener('mouseenter', () => {
            mainBtn.style.transform = 'translateY(-2px) scale(1.02)';
            mainBtn.style.boxShadow = `0 6px 20px ${currentTheme.successColor}50`;
        });

        mainBtn.addEventListener('mouseleave', () => {
            mainBtn.style.transform = 'translateY(0) scale(1)';
            mainBtn.style.boxShadow = `0 3px 10px ${currentTheme.successColor}40`;
        });

        content.appendChild(mainBtn);

        // Кнопки управления
        const controlsGrid = document.createElement('div');
        controlsGrid.style = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;';

        const exportBtn = document.createElement('button');
        exportBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span style="font-size:11px;">Экспорт</span>
        `;
        exportBtn.style = `
            padding:8px 6px;font-weight:500;
            background:${currentTheme.buttonBg};
            border:1px solid ${currentTheme.buttonBorder};
            color:${currentTheme.buttonColor};border-radius:6px;cursor:pointer;
            transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;
            backdrop-filter:blur(10px);
        `;

        exportBtn.addEventListener('mouseenter', () => {
            exportBtn.style.transform = 'translateY(-1px) scale(1.05)';
            exportBtn.style.background = currentTheme.buttonColor + '20';
        });

        exportBtn.addEventListener('mouseleave', () => {
            exportBtn.style.transform = 'translateY(0) scale(1)';
            exportBtn.style.background = currentTheme.buttonBg;
        });

        const importBtn = document.createElement('button');
        importBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17,8 12,3 7,8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span style="font-size:11px;">Импорт</span>
        `;
        importBtn.style = `
            padding:8px 6px;font-weight:500;
            background:${currentTheme.buttonBg};
            border:1px solid ${currentTheme.buttonBorder};
            color:${currentTheme.buttonColor};border-radius:6px;cursor:pointer;
            transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;
            backdrop-filter:blur(10px);
        `;

        importBtn.addEventListener('mouseenter', () => {
            importBtn.style.transform = 'translateY(-1px) scale(1.05)';
            importBtn.style.background = currentTheme.buttonColor + '20';
        });

        importBtn.addEventListener('mouseleave', () => {
            importBtn.style.transform = 'translateY(0) scale(1)';
            importBtn.style.background = currentTheme.buttonBg;
        });

        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
            </svg>
            <span style="font-size:11px;">Очистить</span>
        `;
        clearBtn.style = `
            padding:8px 6px;font-weight:500;
            background:rgba(244,67,54,0.2);
            border:1px solid rgba(244,67,54,0.3);
            color:#f44336;border-radius:6px;cursor:pointer;
            transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;
            backdrop-filter:blur(10px);
        `;

        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.transform = 'translateY(-1px) scale(1.05)';
            clearBtn.style.background = 'rgba(244,67,54,0.3)';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.transform = 'translateY(0) scale(1)';
            clearBtn.style.background = 'rgba(244,67,54,0.2)';
        });

        controlsGrid.appendChild(exportBtn);
        controlsGrid.appendChild(importBtn);
        controlsGrid.appendChild(clearBtn);
        content.appendChild(controlsGrid);

        // Файл-инпут
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.json';
        fileInput.style = 'display:none;';
        content.appendChild(fileInput);

        panel.appendChild(content);

        // === ЛОГИКА КНОПОК ===

        mainBtn.onclick = function() {
            setKeywords(textareaToArr(kwArea.value));
            setExclude(textareaToArr(exArea.value));
            kwArea.value = arrToTextarea(getKeywords());
            exArea.value = arrToTextarea(getExclude());
            hideSaveBtn();

            const c = document.querySelectorAll("input.checkbox__control[type='checkbox'][id^='uniq']");
            let checked = 0;
            const keywords = getKeywords();
            const exclude = getExclude();

            for(let i=0; i<c.length; i++){
                const v = c[i].value.toLowerCase();
                const f = keywords.some(function(k){ return v.indexOf(k) > -1 });
                const s = exclude.some(function(e){ return v.indexOf(e) > -1 });
                if(f && !s) {
                    c[i].click();
                    checked++;
                }
            }

            showToast(`Выбрано: ${checked}`, 'success');
        };

        exportBtn.onclick = function() {
            setKeywords(textareaToArr(kwArea.value));
            setExclude(textareaToArr(exArea.value));
            hideSaveBtn();
            const keywords = getKeywords();
            const exclude = getExclude();
            const txt =
                `"keywords":\n${keywords.join('\n')}\n\n` +
                `"exclude":\n${exclude.join('\n')}\n`;
            const blob = new Blob([txt], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'yandex-direct-filters.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            showToast('Экспортировано', 'success');
        };

        importBtn.onclick = function() {
            fileInput.value = '';
            fileInput.click();
        };

        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                try {
                    let txt = ev.target.result;
                    let keywords = [];
                    let exclude = [];
                    try {
                        let obj = JSON.parse(txt);
                        if (obj.keywords && Array.isArray(obj.keywords)) keywords = obj.keywords;
                        if (obj.exclude && Array.isArray(obj.exclude)) exclude = obj.exclude;
                    } catch {
                        let kwMatch = txt.match(/"keywords"\s*:\s*([\s\S]*?)(\n\n|$)/i);
                        let exMatch = txt.match(/"exclude"\s*:\s*([\s\S]*?)(\n\n|$)/i);
                        if (kwMatch) {
                            let arr = kwMatch[1].split('\n').map(x=>x.trim()).filter(Boolean);
                            if (arr.length === 1 && arr[0].includes(',')) arr = arr[0].split(',').map(x=>x.trim());
                            keywords = arr;
                        }
                        if (exMatch) {
                            let arr = exMatch[1].split('\n').map(x=>x.trim()).filter(Boolean);
                            if (arr.length === 1 && arr[0].includes(',')) arr = arr[0].split(',').map(x=>x.trim());
                            exclude = arr;
                        }
                    }
                    setKeywords(getKeywords().concat(keywords));
                    setExclude(getExclude().concat(exclude));
                    kwArea.value = arrToTextarea(getKeywords());
                    exArea.value = arrToTextarea(getExclude());
                    hideSaveBtn();

                    showToast('Импортировано!', 'success');
                } catch (e) {
                    showToast('Ошибка импорта', 'error');
                }
            };
            reader.readAsText(file);
        };

        clearBtn.onclick = function() {
            if (!confirm('Очистить все данные?')) return;
            setKeywords([]);
            setExclude([]);
            kwArea.value = '';
            exArea.value = '';
            hideSaveBtn();

            showToast('Очищено', 'success');
        };

        document.body.appendChild(panel);

        // Подстраиваем размер панели после создания
        setTimeout(() => {
            adjustPanelSize(panel);
            showPanel();
        }, 10);
    }

    // SPA-навигация
    const observer = new MutationObserver(() => {
        setTimeout(addOrRemovePanel, 1000);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(addOrRemovePanel, 1000);
        }
    }, 500);

    setTimeout(addOrRemovePanel, 2000);
})();
