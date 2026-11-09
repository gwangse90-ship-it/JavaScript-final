// ============================================================
//  calculator.js — 계산기 핵심 로직
//  📝 과제: 💡 표시된 빈칸을 채워 기능을 완성하세요.
// ============================================================

const mainDisplay = document.getElementById("mainDisplay");
const subDisplay  = document.getElementById("subDisplay");

let expression     = "";    // 현재 입력 중인 수식 문자열
let justCalculated = false; // 방금 = 을 눌렀는지 여부

const OPERATORS = "+-*/";
const endsWithOperator = (str) => OPERATORS.includes(str[str.length - 1]);

// 디스플레이 갱신 — main.js에서도 호출합니다 (수정 금지)
export const updateDisplay = () => {
    mainDisplay.textContent = expression || "0";
    mainDisplay.style.fontSize = expression.length > 10 ? "1.8rem" : "2.6rem";
};

// ── 과제 1: 숫자 / 소수점 입력 ──────────────────────────────
export const appendNumber = (num) => {
    // 규칙 1. 방금 계산했다면 새 계산 시작
    if (justCalculated) {
        expression = "";
        subDisplay.textContent = "";
    }

    // 현재 입력 중인 숫자 구간 (마지막 연산자 뒤)
    const parts   = expression.split(/[+\-*\/]/);
    const current = parts[parts.length - 1];

    if (num === ".") {
        // 규칙 3. 현재 숫자에 이미 소수점이 있으면 무시
        if (current.includes(".")) return;
        // 숫자 없이 "." 만 누르면 "0." 으로 시작
        expression += current === "" ? "0." : ".";
    } else if (current === "0") {
        // 규칙 2. 앞자리 0 대체 ("0" + "5" → "5", "3+0" + "5" → "3+5")
        expression = expression.slice(0, -1) + num;
    } else {
        expression += num;
    }

    justCalculated = false;
    updateDisplay();
};

// ── 과제 2: 연산자 입력 ─────────────────────────────────────
export const appendOperator = (op) => {
    // 규칙 1. 비어 있으면 무시
    if (expression === "") return;

    // 규칙 2. 마지막이 연산자면 교체, 아니면 추가
    // 규칙 3. justCalculated여도 expression(이전 결과)을 그대로 이어 씀
    if (endsWithOperator(expression)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }

    justCalculated = false;
    updateDisplay();
};

// ── 과제 3: 계산 실행 ───────────────────────────────────────
export const calculate = () => {
    // 규칙 1. 비어 있거나 연산자로 끝나면 계산 안 함
    if (expression === "" || endsWithOperator(expression)) return null;

    // 규칙 2. 0으로 나누기 감지
    //   힌트의 /\/0/ 는 "/0.5" 같은 정상 수식도 막기 때문에
    //   "/0" 뒤에 숫자나 소수점이 오지 않을 때만 에러로 처리합니다.
    if (/\/0(?![.\d])/.test(expression)) {
        subDisplay.textContent = "0으로 나눌 수 없습니다";
        return null;
    }

    let raw;
    try {
        raw = Function('"use strict"; return (' + expression + ')')();
    } catch {
        subDisplay.textContent = "잘못된 수식입니다";
        return null;
    }

    // "/0.0" 처럼 정규식을 통과한 경우까지 대비
    if (!Number.isFinite(raw)) {
        subDisplay.textContent = "0으로 나눌 수 없습니다";
        return null;
    }

    // 부동소수점 오류 처리 (0.1 + 0.2 → 0.3)
    const result  = parseFloat(raw.toFixed(10)).toString();
    const formula = expression;

    // 규칙 3. 화면 출력 및 상태 갱신
    mainDisplay.textContent    = result;
    mainDisplay.style.fontSize = result.length > 10 ? "1.8rem" : "2.6rem";
    subDisplay.textContent     = formula + " =";
    justCalculated = true;
    expression     = result;

    // 규칙 4. 기록 저장용 반환값
    return { expression: formula, result };
};

// ── 과제 4: 마지막 문자 삭제 ────────────────────────────────
export const deleteLast = () => {
    if (justCalculated) {
        // 규칙 1. 계산 직후라면 전체 초기화
        clearAll();
    } else {
        // 규칙 2. 마지막 글자 하나 제거
        expression = expression.slice(0, -1);
    }

    updateDisplay();
};

// ── 도전 1: % 연산 (선택 과제) ──────────────────────────────
export const appendPercent = () => {
    // 비어 있거나 연산자로 끝나면 무시
    if (expression === "" || endsWithOperator(expression)) return;

    // 마지막 연산자 위치 찾기 (없으면 -1)
    const lastOpIndex = Math.max(
        expression.lastIndexOf("+"),
        expression.lastIndexOf("-"),
        expression.lastIndexOf("*"),
        expression.lastIndexOf("/")
    );

    const head   = expression.slice(0, lastOpIndex + 1); // 연산자까지
    const numStr = expression.slice(lastOpIndex + 1);    // 마지막 숫자
    const value  = parseFloat((parseFloat(numStr) / 100).toFixed(10)).toString();

    expression = head + value;
    updateDisplay();
};

// ── 도전 3: 기록 클릭 시 결과 불러오기 (선택 과제) ──────────
export const setExpression = (value) => {
    expression     = String(value);
    justCalculated = true;
    updateDisplay();
};

// ── 전체 초기화 (완성 코드 — 수정 금지) ─────────────────────
export const clearAll = () => {
    expression     = "";
    justCalculated = false;
    mainDisplay.textContent    = "0";
    mainDisplay.style.fontSize = "2.6rem";
    subDisplay.textContent     = "";
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
};