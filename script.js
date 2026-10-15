(function(){
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var body = document.body;

  /* ---- particles: confetti and fireworks ---- */
  function FX(canvas){
    var ctx = canvas.getContext('2d');
    var parts = [], raf = 0, w = 0, h = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var colors = ['#e8175d','#ffc933','#12b886','#8a5cf5','#ff7ab0','#ffffff'];
    function size(){
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function start(){ if(!raf) raf = requestAnimationFrame(tick); }
    function confetti(x, y, n){
      if(reduce) return;
      for(var i = 0; i < n; i++){
        var a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
        parts.push({k:'c', x:x, y:y, vx:Math.cos(a) * s, vy:Math.sin(a) * s - 5, g:.26,
          rot:Math.random() * 6, vr:(Math.random() - .5) * .45, w:6 + Math.random() * 6, h:3 + Math.random() * 4,
          c:colors[(Math.random() * colors.length) | 0], life:95 + Math.random() * 60, age:0});
      }
      start();
    }
    function firework(x, y){
      if(reduce) return;
      var hue = Math.random() * 360, n = 72;
      for(var i = 0; i < n; i++){
        var a = (Math.PI * 2 * i / n) + Math.random() * .1, s = 1.8 + Math.random() * 4.6;
        parts.push({k:'f', x:x, y:y, vx:Math.cos(a) * s, vy:Math.sin(a) * s, g:.045,
          c:'hsl(' + hue + ',' + (80 + Math.random() * 20) + '%,' + (60 + Math.random() * 12) + '%)',
          life:62 + Math.random() * 32, age:0});
      }
      start();
    }
    function tick(){
      ctx.clearRect(0, 0, w, h);
      for(var i = parts.length - 1; i >= 0; i--){
        var p = parts[i];
        p.age++;
        p.vy += p.g;
        p.vx *= (p.k === 'f' ? .985 : .99);
        p.x += p.vx; p.y += p.vy;
        var fade = 1 - p.age / p.life;
        if(fade <= 0 || p.y > h + 30){ parts.splice(i, 1); continue; }
        if(p.k === 'f'){
          ctx.globalAlpha = fade;
          ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        } else {
          p.rot += p.vr;
          ctx.globalAlpha = Math.min(1, fade * 3);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      if(parts.length){ raf = requestAnimationFrame(tick); }
      else { raf = 0; ctx.clearRect(0, 0, w, h); }
    }
    function clear(){ parts.length = 0; }
    size();
    window.addEventListener('resize', size);
    return {confetti:confetti, firework:firework, size:size, clear:clear};
  }

  var fx = FX(document.getElementById('fx'));

  /* ---- intro: night garden (edit this small array to add/remove flowers) ---- */
  var intro = document.getElementById('intro');
  var page = document.getElementById('page');
  var garden = document.getElementById('garden');
  var flowerField = document.getElementById('garden-flowers');
  var bloom = document.getElementById('bloom');
  var flowerConfig = [
    {x:'7%', size:'clamp(44px,12vw,72px)', height:'clamp(130px,31vw,220px)', delay:'0s', deep:'#9f2d64', light:'#ffc2d6', glow:'rgba(255,79,135,.22)', blur:'1px', opacity:'.56', tilt:'-8deg', layer:1},
    {x:'20%',size:'clamp(54px,15vw,88px)', height:'clamp(155px,39vw,255px)', delay:'.12s', deep:'#a86f08', light:'#fff1b0', glow:'rgba(255,201,51,.20)', blur:'.5px', opacity:'.78', tilt:'5deg', layer:2},
    {x:'34%',size:'clamp(58px,16vw,94px)', height:'clamp(145px,37vw,246px)', delay:'.24s', deep:'#663cbb', light:'#d9c7ff', glow:'rgba(138,92,245,.24)', blur:'0', opacity:'.96', tilt:'-4deg', layer:3},
    {x:'47%',size:'clamp(45px,13vw,76px)', height:'clamp(136px,33vw,225px)', delay:'.36s', deep:'#b52d62', light:'#ffc2d6', glow:'rgba(255,79,135,.20)', blur:'1px', opacity:'.63', tilt:'8deg', layer:1},
    {x:'60%',size:'clamp(66px,18vw,104px)',height:'clamp(160px,41vw,278px)', delay:'.48s', deep:'#e34f32', light:'#ffd1c2', glow:'rgba(255,122,89,.24)', blur:'0', opacity:'1', tilt:'-7deg', layer:4},
    {x:'73%',size:'clamp(52px,15vw,84px)', height:'clamp(143px,36vw,238px)', delay:'.6s', deep:'#d6a213', light:'#fff1b0', glow:'rgba(255,201,51,.19)', blur:'.5px', opacity:'.76', tilt:'6deg', layer:2},
    {x:'87%',size:'clamp(61px,17vw,98px)', height:'clamp(150px,39vw,263px)', delay:'.72s', deep:'#b5346c', light:'#ffe4ec', glow:'rgba(255,228,236,.25)', blur:'0', opacity:'.94', tilt:'-5deg', layer:3},
    {x:'97%',size:'clamp(41px,11vw,67px)', height:'clamp(122px,29vw,206px)', delay:'.84s', deep:'#693bb7', light:'#d9c7ff', glow:'rgba(138,92,245,.18)', blur:'1px', opacity:'.54', tilt:'9deg', layer:1}
  ];
  function petals(){
    var bits = '';
    for(var i = 0; i < 8; i++){ bits += '<i class="petal" style="--i:' + i + '"></i>'; }
    return bits;
  }
  function buildGarden(){
    flowerField.innerHTML = flowerConfig.map(function(f, index){
      var vars = '--x:' + f.x + ';--size:' + f.size + ';--height:' + f.height + ';--delay:' + f.delay + ';--petal-deep:' + f.deep + ';--petal-light:' + f.light + ';--glow:' + f.glow + ';--blur:' + f.blur + ';--opacity:' + f.opacity + ';--stem-tilt:' + f.tilt + ';--sway-delay:-' + (index * .38) + 's;--bloom-delay:' + (index * .15) + 's;z-index:' + f.layer + ';';
      return '<div class="garden-flower" style="' + vars + '"><div class="flower-sway"><span class="garden-stem"></span><span class="garden-leaf leaf-a"></span><span class="garden-leaf leaf-b"></span><span class="garden-leaf leaf-c"></span><div class="flower-head"><div class="petal-ring outer-ring">' + petals() + '</div><div class="petal-ring inner-ring">' + petals() + '</div><div class="flower-centre"></div></div></div></div>';
    }).join('');
    var fireflies = [];
    for(var i = 0; i < 32; i++){
      fireflies.push('<i class="firefly" style="--x:' + (3 + Math.random() * 94) + '%;--y:' + (12 + Math.random() * 76) + '%;--dot:' + (2 + Math.random() * 2) + 'px;--duration:' + (5 + Math.random() * 7) + 's;--delay:-' + (Math.random() * 7) + 's;--drift-x:' + (-22 + Math.random() * 44) + 'px;--drift-y:' + (-24 + Math.random() * 33) + 'px"></i>');
    }
    document.getElementById('fireflies').innerHTML = fireflies.join('');
  }
  function GardenPetals(canvas){
    var ctx = canvas.getContext('2d'), parts = [], frame = 0, running = false;
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var shades = ['#ff79a5','#ffe5ef','#fff0a7','#ffc2d6'];
    function size(){ w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.max(1,Math.round(w*dpr)); canvas.height = Math.max(1,Math.round(h*dpr)); ctx.setTransform(dpr,0,0,dpr,0,0); }
    function drawPetal(p){
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.scale(p.s,p.s); ctx.fillStyle=p.c;
      ctx.beginPath(); ctx.moveTo(0,-7); ctx.bezierCurveTo(6,-4,7,4,0,8); ctx.bezierCurveTo(-7,4,-6,-4,0,-7); ctx.fill(); ctx.restore();
    }
    function tick(){
      ctx.clearRect(0,0,w,h);
      for(var i=parts.length-1;i>=0;i--){
        var p=parts[i]; p.age++; p.vy+=p.g; p.vx+=Math.sin(p.age*.09+p.phase)*.008; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr;
        var a=1-p.age/p.life; if(a<=0 || p.y>h+26){parts.splice(i,1);continue;} ctx.globalAlpha=Math.min(1,a*2.6); drawPetal(p);
      }
      ctx.globalAlpha=1;
      if(parts.length && running){frame=requestAnimationFrame(tick);}else{frame=0;ctx.clearRect(0,0,w,h);}
    }
    function burst(total){
      if(reduce)return; size(); running=true;
      var origins=Array.prototype.map.call(document.querySelectorAll('.garden-flower'),function(el){var r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.width*.42};});
      for(var i=0;i<total;i++){var o=origins[i%origins.length];parts.push({x:o.x,y:o.y,vx:-2.7+Math.random()*5.4,vy:-8-Math.random()*5.7,g:.105,r:Math.random()*6.28,vr:-.1+Math.random()*.2,s:.65+Math.random()*.65,c:shades[i%shades.length],life:150+Math.random()*110,age:0,phase:Math.random()*6.28});}
      if(!frame)frame=requestAnimationFrame(tick);
    }
    function stop(){running=false;parts.length=0;if(frame)cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,w,h);}
    size();window.addEventListener('resize',size);return{burst:burst,stop:stop};
  }
  buildGarden();
  var gardenPetals = GardenPetals(document.getElementById('garden-petals'));
  var opened = false;
  body.classList.add('locked');

  function openSite(){
    if(opened) return;
    opened = true;
    intro.classList.add('open');
    page.classList.add('in');
    setTimeout(gardenPetals.stop, reduce ? 0 : 5000);
    setTimeout(function(){
      intro.hidden = true;
      body.classList.remove('locked');
      window.scrollTo(0, 0);
    }, reduce ? 0 : 950);
  }
  bloom.addEventListener('click', function(){
    if(intro.classList.contains('bloomed') || opened) return;
    intro.classList.add('bloomed'); garden.classList.add('bloomed'); bloom.disabled = true;
    gardenPetals.burst(84);
    setTimeout(openSite, reduce ? 0 : 2500);
  });
  document.getElementById('skip').addEventListener('click', openSite);

  /* ---- polaroids ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.polaroid'), function(b){
    b.addEventListener('click', function(){
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  /* ---- verdict ---- */
  var vbtn = document.getElementById('verdict-btn');
  vbtn.addEventListener('click', function(){
    var vals = Array.prototype.slice.call(document.querySelectorAll('.v-val'));
    vbtn.disabled = true;
    var r = vbtn.getBoundingClientRect();
    vals.forEach(function(el, i){
      setTimeout(function(){
        el.textContent = el.getAttribute('data-final');
        el.classList.add('stamped');
      }, reduce ? 0 : i * 650);
    });
    setTimeout(function(){
      vbtn.textContent = 'Court adjourned. Dosti jeet gayi.';
      fx.confetti(r.left + r.width / 2, r.top, 60);
    }, reduce ? 0 : vals.length * 650 + 150);
  });

  /* ---- finale ---- */
  var finale = document.getElementById('finale');
  var fxF = FX(document.getElementById('fcanvas'));
  var seq = Array.prototype.slice.call(finale.querySelectorAll('.f-seq p'));
  var fin = document.getElementById('f-final');
  var timers = [], fireInt = 0;

  function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
  function resetFinale(){
    timers.forEach(clearTimeout); timers = [];
    clearInterval(fireInt); fireInt = 0;
    seq.forEach(function(p){ p.classList.remove('show'); });
    fin.classList.remove('show');
    fxF.clear();
  }
  function randomFirework(){
    var w = finale.clientWidth, h = finale.clientHeight;
    fxF.firework(w * (.12 + Math.random() * .76), h * (.12 + Math.random() * .4));
  }
  function playFinale(){
    resetFinale();
    fxF.size();
    if(reduce){ fin.classList.add('show'); return; }
    later(function(){ seq[0].classList.add('show'); }, 400);
    later(function(){ seq[0].classList.remove('show'); }, 1900);
    later(function(){ seq[1].classList.add('show'); }, 2100);
    later(function(){ seq[1].classList.remove('show'); }, 3600);
    later(function(){ seq[2].classList.add('show'); }, 3800);
    later(function(){ seq[2].classList.remove('show'); }, 5300);
    later(function(){
      fireInt = setInterval(randomFirework, 850);
      randomFirework();
    }, 2000);
    later(function(){
      fin.classList.add('show');
      for(var i = 0; i < 5; i++){ (function(d){ later(randomFirework, d * 160); })(i); }
      fxF.confetti(finale.clientWidth / 2, finale.clientHeight * .35, 120);
    }, 5600);
  }
  function openFinale(){
    finale.hidden = false;
    body.classList.add('locked');
    playFinale();
    document.getElementById('f-close').focus();
  }
  function closeFinale(){
    resetFinale();
    finale.hidden = true;
    body.classList.remove('locked');
  }
  document.getElementById('finale-btn').addEventListener('click', openFinale);
  document.getElementById('f-replay').addEventListener('click', playFinale);
  document.getElementById('f-back').addEventListener('click', closeFinale);
  document.getElementById('f-close').addEventListener('click', closeFinale);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !finale.hidden) closeFinale();
  });
})();
