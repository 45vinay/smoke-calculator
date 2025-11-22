import { Calculator } from "./calculator.js";
import { GalaxySmoke } from "./smoke.js";

// Calculator init
const screen = document.getElementById("screen");
const calc = new Calculator(screen);
document.querySelectorAll(".btn").forEach(btn=>{
  const v = btn.dataset.value, a = btn.dataset.action;
  btn.addEventListener("click", ()=>{
    if(a==="all-clear") calc.allClear();
    else if(a==="back") calc.backspace();
    else if(a==="percent") calc.applyPercent();
    else if(a==="equals") calc.equals();
    else if(v){
      if(/[0-9.]/.test(v)) calc.appendValue(v);
      else {
        if(calc.shouldReset) calc.shouldReset=false;
        if(/[+\-*/]$/.test(calc.current)&&/[+\-*/]/.test(v)) calc.current=calc.current.slice(0,-1)+v;
        else calc.current+=v;
        calc.setScreen(calc.current);
      }
    }
  });
});

// Keyboard support
window.addEventListener("keydown", ev=>{
  const k=ev.key;
  if(/^(\d|\.)$/.test(k)) calc.appendValue(k);
  else if(k==="Backspace") calc.backspace();
  else if(k==="Enter"||k==="="){ev.preventDefault();calc.equals();}
  else if(k==="Escape") calc.allClear();
  else if(k=="%") calc.applyPercent();
  else if(/^[+\-*/()]$/.test(k)){
    if(/[+\-*/]$/.test(calc.current)&&/[+\-*/]/.test(k)) calc.current=calc.current.slice(0,-1)+k;
    else calc.current+=k;
    calc.setScreen(calc.current);
  }
});

// Background smoke
const bgCanvases = ["smoke-bg-1","smoke-bg-2","smoke-bg-3"].map(id=>document.getElementById(id));
bgCanvases.forEach(c=>{
  const s = new GalaxySmoke(c,{count:80,baseSpeed:0.25,baseSize:45});
  function loop(last=performance.now()){
    return function frame(now){
      const dt=(now-last)/1000; last=now; s.update(dt); s.draw(); requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(loop());
});

// Calculator smoke
const calcCanvases = ["calc-smoke-1","calc-smoke-2","calc-smoke-3"].map(id=>document.getElementById(id));
calcCanvases.forEach(c=>{
  const s = new GalaxySmoke(c,{count:40,baseSpeed:0.25,baseSize:25});
  function loop(last=performance.now()){
    return function frame(now){
      const dt=(now-last)/1000; last=now; s.update(dt); s.draw(); requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(loop());
});
