// ============================================================
//  history.js — 계산 기록 관리 (localStorage)
//  📝 과제: 💡 표시된 빈칸을 채워 기능을 완성하세요.
// ============================================================

const STORAGE_KEY = "calc_history";
const MAX_COUNT   = 20;

// ── 과제 5: 기록 불러오기 ────────────────────────────────────
export const loadHistory = () => {
    const saved = localStorage.getItem(STORAGE_KEY);

    // 저장된 값이 없으면 빈 배열
    if (saved === null) return [];

    // 값이 깨져 있어도 앱이 멈추지 않도록 try/catch
    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// ── 과제 6: 기록 저장 ────────────────────────────────────────
export const saveHistory = (history) => {
    // 최대 20개까지만 남기고 저장
    const trimmed = history.slice(0, MAX_COUNT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
};

// ── 과제 7: 기록 항목 추가 ───────────────────────────────────
export const addHistory = (expression, result) => {
    // 1. 기존 기록 불러오기
    const history = loadHistory();

    // 2. 새 항목을 맨 앞에 추가 (20개 초과분은 잘라냄)
    const newItem = {
        expression,
        result,
        date: new Date().toLocaleString("ko-KR"),
    };
    const updated = [newItem, ...history].slice(0, MAX_COUNT);

    // 3. 저장
    saveHistory(updated);

    // 4. 업데이트된 배열 반환
    return updated;
};

// ── 도전 2: 기록 개별 삭제 (선택 과제) ──────────────────────
export const deleteHistoryItem = (index) => {
    // 1. 기록 불러오기
    const history = loadHistory();

    // 2. 해당 인덱스만 빼고 새 배열 만들기
    const updated = history.filter((_, i) => i !== index);

    // 3. 저장 후 반환
    saveHistory(updated);
    return updated;
};

// ── 기록 전체 삭제 (완성 코드 — 수정 금지) ──────────────────
export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};