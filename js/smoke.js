export class GalaxySmoke {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.opts = Object.assign({
      count: 80,
      baseSpeed: 0.2,
      baseSize: 40,
      alpha: 0.09,
      colors: [
        [148,0,211],[75,0,130],[0,0,255],[255,105,180],[255,255,255],[138,43,226],[0,255,255]
      ]
    }, opts);
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.spawnInitial();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(this.canvas.clientWidth * dpr);
    this.canvas.height = Math.floor(this.canvas.clientHeight * dpr);
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  randomColor() {
    const c = this.opts.colors[Math.floor(Math.random()*this.opts.colors.length)];
    return `rgba(${c[0]},${c[1]},${c[2]},`;
  }

  spawn() {
    const w=this.canvas.clientWidth,h=this.canvas.clientHeight;
    const side=Math.floor(Math.random()*4);
    let x,y,vx,vy;
    switch(side){
      case 0:x=Math.random()*w;y=-20;vx=(Math.random()-0.5)*0.6;vy=this.opts.baseSpeed*(0.5+Math.random());break;
      case 1:x=Math.random()*w;y=h+20;vx=(Math.random()-0.5)*0.6;vy=-this.opts.baseSpeed*(0.5+Math.random());break;
      case 2:x=-20;y=Math.random()*h;vx=this.opts.baseSpeed*(0.5+Math.random());vy=(Math.random()-0.5)*0.6;break;
      case 3:x=w+20;y=Math.random()*h;vx=-this.opts.baseSpeed*(0.5+Math.random());vy=(Math.random()-0.5)*0.6;break;
    }
    const color=this.randomColor();
    const size=this.opts.baseSize*(0.6+Math.random()*1.5);
    const life=6+Math.random()*10;
    const rot=Math.random()*Math.PI*2;
    this.particles.push({x,y,vx,vy,size,life,age:0,color,rot,alpha:this.opts.alpha*(0.5+Math.random())});
  }

  spawnInitial(){for(let i=0;i<this.opts.count;i++)this.spawn();}

  update(dt){if(Math.random()<0.9)this.spawn();for(let p of this.particles){p.age+=dt;p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.rot+=0.001*dt*60;p.size*=1.001+Math.random()*0.001;}this.particles=this.particles.filter(p=>p.age<p.life);}

  draw(){const ctx=this.ctx,w=this.canvas.clientWidth,h=this.canvas.clientHeight;ctx.clearRect(0,0,w,h);for(let p of this.particles){const lr=1-p.age/p.life;const alpha=p.alpha*lr;const color1=p.color+alpha+")";const color2=p.color+alpha*0.2+")";const grad=ctx.createRadialGradient(0,0,p.size*0.1,0,0,p.size);grad.addColorStop(0,color1);grad.addColorStop(1,color2);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalCompositeOperation="lighter";ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(0,0,p.size,p.size*0.8,0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.globalCompositeOperation="source-over";}
}
