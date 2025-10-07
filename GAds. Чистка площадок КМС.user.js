// ==UserScript==
// @name         GAds. Чистка площадок КМС
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Всё работает, как раньше, плюс перемещение панели/иконки
// @author       ИП Ульянов
// @match        https://ads.google.com/*
// @grant        none
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%A7%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D0%BE%D0%BA%20%D0%9A%D0%9C%D0%A1.user.js
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GAds.%20%D0%A7%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D0%BE%D0%BA%20%D0%9A%D0%9C%D0%A1.user.js
// @icon         https://img.icons8.com/color/48/google-ads.png
// ==/UserScript==

(function() {
    'use strict';

    // ----------- DRAG&DROP -----------
    function makeDraggable(elem, storageKey, defaultPos, clickHandler, dragTarget) {
        let offsetX = 0, offsetY = 0, isDragging = false, wasDragged = false, dragStartX = 0, dragStartY = 0;
        const targetElem = dragTarget || elem;
        targetElem.style.position = 'fixed';
        targetElem.style.zIndex = 9999;

        function setPos(x, y) {
            targetElem.style.left = x + 'px';
            targetElem.style.top = y + 'px';
        }

        function savePos(x, y) {
            localStorage.setItem(storageKey, JSON.stringify({x, y}));
        }

        function getSavedPos() {
            let raw = localStorage.getItem(storageKey);
            if (raw) try { return JSON.parse(raw); } catch {}
            return null;
        }

        function restoreLastPos() {
            let pos = getSavedPos() || defaultPos;
            setPos(pos.x, pos.y);
        }

        function onMouseDown(e) {
            isDragging = true;
            wasDragged = false;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            offsetX = e.clientX - targetElem.getBoundingClientRect().left;
            offsetY = e.clientY - targetElem.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            targetElem.style.transition = "none";
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            let moveX = Math.abs(e.clientX - dragStartX);
            let moveY = Math.abs(e.clientY - dragStartY);
            if (moveX > 3 || moveY > 3) wasDragged = true;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - targetElem.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - targetElem.offsetHeight, y));
            setPos(x, y);
        }

        function onMouseUp(e) {
            isDragging = false;
            let x = targetElem.getBoundingClientRect().left;
            let y = targetElem.getBoundingClientRect().top;
            savePos(x, y);
            targetElem.style.transition = "";
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (!wasDragged && typeof clickHandler === "function") clickHandler();
        }

        elem.addEventListener('mousedown', function(e) {
            onMouseDown(e);
            e.preventDefault();
        });

        restoreLastPos();
        elem.__restoreLastPos = restoreLastPos;
        targetElem.__restoreLastPos = restoreLastPos;
    }

    // --- Поиск целевого элемента ---
    function findTargetElement() {
        const selectors = [
            'div.app-menus-right._ngcontent-awn-AWSM-38', // Основной контейнер
            '.app-menus-right[class*="_ngcontent-awn-AWSM"]', // Альтернативный селектор
            'div[class*="app-menus-right"]', // Упрощенный селектор
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    console.log('Найден целевой элемент app-menus-right:', selector, element);
                    return element;
                }
            }
        }

        // Дополнительный поиск - ищем по содержимому (кнопка Внешний вид внутри)
        const appearanceButton = document.querySelector('material-button[aria-label="Внешний вид"]');
        if (appearanceButton) {
            const appMenusRight = appearanceButton.closest('div[class*="app-menus-right"], div.app-menus-right');
            if (appMenusRight) {
                const rect = appMenusRight.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    console.log('Найден элемент app-menus-right через кнопку Внешний вид:', appMenusRight);
                    return appMenusRight;
                }
            }
        }

        // Поиск через уведомления
        const notificationsBell = document.querySelector('notifications-bell-portal');
        if (notificationsBell) {
            const appMenusRight = notificationsBell.closest('div[class*="app-menus-right"], div.app-menus-right');
            if (appMenusRight) {
                const rect = appMenusRight.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    console.log('Найден элемент app-menus-right через уведомления:', appMenusRight);
                    return appMenusRight;
                }
            }
        }

        console.log('Целевой элемент app-menus-right не найден');
        return null;
    }

    // --- Функция для позиционирования мини-кнопки ---
    function updateMiniButtonPosition(miniBtn) {
        const targetElement = findTargetElement();
        if (targetElement && miniBtn) {
            const rect = targetElement.getBoundingClientRect();
            // Позиционируем мини-кнопку: левее на 10px и выше на 5px
            const x = Math.max(20, rect.left - 40); // Было -30, стало -40 (левее на 10px)
            const y = Math.max(24, rect.top - 40); // Было -15, стало -20 (выше на 5px)

            console.log('Обновляем позицию мини-кнопки (левее на 10px, выше на 5px):', {
                element: targetElement.tagName + '.' + targetElement.className,
                rect: { left: rect.left, top: rect.top, right: rect.right, width: rect.width, height: rect.height },
                newPos: { x, y }
            });

            miniBtn.style.left = x + 'px';
            miniBtn.style.top = y + 'px';
            return true;
        }

        console.log('Элемент app-menus-right не найден, используется fallback позиция');
        return false;
    }

    // --- Ожидание появления элемента ---
    function waitForElement(callback, maxAttempts = 100) {
        let attempts = 0;
        const checkElement = () => {
            const element = findTargetElement();
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkElement, 100);
            } else {
                console.log('Не удалось найти целевой элемент после', maxAttempts, 'попыток');
                callback(null);
            }
        };
        checkElement();
    }

    // --- Фильтры ---
    function getKeywords() {
        let val = localStorage.getItem('gads_placement_keywords');
        return val ? val.split('\n').map(x=>x.trim()).filter(Boolean) : [];
    }

    function setKeywords(valArr) {
        let all = Array.from(new Set(valArr.map(x => x.trim()).filter(Boolean)));
        localStorage.setItem('gads_placement_keywords', all.join('\n'));
    }

    function getExclude() {
        let val = localStorage.getItem('gads_placement_exclude');
        return val ? val.split('\n').map(x=>x.trim()).filter(Boolean) : [];
    }

    function setExclude(valArr) {
        let all = Array.from(new Set(valArr.map(x => x.trim()).filter(Boolean)));
        localStorage.setItem('gads_placement_exclude', all.join('\n'));
    }

    function simulateClick(elem) {
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(type => {
            elem.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, view:window}));
        });
    }

    function getSmartPosition() {
        const targetElement = findTargetElement();
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            return {
                panel: {
                    x: Math.max(20, rect.left - 460), // Слева от блока с запасом для панели
                    y: Math.max(80, rect.top)
                },
                mini: {
                    x: Math.max(20, rect.left - 40), // Левее чем раньше
                    y: Math.max(24, rect.top - 40)   // Выше чем раньше
                }
            };
        }
        return {
            panel: { x: 90, y: 150 },
            mini: { x: 20, y: 200 }
        };
    }

    function addPanel() {
        if (document.getElementById('gads-placement-panel')) return;

        const positions = getSmartPosition();

        // --- Мини-иконка ---
        const miniBtn = document.createElement('div');
        miniBtn.id = 'gads-mini-btn';
        miniBtn.title = 'Развернуть панель';
        miniBtn.style = `
            display:none; position:fixed; width:52px; height:52px; min-width:52px; min-height:52px;
            border-radius:14px; background:#fff; box-shadow:0 4px 20px rgba(60,64,67,.10),0 1.5px 5px rgba(60,64,67,.12);
            cursor:pointer; align-items:center; justify-content:center;
            transition:box-shadow .2s; z-index:10000;
        `;
        miniBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 28 28" style="margin:12px" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="20" height="20" rx="6" fill="#F1F3F4" stroke="#CBD2D6" stroke-width="1.2"/>
              <rect x="9" y="9" width="10" height="10" rx="2" fill="#fff" stroke="#D6DDE3" stroke-width="1.1"/>
            </svg>
        `;
        miniBtn.addEventListener('mouseenter', ()=>miniBtn.style.boxShadow='0 4px 32px 0 rgba(60,64,67,.18)');
        miniBtn.addEventListener('mouseleave', ()=>miniBtn.style.boxShadow='0 4px 20px rgba(60,64,67,.10),0 1.5px 5px rgba(60,64,67,.12)');

        document.body.appendChild(miniBtn);

        // --- Отслеживание позиции ---
        let positionUpdateInterval;

        function startPositionTracking() {
            if (positionUpdateInterval) clearInterval(positionUpdateInterval);

            // Устанавливаем начальную позицию с небольшой задержкой
            setTimeout(() => {
                waitForElement(() => {
                    updateMiniButtonPosition(miniBtn);

                    // Начинаем регулярное отслеживание
                    positionUpdateInterval = setInterval(() => {
                        if (miniBtn.style.display === 'flex') {
                            updateMiniButtonPosition(miniBtn);
                        }
                    }, 300);
                });
            }, 800);
        }

        function stopPositionTracking() {
            if (positionUpdateInterval) {
                clearInterval(positionUpdateInterval);
                positionUpdateInterval = null;
            }
        }

        // --- Главная панель ---
        let panel, header;
        panel = document.createElement('div');
        panel.id = 'gads-placement-panel';
        panel.style = `
            position:fixed; min-width:340px; max-width:420px; z-index:9999;
            background:#fff; border-radius:18px; box-shadow:0 4px 24px rgba(60,64,67,.13);
            padding:20px 24px 16px 24px; font-family:Roboto,Arial,sans-serif; font-size:15px;
            border:1px solid #E3E7EA; transition:box-shadow .2s; max-height:90vh; overflow:auto;
        `;

        // ---- HEADER ----
        header = document.createElement('div');
        header.className = 'gads-panel-header';
        header.style = `
            display:flex; align-items:center; justify-content:space-between;
            font-weight:700;font-size:17px; margin-bottom:10px; user-select:none; cursor:grab;
        `;
        header.innerHTML = `
            <span style="display:flex;align-items:center;">
                <span style="margin-right:7px">🪄</span>
                Массовый выбор площадок
            </span>
            <span style="display:flex;gap:12px;">
                <span class="gads-panel-drag-icon" style="display:inline-block;cursor:grab;">
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                        <rect x="4.5" y="5.5" width="11" height="2" rx="1" fill="#D7DBE0"/>
                        <rect x="4.5" y="10.5" width="11" height="2" rx="1" fill="#D7DBE0"/>
                    </svg>
                </span>
                <span class="gads-panel-collapse" title="Свернуть" style="display:inline-block;cursor:pointer;">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <rect x="5" y="9.7" width="11" height="2" rx="1" fill="#CBD2D6"/>
                    </svg>
                </span>
            </span>
        `;
        panel.appendChild(header);

        // Drag панели
        makeDraggable(header, 'gads_panel_main', positions.panel, null, panel);

        // Обработчик клика для мини-кнопки
        miniBtn.addEventListener('click', function() {
            panel.style.display = '';
            miniBtn.style.display = 'none';
            stopPositionTracking();
            if (header.__restoreLastPos) header.__restoreLastPos();
        });

        // ---- Фильтры, кнопки, статус ----
        const kwLabel = document.createElement('label');
        kwLabel.textContent = 'Ключевые слова (по одному на строку):';
        kwLabel.style = 'font-weight:normal;display:block;margin-top:6px;';
        panel.appendChild(kwLabel);

        const kwArea = document.createElement('textarea');
        kwArea.value = getKeywords().join('\n');
        kwArea.rows = 4;
        kwArea.style = 'width:96%;padding:7px 9px;border:1px solid #bbb;border-radius:6px;margin-bottom:8px;margin-top:3px;font-size:15px;resize:vertical;';
        panel.appendChild(kwArea);

        const exLabel = document.createElement('label');
        exLabel.textContent = 'Исключить (по одному на строку):';
        exLabel.style = 'font-weight:normal;display:block;margin-top:7px;';
        panel.appendChild(exLabel);

        const exArea = document.createElement('textarea');
        exArea.value = getExclude().join('\n');
        exArea.rows = 4;
        exArea.style = 'width:96%;padding:7px 9px;border:1px solid #bbb;border-radius:6px;margin-bottom:12px;margin-top:3px;font-size:15px;resize:vertical;';
        panel.appendChild(exArea);

        const btnWrap = document.createElement('div');
        btnWrap.style = 'display:flex;gap:7px;margin-bottom:14px;align-items:center;';
        panel.appendChild(btnWrap);

        const btnMark = document.createElement('button');
        btnMark.textContent = 'Отметить';
        btnMark.style = `
            padding:8px 16px;font-size:15px;background:#1a73e8;color:#fff;border:none;
            border-radius:7px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(26,115,232,.05);
            transition:.2s;
        `;
        btnWrap.appendChild(btnMark);

        const btnExport = document.createElement('button');
        btnExport.textContent = 'Экспорт';
        btnExport.style = `
            padding:8px 13px;font-size:14px;background:#f1f3f4;color:#333;border:none;
            border-radius:7px;cursor:pointer;font-weight:500;
        `;
        btnWrap.appendChild(btnExport);

        const btnImport = document.createElement('button');
        btnImport.textContent = 'Импорт';
        btnImport.style = `
            padding:8px 13px;font-size:14px;background:#f1f3f4;color:#333;border:none;
            border-radius:7px;cursor:pointer;font-weight:500;
        `;
        btnWrap.appendChild(btnImport);

        const btnClear = document.createElement('button');
        btnClear.textContent = 'Очистить';
        btnClear.style = `
            padding:8px 13px;font-size:14px;background:#fff0f0;color:#d84315;border:none;
            border-radius:7px;cursor:pointer;font-weight:500;
        `;
        btnWrap.appendChild(btnClear);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.json';
        fileInput.style = 'display:none;';
        btnWrap.appendChild(fileInput);

        const status = document.createElement('div');
        status.style = 'margin-top:6px;color:#228a01;font-size:15px;font-weight:500;height:21px;';
        panel.appendChild(status);

        // --- Collapse/Expand логика ---
        header.querySelector('.gads-panel-collapse').onclick = function() {
            panel.style.display = 'none';
            miniBtn.style.display = 'flex';
            startPositionTracking();
        };

        document.body.appendChild(panel);

        // --- События на кнопки/поля ---
        btnExport.onclick = function() {
            setKeywords(kwArea.value.split('\n').map(x=>x.trim()).filter(Boolean));
            setExclude(exArea.value.split('\n').map(x=>x.trim()).filter(Boolean));
            const text =
                `"keywords":\n${kwArea.value.split('\n').map(x=>x.trim()).filter(Boolean).join('\n')}\n\n` +
                `"exclude":\n${exArea.value.split('\n').map(x=>x.trim()).filter(Boolean).join('\n')}\n`;
            const blob = new Blob([text], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gads_placement_filters.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        };

        btnImport.onclick = () => { fileInput.value = ''; fileInput.click(); };

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
                        if (kwMatch) keywords = kwMatch[1].split('\n').map(x=>x.trim()).filter(Boolean);
                        if (exMatch) exclude = exMatch[1].split('\n').map(x=>x.trim()).filter(Boolean);
                    }
                    setKeywords(keywords);
                    setExclude(exclude);
                    kwArea.value = keywords.join('\n');
                    exArea.value = exclude.join('\n');
                    status.textContent = '✅ Импортировано!';
                } catch (e) {
                    status.textContent = '❌ Ошибка импорта!';
                }
                setTimeout(() => { status.textContent = ''; }, 2000);
            };
            reader.readAsText(file);
        };

        btnClear.onclick = function() {
            if (!confirm('Точно очистить все фильтры?')) return;
            setKeywords([]);
            setExclude([]);
            kwArea.value = '';
            exArea.value = '';
            status.textContent = 'Очищено!';
            setTimeout(() => { status.textContent = ''; }, 1200);
        };

        // --- Скролл вниз плавно ---
        function smoothScrollDown(container, totalPx, callback) {
            const perStep = 40;
            const steps = Math.ceil(totalPx / perStep);
            let count = 0;
            function doStep() {
                container.dispatchEvent(new WheelEvent('wheel', {
                    deltaY: perStep,
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                count++;
                if (count < steps) setTimeout(doStep, 25);
                else if (callback) setTimeout(callback, 80);
            }
            doStep();
        }

        // --- Возврат вверх ---
        function scrollToTabAndCorrectAndWheel() {
            const tabButton = document.querySelector('tab-button[aria-label="Где показывается ваша реклама"]');
            const scrollContainer = document.querySelector('.ess-table-canvas');
            if (tabButton) {
                tabButton.scrollIntoView({behavior: "smooth", block: "start"});
                setTimeout(() => {
                    if (scrollContainer) scrollContainer.scrollTop = 0;
                    setTimeout(() => {
                        if (scrollContainer) {
                            scrollContainer.dispatchEvent(new WheelEvent('wheel', {
                                deltaY: -500,
                                bubbles: true,
                                cancelable: true,
                                view: window
                            }));
                            setTimeout(() => {
                                scrollContainer.dispatchEvent(new WheelEvent('wheel', {
                                    deltaY: -500,
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                }));
                            }, 200);
                        }
                    }, 200);
                }, 700);
            } else if (scrollContainer) {
                scrollContainer.scrollTop = 0;
                setTimeout(() => {
                    scrollContainer.dispatchEvent(new WheelEvent('wheel', {
                        deltaY: -500,
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    setTimeout(() => {
                        scrollContainer.dispatchEvent(new WheelEvent('wheel', {
                            deltaY: -500,
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                    }, 200);
                }, 200);
            }
        }

        // --- Массовая обработка и кнопка "Отметить" ---
        btnMark.onclick = function() {
            const keywords = kwArea.value.split('\n').map(x=>x.trim()).filter(Boolean);
            const exclude = exArea.value.split('\n').map(x=>x.trim()).filter(Boolean);
            document.querySelectorAll('.mat-checkbox-container[data-gads-checked]').forEach(el => {
                el.removeAttribute('data-gads-checked');
            });
            const scrollContainer = document.querySelector('.ess-table-canvas');
            if (!scrollContainer) {
                status.textContent = 'Не найден контейнер таблицы!';
                return;
            }
            let statusCount = 0;
            let scrollStep = scrollContainer.clientHeight - 20;
            let reachedEnd = false;
            let lastRowCount = 0;
            let sameRowsCounter = 0;

            function findTargets() {
                const rows = Array.from(document.querySelectorAll('.particle-table-row')).filter(r =>
                    !r.className.includes('summary') && !r.className.includes('header')
                );
                let toClick = [];
                rows.forEach(row => {
                    const link = row.querySelector('.ess-cell-link');
                    const name = link ? link.textContent.trim().toLowerCase() : '';
                    if (!name) return;
                    const found = keywords.length ? keywords.some(k => name.includes(k.toLowerCase())) : false;
                    const isExcluded = exclude.length ? exclude.some(e => name.includes(e.toLowerCase())) : false;
                    if (found && !isExcluded) {
                        const chk = row.querySelector('.mat-checkbox-container');
                        if (
                            chk &&
                            !chk.parentElement.parentElement.getAttribute('aria-checked')?.includes('true') &&
                            !chk.hasAttribute('data-gads-checked')
                        ) {
                            toClick.push(chk);
                        }
                    }
                });
                return toClick;
            }

            function process() {
                let toClick = findTargets();
                if (toClick.length > 0) {
                    toClick[0].setAttribute('data-gads-checked', '1');
                    simulateClick(toClick[0]);
                    statusCount++;
                    setTimeout(process, 100);
                    return;
                }
                const rowsNow = document.querySelectorAll('.particle-table-row').length;
                if (rowsNow === lastRowCount) {
                    sameRowsCounter++;
                } else {
                    sameRowsCounter = 0;
                }
                lastRowCount = rowsNow;

                if (sameRowsCounter < 3) {
                    smoothScrollDown(scrollContainer, scrollStep, process);
                } else if (!reachedEnd) {
                    reachedEnd = true;
                    setTimeout(process, 800);
                } else {
                    let more = findTargets();
                    if (more.length > 0) {
                        more[0].setAttribute('data-gads-checked', '1');
                        simulateClick(more[0]);
                        statusCount++;
                        setTimeout(process, 100);
                    } else {
                        status.textContent = `Готово! Отмечено: ${statusCount}`;
                        setTimeout(scrollToTabAndCorrectAndWheel, 900);
                        setTimeout(()=>{ status.textContent=''; }, 3500);
                    }
                }
            }
            process();
        };

        // Отслеживание ресайза окна
        window.addEventListener('resize', () => {
            if (miniBtn.style.display === 'flex') {
                updateMiniButtonPosition(miniBtn);
            }
        });

    } // конец addPanel

    // --- Удаление панели/мини-иконки ---
    function removePanel() {
        const panel = document.getElementById('gads-placement-panel');
        if (panel) panel.remove();
        const miniBtn = document.getElementById('gads-mini-btn');
        if (miniBtn) miniBtn.remove();
    }

    // --- Проверка на placements ---
    function checkPanel() {
        if (window.location.href.includes('placements')) addPanel();
        else removePanel();
    }

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkPanel();
        }
    }, 500);

    checkPanel();
})();
