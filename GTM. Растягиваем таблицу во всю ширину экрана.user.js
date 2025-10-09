// ==UserScript==
// @name         GTM. Растягиваем таблицу во всю ширину экрана
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       ИП Ульянов
// @description  Растягивает таблицу тегов GTM с небольшими отступами
// @             Для улучшения визуального восприятия таблицы.
// @match        https://tagmanager.google.com/*
// @grant        none
// @updateURL    https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GTM.%20%D0%A0%D0%B0%D1%81%D1%82%D1%8F%D0%B3%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%83%20%D0%B2%D0%BE%20%D0%B2%D1%81%D1%8E%20%D1%88%D0%B8%D1%80%D0%B8%D0%BD%D1%83%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0.user
// @downloadURL  https://github.com/OLD-THE-CAT/Scripts_for_Tampermonkey/raw/refs/heads/main/GTM.%20%D0%A0%D0%B0%D1%81%D1%82%D1%8F%D0%B3%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%83%20%D0%B2%D0%BE%20%D0%B2%D1%81%D1%8E%20%D1%88%D0%B8%D1%80%D0%B8%D0%BD%D1%83%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0.user
// @icon         data:image/x-icon;base64,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
// ==/UserScript==


(function() {
    'use strict';

    setInterval(() => {
        let table = document.querySelector('table.gtm-multiselect-table');
        if (!table) return;

        // Находим внешний контейнер (как и раньше)
        let parent = table.parentElement;
        for (let i = 0; i < 8; i++) {
            if (!parent) break;
            let styles = getComputedStyle(parent);
            if (styles.display === "flex" || styles.maxWidth || styles.width) {
                // Добавляем отступы!
                parent.style.width = "100%";
                parent.style.maxWidth = "2560px";
                parent.style.flex = "1 1 100%";
                parent.style.marginRight = "0";
                parent.style.paddingRight = "2px"; // отступ справа
                parent.style.paddingLeft = "0px";  // отступ слева (если надо)
            }
            parent = parent.parentElement;
        }

        // На всякий случай и самой таблице
        table.style.width = "100%";
        table.style.maxWidth = "2560px";
        table.style.margin = "0";
        table.style.paddingLeft = "0px";  // тоже можно, если хочешь
        table.style.paddingRight = "2px";

    }, 1000);
})();
