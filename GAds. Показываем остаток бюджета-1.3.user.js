// ==UserScript==
// @name         GAds. Показываем остаток бюджета
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Показывает остаток средств в блоке "Бюджеты аккаунта" на странице биллинга Google Ads
// @author       ИП Ульянов (Станислав)
// @match        https://ads.google.com/*
// @include      https://ads.google.com/*
// @updateURL
// @downloadURL
// @icon         https://img.icons8.com/color/48/google-ads.png
// @grant        none
// ==/UserScript==

/*
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           GAds. Показываем остаток бюджета — v1.3               ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║ НАЗНАЧЕНИЕ                                                       ║
 * ║   В интерфейсе Google Ads на странице "Биллинг → Сводка"        ║
 * ║   отображается блок "Бюджеты аккаунта" с двумя цифрами:         ║
 * ║     • Сумма затрат  — сколько уже потрачено                     ║
 * ║     • Сумма         — общий лимит бюджета                       ║
 * ║   Остаток (лимит − затраты) нигде не показывается.              ║
 * ║   Скрипт вычисляет остаток и добавляет его прямо в карточку     ║
 * ║   правее "Суммы затрат", визуально в стиле самого Google Ads.   ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║ УСЛОВИЯ ЗАПУСКА                                                  ║
 * ║   URL содержит: ads.google.com + "billing" + "summary"          ║
 * ║   Страница содержит тексты: "Название бюджета", "Сумма затрат"  ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║ ЦВЕТОВАЯ ИНДИКАЦИЯ                                               ║
 * ║   Остаток > 0  → зелёный (#1e8e3e)                              ║
 * ║   Остаток ≤ 0  → красный (#d93025)                              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function () {
    'use strict';

    const INSERTED_ID = 'tm-budget-remaining';

    // ─── Проверка условий запуска ────────────────────────────────────
    // Скрипт активируется только на странице биллинг-сводки Google Ads.
    // Проверяем URL и наличие ключевых текстов на странице.
    function isTargetPage() {
        const url = window.location.href;
        const hasCorrectURL = url.includes('billing') && url.includes('summary');
        const bodyText = document.body.innerText || '';
        const hasRequiredText =
            bodyText.includes('Название бюджета') &&
            bodyText.includes('Сумма затрат');
        return hasCorrectURL && hasRequiredText;
    }

    // ─── Парсинг суммы ───────────────────────────────────────────────
    // Убираем неразрывные пробелы (\u00a0), обычные пробелы, знак $,
    // заменяем запятую на точку для parseFloat.
    function parseAmount(text) {
        return parseFloat(
            text.replace(/\u00a0/g, '').replace(/\s/g, '').replace(',', '.').replace('$', '')
        );
    }

    // ─── Основная функция вставки ────────────────────────────────────
    // Находит элементы суммы затрат и лимита бюджета,
    // вычисляет остаток и добавляет блок в DOM.
    function injectRemaining() {
        // Не вставлять повторно, если блок уже есть
        if (document.getElementById(INSERTED_ID)) return;

        // Не запускаться на нецелевых страницах
        if (!isTargetPage()) return;

        // Элемент "Сумма затрат" (например: 33,11 $)
        const spentEl = document.querySelector('.amount-spent-value');
        // Элемент общего лимита бюджета (например: 629,17 $)
        const limitEl = document.querySelector('.current-budget-spending-limit');

        if (!spentEl || !limitEl) return;

        const spent = parseAmount(spentEl.textContent);
        const limit = parseAmount(limitEl.textContent);

        if (isNaN(spent) || isNaN(limit)) return;

        // Вычисляем остаток
        const remaining = limit - spent;
        const formatted = remaining.toFixed(2).replace('.', ',') + '\u00a0$';

        // Зелёный при положительном остатке, красный при уходе в минус
        const valueColor = remaining > 0 ? '#1e8e3e' : '#d93025';

        // ─── Создаём обёртку ─────────────────────────────────────────
        const wrapper = document.createElement('span');
        wrapper.id = INSERTED_ID;
        wrapper.style.cssText = 'display:inline-flex; flex-direction:column; margin-left:16px;';

        // ─── Лейбл "Остаток" ─────────────────────────────────────────
        // Стиль скопирован с .card-body Google Ads (серый мелкий текст)
        const label = document.createElement('span');
        label.textContent = 'Остаток';
        label.style.cssText = [
            'font-family: Roboto, Arial, sans-serif',
            'font-size: 0.875rem',
            'line-height: 1.25rem',
            'letter-spacing: 0.0142857143em',
            'font-weight: 400',
            'color: var(--acx-sys-color--on-surface, #3c4043)',
            'display: block',
        ].join(';');

        // ─── Значение суммы остатка ───────────────────────────────────
        // Стиль скопирован с .amount-spent-value Google Ads (крупные цифры)
        const value = document.createElement('span');
        value.textContent = formatted;
        value.style.cssText = [
            'font-family: "Google Sans", Roboto, Arial, sans-serif',
            'font-size: 2rem',
            'line-height: 2.5rem',
            'letter-spacing: 0',
            'font-weight: 400',
            `color: ${valueColor}`,
            'display: block',
        ].join(';');

        wrapper.appendChild(label);
        wrapper.appendChild(value);

        // Вставляем блок сразу после спана "Сумма затрат"
        const parentSpan = spentEl.parentElement;
        parentSpan.insertAdjacentElement('afterend', wrapper);
    }

    // ─── Наблюдатель за DOM ──────────────────────────────────────────
    // Google Ads — Angular SPA: контент загружается динамически.
    // MutationObserver ждёт появления нужных элементов и при навигации
    // между разделами запускает вставку заново.
    const observer = new MutationObserver(() => {
        if (
            document.querySelector('.amount-spent-value') &&
            document.querySelector('.current-budget-spending-limit')
        ) {
            injectRemaining();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Попытка вставки при прямой загрузке страницы (если DOM уже готов)
    injectRemaining();

})();

/*
 * ════════════════════════════════════════════════════════════════════
 * ОПИСАНИЕ ДЛЯ LLM (контекст для AI-ассистентов)
 * ════════════════════════════════════════════════════════════════════
 *
 * Этот Tampermonkey-скрипт расширяет интерфейс Google Ads.
 *
 * ПРОБЛЕМА:
 *   На странице https://ads.google.com/*/billing/summary Google Ads
 *   показывает блок "Бюджеты аккаунта" с суммой затрат и общим
 *   лимитом бюджета, но не показывает остаток (сколько ещё можно
 *   потратить до исчерпания бюджета).
 *
 * РЕШЕНИЕ:
 *   Скрипт парсит два DOM-элемента:
 *     .amount-spent-value            — уже потрачено
 *     .current-budget-spending-limit — общий лимит
 *   Вычисляет остаток: лимит − затраты.
 *   Создаёт новый DOM-элемент и вставляет его правее "Суммы затрат"
 *   через insertAdjacentElement('afterend', ...).
 *
 * СТИЛИЗАЦИЯ:
 *   Лейбл "Остаток" — стиль .card-body Google Ads (Roboto 0.875rem,
 *   цвет #3c4043).
 *   Сумма — стиль .amount-spent-value (Google Sans 2rem, зелёный
 *   #1e8e3e при остатке > 0, красный #d93025 при остатке ≤ 0).
 *
 * КЛЮЧЕВЫЕ КЛАССЫ В HTML Google Ads:
 *   budget-info-card          — вся карточка бюджета
 *   .progress-bar             — строка с прогрессом и суммой затрат
 *   .amount-spent-value       — значение суммы затрат
 *   .amount-spent-label       — лейбл "Сумма затрат"
 *   .current-budget-spending-limit — лимит бюджета
 *   .progress-bar-caption     — подпись под прогресс-баром
 *
 * ТЕХНИЧЕСКИЕ ОСОБЕННОСТИ:
 *   - Google Ads использует Angular, классы вида _ngcontent-rkm-13
 *     динамические и меняются при каждой загрузке — скрипт на них
 *     не полагается.
 *   - MutationObserver обеспечивает работу в SPA без перезагрузки.
 *   - Повторная вставка блокируется проверкой id="tm-budget-remaining".
 *   - Условие запуска: URL содержит "billing" + "summary", страница
 *     содержит тексты "Название бюджета" и "Сумма затрат".
 * ════════════════════════════════════════════════════════════════════
 */
