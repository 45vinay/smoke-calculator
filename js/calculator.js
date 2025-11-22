export class Calculator {
  constructor(screenElement) {
    this.screen = screenElement;
    this.current = "0";
    this.shouldReset = false;
    this.setScreen(this.current);
  }

  setScreen(value) {
    this.current = String(value);
    this.screen.textContent = this.current;
  }

  appendValue(val) {
    if (this.shouldReset) {
      this.current = "0";
      this.shouldReset = false;
    }
    if (this.current === "0" && val !== ".") this.current = val;
    else if (val === "." && this.current.includes(".")) return;
    else this.current += val;
    this.setScreen(this.current);
  }

  backspace() {
    if (this.shouldReset) {
      this.setScreen("0");
      this.shouldReset = false;
      return;
    }
    this.current = this.current.slice(0, -1) || "0";
    this.setScreen(this.current);
  }

  allClear() {
    this.current = "0";
    this.setScreen(this.current);
    this.shouldReset = false;
  }

  applyPercent() {
    let n = parseFloat(this.current) || 0;
    n = n / 100;
    this.current = String(n);
    this.setScreen(this.current);
    this.shouldReset = true;
  }

  safeEvaluate(expr) {
    if (!/^[0-9+\-*/().% ]+$/.test(expr)) throw new Error("Invalid characters");
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
    expr = expr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
    if (/\/\/|[^\d)\]%]\s*[+\-*/]{2,}/.test(expr)) throw new Error("Malformed expression");
    return Function(`"use strict"; return (${expr})`)();
  }

  equals() {
    try {
      const result = this.safeEvaluate(this.current);
      this.setScreen(Number.isFinite(result) ? result : "Error");
      this.shouldReset = true;
    } catch {
      this.setScreen("Error");
      this.shouldReset = true;
    }
  }
}
