// ============================================================
//  main.js — 이벤트 연결 및 초기화 (완성 코드 — 수정 금지)
// ============================================================

import { appendNumber, appendOperator, calculate, deleteLast, clearAll,
         appendPercent, setExpression } from './calculator.js';
import { loadHistory, addHistory, clearHistory, deleteHistoryItem } from './history.js';

// DOM 요소
const historyPanel = document.getElementById("historyPanel");
const historyList  = document.getElementById("historyList");
const historyBtn   = document.getElementById("historyBtn");
const clearAllBtn  = document.getElementById("clearAllBtn");
const themeBtn     = document.getElementById("themeBtn");
const badge        = document.getElementById("badge");

// ── 기록 렌더링 ──────────────────────────────────────────────
const renderHistory = (history) => {
    badge.textContent = history.length;

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-msg">아직 계산 기록이 없어요 🧮</li>';
        return;
    }

    // 도전 2·3: 각 항목에 index와 삭제 버튼 추가
    historyList.innerHTML = history.map((item, index) => `
        <li class="history-item" data-index="${index}">
            <div class="hist-expr">${item.expression} =</div>
            <div class="hist-result">${item.result}</div>
            <div class="hist-date">${item.date}</div>
            <button class="delete-item-btn" data-index="${index}" aria-label="기록 삭제">×</button>
        </li>
    `).join("");
};

// ── 도전 2·3: 기록 항목 클릭 (이벤트 위임) ───────────────────
//  목록은 renderHistory 때마다 새로 그려지므로,
//  각 항목이 아니라 부모 <ul>에 리스너를 한 번만 붙입니다.
historyList.addEventListener("click", (e) => {
    // 도전 2: × 버튼 → 해당 항목만 삭제
    const delBtn = e.target.closest(".delete-item-btn");
    if (delBtn) {
        renderHistory(deleteHistoryItem(Number(delBtn.dataset.index)));
        return; // 항목 클릭(결과 불러오기)까지 실행되지 않도록 여기서 종료
    }

    // 도전 3: 항목 클릭 → 결과값을 계산기에 불러오기
    const item = e.target.closest(".history-item");
    if (!item) return; // "기록 없음" 메시지 클릭 등은 무시

    const history = loadHistory();
    const target  = history[Number(item.dataset.index)];
    if (target) {
        setExpression(target.result);
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
    }
});

// ── 버튼 이벤트 ──────────────────────────────────────────────
document.querySelectorAll(".btn-num").forEach(btn =>
    btn.addEventListener("click", () => appendNumber(btn.dataset.num))
);

document.querySelectorAll(".btn-op").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        appendOperator(btn.dataset.op);
    })
);

document.querySelector("[data-action='equals']").addEventListener("click", () => {
    const r = calculate();
    if (r) renderHistory(addHistory(r.expression, r.result));
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
});

document.querySelector("[data-action='clear']").addEventListener("click", clearAll);

document.querySelector("[data-action='delete']").addEventListener("click", deleteLast);

// 도전 1: % 버튼
document.querySelector("[data-action='percent']").addEventListener("click", appendPercent);

// ── 키보드 입력 ──────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        appendNumber(e.key);
        return;
    }
    if (["+", "-", "*", "/"].includes(e.key)) {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        const opBtn = document.querySelector(`[data-op="${e.key}"]`);
        if (opBtn) opBtn.classList.add("active");
        appendOperator(e.key);
        return;
    }
    if (e.key === "Enter" || e.key === "=") {
        const r = calculate();
        if (r) renderHistory(addHistory(r.expression, r.result));
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
    }
    if (e.key === "%")         appendPercent(); // 도전 1: 키보드 % 지원
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape")    clearAll();
});

// ── 기록 패널 토글 ───────────────────────────────────────────
historyBtn.addEventListener("click", () =>
    historyPanel.classList.toggle("open")
);

clearAllBtn.addEventListener("click", () => renderHistory(clearHistory()));

// ── 다크모드 ─────────────────────────────────────────────────
const applyTheme = (dark) => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    themeBtn.textContent = dark ? "☀️" : "🌙";
};

themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
    localStorage.setItem("calc_theme", !isDark ? "dark" : "light");
});

// ── 초기화 ───────────────────────────────────────────────────
applyTheme(localStorage.getItem("calc_theme") === "dark");
renderHistory(loadHistory());
