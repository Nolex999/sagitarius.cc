(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,53339,e=>{"use strict";let r=(0,e.i(75254).default)("music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);e.s(["Music",()=>r],53339)},58524,e=>{"use strict";let r=(0,e.i(75254).default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);e.s(["Link2",()=>r],58524)},78716,e=>{"use strict";let r=(0,e.i(75254).default)("video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);e.s(["Video",()=>r],78716)},50682,23616,57909,e=>{"use strict";var r=e.i(75254);let a=(0,r.default)("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);e.s(["Github",()=>a],50682);let t=(0,r.default)("youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]);e.s(["Youtube",()=>t],23616);let o=(0,r.default)("twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);e.s(["Twitch",()=>o],57909)},92163,68553,e=>{"use strict";var r=e.i(75254);let a=(0,r.default)("gamepad-2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);e.s(["Gamepad2",()=>a],92163);let t=(0,r.default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);e.s(["Camera",()=>t],68553)},54598,e=>{"use strict";var r=e.i(43476),a=e.i(71645),t=e.i(78917),o=e.i(86536),i=e.i(87316),n=e.i(94983),l=e.i(14764),s=e.i(50682),c=e.i(23616),d=e.i(57909),p=e.i(53339),m=e.i(92163),b=e.i(68553),f=e.i(78716),x=e.i(63488),u=e.i(48256),h=e.i(58524),g=e.i(88081),y=e.i(3116),v=e.i(13032);function k({platform:e,size:a=16}){let t={discord:n.MessageCircle,telegram:l.Send,twitter:g.Hash,github:s.Github,youtube:c.Youtube,twitch:d.Twitch,spotify:p.Music,steam:m.Gamepad2,instagram:b.Camera,tiktok:f.Video,snapchat:w,reddit:u.Globe,soundcloud:p.Music,kick:f.Video,email:x.Mail}[e]||u.Globe;return(0,r.jsx)(t,{size:a})}function w(e){return(0,r.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...e,width:e.size,height:e.size,children:(0,r.jsx)("path",{d:"M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"})})}let $=(0,a.memo)(function({color:e,intensity:t}){let o=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let r,a=o.current;if(!a)return;let i=a.getContext("2d");if(!i)return;let n=0,l=Math.min(Math.floor(t/100*40)+8,40),s=()=>{a.width=a.offsetWidth,a.height=a.offsetHeight};s(),window.addEventListener("resize",s);let c=Array.from({length:l},()=>({x:Math.random()*a.width,y:Math.random()*a.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,size:2*Math.random()+.5,opacity:.5*Math.random()+.1})),d=t=>{if(t-n<33.333333333333336){r=requestAnimationFrame(d);return}n=t,i.clearRect(0,0,a.width,a.height),c.forEach(r=>{r.x+=r.vx,r.y+=r.vy,(r.x<0||r.x>a.width)&&(r.vx*=-1),(r.y<0||r.y>a.height)&&(r.vy*=-1),i.beginPath(),i.arc(r.x,r.y,r.size,0,2*Math.PI),i.fillStyle=e+Math.floor(255*r.opacity).toString(16).padStart(2,"0"),i.fill()});for(let r=0;r<c.length;r++)for(let a=r+1;a<c.length;a++){let t=c[r].x-c[a].x,o=c[r].y-c[a].y,n=t*t+o*o;n<6400&&(i.beginPath(),i.moveTo(c[r].x,c[r].y),i.lineTo(c[a].x,c[a].y),i.strokeStyle=e+Math.floor((1-Math.sqrt(n)/80)*30).toString(16).padStart(2,"0"),i.lineWidth=.5,i.stroke())}r=requestAnimationFrame(d)};return r=requestAnimationFrame(d),()=>{cancelAnimationFrame(r),window.removeEventListener("resize",s)}},[e,t]),(0,r.jsx)("canvas",{ref:o,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),C=(0,a.memo)(function({color:e,intensity:t}){let o=Math.floor(t/100*40)+8,i=(0,a.useMemo)(()=>Array.from({length:o},(e,r)=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,width:`${3*Math.random()+1}px`,height:`${3*Math.random()+1}px`,duration:`${3*Math.random()+2}s`,delay:`${5*Math.random()}s`,opacity:.7*Math.random()+.1})),[o]);return(0,r.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,t)=>(0,r.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:a.top,width:a.width,height:a.height,backgroundColor:e,opacity:a.opacity,animation:`bio-twinkle ${a.duration} ease-in-out infinite`,animationDelay:a.delay}},t))})}),j=(0,a.memo)(function({color:e,intensity:t}){let o=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let r,a=o.current;if(!a)return;let i=a.getContext("2d");if(!i)return;let n=0;a.width=a.offsetWidth,a.height=a.offsetHeight;let l=Array(Math.floor(a.width/12)).fill(1),s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*",c=o=>{if(o-n<50){r=requestAnimationFrame(c);return}n=o,i.fillStyle="rgba(0, 0, 0, 0.05)",i.fillRect(0,0,a.width,a.height),i.fillStyle=e,i.font="12px monospace",i.globalAlpha=t/100*.5;for(let e=0;e<l.length;e++){let r=s[Math.floor(Math.random()*s.length)];i.fillText(r,12*e,12*l[e]),12*l[e]>a.height&&Math.random()>.975&&(l[e]=0),l[e]++}i.globalAlpha=1,r=requestAnimationFrame(c)};return r=requestAnimationFrame(c),()=>cancelAnimationFrame(r)},[e,t]),(0,r.jsx)("canvas",{ref:o,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),N=(0,a.memo)(function({color:e,intensity:t}){let o=Math.floor(t/100*30)+8,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,size:`${4*Math.random()+2}px`,opacity:.6*Math.random()+.2,duration:`${5*Math.random()+5}s`,delay:`${10*Math.random()}s`})),[o]);return(0,r.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,t)=>(0,r.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:"-5%",width:a.size,height:a.size,backgroundColor:e,opacity:a.opacity,animation:`bio-snowfall ${a.duration} linear infinite`,animationDelay:a.delay}},t))})}),M=(0,a.memo)(function({color:e,intensity:t}){let o=Math.floor(t/100*40)+10,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,height:`${20*Math.random()+10}px`,opacity:.4*Math.random()+.1,duration:`${+Math.random()+.5}s`,delay:`${3*Math.random()}s`})),[o]);return(0,r.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,t)=>(0,r.jsx)("div",{className:"absolute",style:{left:a.left,top:"-5%",width:"1px",height:a.height,backgroundColor:e,opacity:a.opacity,animation:`bio-rainfall ${a.duration} linear infinite`,animationDelay:a.delay}},t))})}),S=(0,a.memo)(function({color:e,intensity:t}){let o=Math.floor(t/100*15)+4,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,size:`${5*Math.random()+3}px`,shadow1:`${10*Math.random()+5}px`,shadow2:`${20*Math.random()+10}px`,duration:`${4*Math.random()+3}s`,delay:`${5*Math.random()}s`})),[o]);return(0,r.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,t)=>(0,r.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:a.top,width:a.size,height:a.size,backgroundColor:e,boxShadow:`0 0 ${a.shadow1} ${e}, 0 0 ${a.shadow2} ${e}`,opacity:0,animation:`bio-firefly ${a.duration} ease-in-out infinite`,animationDelay:a.delay}},t))})});function z({effect:e,color:a,intensity:t}){switch(e){case"particles":return(0,r.jsx)($,{color:a,intensity:t});case"stars":return(0,r.jsx)(C,{color:a,intensity:t});case"matrix":return(0,r.jsx)(j,{color:a,intensity:t});case"snow":return(0,r.jsx)(N,{color:a,intensity:t});case"rain":return(0,r.jsx)(M,{color:a,intensity:t});case"fireflies":return(0,r.jsx)(S,{color:a,intensity:t});default:return null}}function E(e,r=0){if(!e||"string"!=typeof e)return null;let a=e.match(/(track|album|playlist|artist|episode|show)[\/:]([a-zA-Z0-9]+)/);return a&&a[1]&&a[2]?`https://open.spotify.com/embed/${a[1]}/${a[2]}?utm_source=generator&theme=${r}`:null}function A({config:e,realViews:a}){let{theme:l,effects:s,socials:c,customLinks:d,music:m,stats:b}=e,f=`https://fonts.googleapis.com/css2?family=${l.fontFamily.replace(/ /g,"+")}:wght@300;400;500;600;700;900&display=swap`,x={};if("solid"===l.bgType)x.backgroundColor=l.bgColor1;else if("gradient"===l.bgType)x.background=`linear-gradient(135deg, ${l.bgColor1} 0%, ${l.bgColor2} 100%)`;else if("image"===l.bgType)x.backgroundImage=`url(${l.bgImageUrl})`,x.backgroundSize="cover",x.backgroundPosition="center";else if("pattern"===l.bgType)switch(x.backgroundColor=l.bgColor1,l.bgPattern){case"dots":default:x.backgroundImage=`radial-gradient(${l.bgColor2} 2px, transparent 2px)`,x.backgroundSize="30px 30px";break;case"grid":x.backgroundImage=`linear-gradient(${l.bgColor2} 1px, transparent 1px), linear-gradient(90deg, ${l.bgColor2} 1px, transparent 1px)`,x.backgroundSize="30px 30px";break;case"waves":x.backgroundImage=`repeating-radial-gradient(circle at 0 0, transparent 0, ${l.bgColor2} 2px, transparent 2px, transparent 20px)`;break;case"diagonal":x.backgroundImage=`repeating-linear-gradient(45deg, ${l.bgColor2} 0, ${l.bgColor2} 2px, transparent 0, transparent 50%)`,x.backgroundSize="20px 20px"}let u=()=>{let e=s.entranceAnimation;return"none"===e?"":`bio-entrance-${e}`},g=r=>({animationDelay:`${r*((e.entranceSpeed??200)/2e3)}s`,animationFillMode:"both",animationDuration:`${(e.entranceSpeed??200)*2}ms`}),w=l.glowEnabled?`0 0 ${l.glowIntensity}px ${l.glowColor}44, 0 0 ${2*l.glowIntensity}px ${l.glowColor}22`:"none",$=()=>{let r=e.borderWidth??1,a=e.borderColor||"#ffffff",t=(e.borderOpacity??10)/100,o=`${a}${Math.round(255*t).toString(16).padStart(2,"0")}`;switch(e.borderStyle){case"solid":return{border:`${r}px solid ${o}`};case"dashed":return{border:`${r}px dashed ${o}`};case"gradient":return{border:`${r}px solid transparent`,backgroundClip:"padding-box, border-box",backgroundImage:`linear-gradient(${e.glassmorphism?.enabled?`rgba(255,255,255,${e.glassmorphism.opacity/100})`:l.bgColor1}, ${e.glassmorphism?.enabled?`rgba(255,255,255,${e.glassmorphism.opacity/100})`:l.bgColor1}), linear-gradient(135deg, ${l.primaryColor}, ${l.secondaryColor})`};default:return e.glassmorphism?.enabled&&"animated"!==e.borderStyle?{border:`${r}px solid rgba(255,255,255,0.08)`}:{border:"none"}}},C=e.boxWidth??500,j=e.boxSpacing??40,N=e.boxColor||"#000000",M=(e.boxOpacity??30)/100,S=e.boxBlur??12,A=e.boxShadowColor||"#000000",R=(e.boxShadowOpacity??50)/100,T=e.glassmorphism?.enabled?{backdropFilter:`blur(${e.glassmorphism.blur}px)`,WebkitBackdropFilter:`blur(${e.glassmorphism.blur}px)`,backgroundColor:`rgba(255,255,255,${e.glassmorphism.opacity/100})`,borderRadius:`${l.borderRadius}px`,padding:`${j}px`,maxWidth:`${C}px`,width:"100%",boxShadow:`0 8px 32px ${A}${Math.round(255*R).toString(16).padStart(2,"0")}`,...$()}:{...$(),borderRadius:`${l.borderRadius}px`,padding:`${j}px`,maxWidth:`${C}px`,width:"100%",backgroundColor:`${N}${Math.round(255*M).toString(16).padStart(2,"0")}`,backdropFilter:S>0?`blur(${S}px)`:void 0,boxShadow:`0 8px 32px ${A}${Math.round(255*R).toString(16).padStart(2,"0")}`},F="default"!==s.customCursor?{cursor:s.customCursor}:{};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
        @import url('${f}');
        
        @keyframes bio-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes bio-snowfall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(calc(100vh + 10px)) rotate(360deg); }
        }
        
        @keyframes bio-rainfall {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(calc(100vh + 20px)); }
        }
        
        @keyframes bio-firefly {
          0%, 100% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: 0.8; transform: translate(15px, -10px); }
          50% { opacity: 0.3; transform: translate(-10px, 15px); }
          75% { opacity: 0.9; transform: translate(10px, -5px); }
        }
        
        @keyframes bio-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px ${l.primaryColor}44, 0 0 40px ${l.primaryColor}22; }
          50% { box-shadow: 0 0 30px ${l.primaryColor}66, 0 0 60px ${l.primaryColor}33; }
        }
        
        @keyframes bio-rotate-border {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        
        @keyframes bio-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bio-glitch {
          0%, 100% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 30% 0); transform: translateX(-2px); }
          40% { clip-path: inset(50% 0 10% 0); transform: translateX(2px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translateX(-1px); }
          80% { clip-path: inset(40% 0 20% 0); transform: translateX(1px); }
        }
        
        @keyframes bio-text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bio-neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 7px ${l.primaryColor}, 0 0 10px ${l.primaryColor}, 0 0 21px ${l.primaryColor};
            opacity: 1;
          }
          20%, 24%, 55% { text-shadow: none; opacity: 0.8; }
        }
        
        @keyframes bio-typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes bio-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bio-scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bio-slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bio-glitch-in {
          0% { opacity: 0; transform: translateX(-5px); filter: blur(4px); }
          20% { opacity: 0.5; transform: translateX(3px); filter: blur(2px); }
          40% { opacity: 0.7; transform: translateX(-2px); filter: blur(1px); }
          60% { opacity: 0.9; transform: translateX(1px); filter: blur(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        
        @keyframes bio-slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bio-slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bio-spin-in {
          from { opacity: 0; transform: scale(0.5) rotate(-180deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        
        @keyframes bio-flip-x {
          from { opacity: 0; transform: perspective(400px) rotateX(90deg); }
          to { opacity: 1; transform: perspective(400px) rotateX(0deg); }
        }
        
        @keyframes bio-bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        @keyframes bio-border-pulse {
          0%, 100% { border-color: ${l.primaryColor}40; }
          50% { border-color: ${l.primaryColor}80; }
        }

        @keyframes bio-diamond-spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        .bio-diamond-spin {
          display: inline-block;
          animation: bio-diamond-spin 3s linear infinite;
          perspective: 1000px;
        }
        
        .bio-avatar-glow-pulse { animation: bio-glow-pulse 3s ease-in-out infinite; }
        
        .bio-avatar-rotate-border {
          background: conic-gradient(from var(--angle, 0deg), ${l.primaryColor}, ${l.secondaryColor}, ${l.accentColor}, ${l.primaryColor});
          padding: 3px;
          animation: bio-rotate-border 3s linear infinite;
        }
        
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        
        .bio-avatar-glitch { animation: bio-glitch 3s ease-in-out infinite; }
        .bio-avatar-breathe { animation: bio-breathe 4s ease-in-out infinite; }
        
        .bio-text-gradient {
          background: linear-gradient(90deg, ${l.primaryColor}, ${l.secondaryColor}, ${l.accentColor}, ${l.primaryColor});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bio-text-gradient 4s ease infinite;
        }
        
        .bio-text-glitch { animation: bio-glitch 2s ease-in-out infinite; }
        .bio-text-neon { animation: bio-neon-flicker 3s ease-in-out infinite; color: ${l.primaryColor}; }
        
        .bio-text-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: bio-typewriter 2s steps(30) forwards;
          border-right: 2px solid ${l.primaryColor};
        }
        
        .bio-entrance-fade-up { animation: bio-fade-up 0.6s ease-out; }
        .bio-entrance-scale { animation: bio-scale-in 0.6s ease-out; }
        .bio-entrance-slide-left { animation: bio-slide-left 0.6s ease-out; }
        .bio-entrance-slide-right { animation: bio-slide-right 0.6s ease-out; }
        .bio-entrance-slide-down { animation: bio-slide-down 0.6s ease-out; }
        .bio-entrance-spin-in { animation: bio-spin-in 0.6s ease-out; }
        .bio-entrance-flip-x { animation: bio-flip-x 0.6s ease-out; }
        .bio-entrance-bounce-in { animation: bio-bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .bio-entrance-glitch-in { animation: bio-glitch-in 0.8s ease-out; }
        .bio-entrance-zoom-rotate { animation: bio-zoom-rotate 0.7s ease-out; }
        .bio-entrance-elastic { animation: bio-elastic 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .bio-entrance-blur-in { animation: bio-blur-in 0.6s ease-out; }
        .bio-entrance-drop-in { animation: bio-drop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        @keyframes bio-zoom-rotate {
          from { opacity: 0; transform: scale(0.3) rotate(-15deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes bio-elastic {
          0% { opacity: 0; transform: scale(0); }
          55% { opacity: 1; transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes bio-blur-in {
          from { opacity: 0; filter: blur(20px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes bio-drop-in {
          from { opacity: 0; transform: translateY(-60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bio-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bio-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bio-pulse-ring-anim {
          0% { box-shadow: 0 0 0 0 ${l.primaryColor}66; }
          70% { box-shadow: 0 0 0 12px ${l.primaryColor}00; }
          100% { box-shadow: 0 0 0 0 ${l.primaryColor}00; }
        }
        @keyframes bio-shadow-dance {
          0%, 100% { box-shadow: 5px 5px 20px ${l.primaryColor}44; }
          25% { box-shadow: -5px 5px 20px ${l.secondaryColor}44; }
          50% { box-shadow: -5px -5px 20px ${l.accentColor}44; }
          75% { box-shadow: 5px -5px 20px ${l.primaryColor}44; }
        }
        
        .bio-avatar-float { animation: bio-float 3s ease-in-out infinite; }
        .bio-avatar-spin-slow { animation: bio-spin-slow 12s linear infinite; }
        .bio-avatar-pulse-ring { animation: bio-pulse-ring-anim 2s ease infinite; }
        .bio-avatar-shadow-dance { animation: bio-shadow-dance 4s ease-in-out infinite; }
        
        .bio-animated-border {
          position: relative;
        }
        .bio-animated-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: ${l.borderRadius+2}px;
          background: conic-gradient(from var(--angle, 0deg), ${l.primaryColor}, ${l.secondaryColor}, ${l.accentColor}, ${l.primaryColor});
          animation: bio-rotate-border 3s linear infinite;
          z-index: -1;
        }
        
        /* HOVER EFFECTS */
        ${"lift"===(s.hoverEffect||"lift")?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3), ${"none"!==w?`0 0 20px ${l.primaryColor}33`:"0 0 0 transparent"}; }
        `:""}
        ${"glow"===s.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid transparent; }
          .bio-link-hover:hover { box-shadow: 0 0 20px ${l.primaryColor}80; border-color: ${l.primaryColor}60; transform: translateY(-1px); }
        `:""}
        ${"scale"===s.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: scale(1.03); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        `:""}
        ${"neon"===s.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
          .bio-link-hover:hover { 
            box-shadow: 0 0 10px ${l.primaryColor}, inset 0 0 10px ${l.primaryColor}; 
            border-color: ${l.primaryColor}; 
            color: ${l.primaryColor};
            background-color: ${l.primaryColor}10;
          }
        `:""}
        ${"shake"===s.hoverEffect?`
          @keyframes hover-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-1deg); }
            75% { transform: translateX(3px) rotate(1deg); }
          }
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { animation: hover-shake 0.3s ease-in-out infinite; }
        `:""}
        ${"underline-slide"===s.hoverEffect?`
          .bio-link-hover { position: relative; transition: all 0.2s ease; overflow: hidden; }
          .bio-link-hover::after { content: ''; position: absolute; bottom: 0; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, ${l.primaryColor}, ${l.secondaryColor}); transition: left 0.3s ease; }
          .bio-link-hover:hover::after { left: 0; }
          .bio-link-hover:hover { transform: translateY(-1px); }
        `:""}
        ${"border-glow"===s.hoverEffect?`
          .bio-link-hover { transition: all 0.3s ease; border: 1px solid transparent !important; }
          .bio-link-hover:hover { border-color: ${l.primaryColor} !important; box-shadow: 0 0 15px ${l.primaryColor}40, inset 0 0 15px ${l.primaryColor}10; transform: translateY(-1px); }
        `:""}
        ${"tilt-3d"===s.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; transform-style: preserve-3d; perspective: 600px; }
          .bio-link-hover:hover { transform: perspective(600px) rotateX(-5deg) rotateY(3deg) translateY(-3px); box-shadow: 5px 10px 20px rgba(0,0,0,0.3); }
        `:""}
        ${"haul"===s.hoverEffect?`
          @keyframes hover-haul-pull {
            0% { transform: scale(1) translateX(0); }
            30% { transform: scale(0.96) translateX(-4px); filter: brightness(1.2); }
            50% { transform: scale(0.96) translateX(-5px); }
            100% { transform: scale(1.02) translateX(2px); filter: brightness(1.1); }
          }
          .bio-link-hover { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .bio-link-hover:hover { 
            animation: hover-haul-pull 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2), -5px 0 15px rgba(249,115,22,0.1); 
            border-color: ${l.primaryColor}80 !important;
          }
        `:""}

        /* OVERLAYS */
        .bio-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 50;
        }
        
        .bio-overlay-vhs {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          mix-blend-mode: overlay;
        }
        
        .bio-overlay-scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
          background-size: 100% 4px;
        }

        .bio-overlay-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.15;
          mix-blend-mode: overlay;
        }

        @keyframes cyber-glitch-overlay {
          0% { background-color: transparent; }
          1% { background-color: ${l.primaryColor}20; mix-blend-mode: color-dodge; }
          2% { background-color: transparent; }
          15% { background-color: transparent; }
          16% { background-color: ${l.accentColor}20; transform: translateX(2px); }
          17% { background-color: transparent; transform: translateX(0); }
          100% { background-color: transparent; }
        }

        .bio-overlay-cyberpunk-glitch {
          animation: cyber-glitch-overlay 3s infinite;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
        }

        /* USERNAME SPARKLES */
        @keyframes bio-sparkle-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bio-sparkle-rainbow {
          background: linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }
        .bio-sparkle-gold {
          background: linear-gradient(90deg, #d4a574, #ffd700, #d4a574, #ffd700);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }
        .bio-sparkle-silver {
          background: linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0, #e8e8e8);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }
        .bio-sparkle-fire {
          background: linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ff4500);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 2s linear infinite;
        }
        .bio-sparkle-ice {
          background: linear-gradient(90deg, #87ceeb, #e0f0ff, #4fc3f7, #e0f0ff);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }

        /* BOX TILT */
        ${"scale"===e.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: scale(1.02); }":""}
        ${"reverse-scale"===e.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: scale(0.98); }":""}
        ${"tilt-x"===e.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: perspective(800px) rotateX(-3deg); }":""}
        ${"tilt-y"===e.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: perspective(800px) rotateY(3deg); }":""}

        /* AVATAR DECO */
        @keyframes bio-deco-bounce { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -4px); } }
        .bio-avatar-deco { animation: bio-deco-bounce 2s ease-in-out infinite; }
        
        ${e.customCss}
      `}),(0,r.jsxs)("div",{className:"bio-page relative w-full h-full overflow-y-auto overflow-x-hidden",style:{...x,...F,fontFamily:`'${l.fontFamily}', system-ui, sans-serif`,opacity:(e.bgOpacity??100)/100},children:[(e.bgBlur??0)>0&&(0,r.jsx)("div",{className:"absolute inset-0 pointer-events-none z-0",style:{backdropFilter:`blur(${e.bgBlur}px)`}}),"video"===l.bgType&&l.bgVideoUrl&&(0,r.jsx)("video",{src:l.bgVideoUrl,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"}),s.overlayEffect&&"none"!==s.overlayEffect&&(0,r.jsx)("div",{className:`bio-overlay bio-overlay-${s.overlayEffect}`}),e.backgroundOverlay?.enabled&&(0,r.jsx)("div",{className:"absolute inset-0 pointer-events-none z-[1]",style:{backgroundColor:e.backgroundOverlay.color,opacity:e.backgroundOverlay.opacity/100}}),"none"!==s.bgEffect&&(0,r.jsx)(z,{effect:s.bgEffect,color:s.bgEffectColor,intensity:s.bgEffectIntensity}),e.bannerUrl&&(0,r.jsxs)("div",{className:`w-full overflow-hidden ${u()}`,style:{...g(0),height:`${e.bannerHeight||200}px`,flexShrink:0,position:"relative",zIndex:5},children:[(0,r.jsx)("img",{src:e.bannerUrl,alt:"Banner",className:"w-full h-full object-cover",style:{borderRadius:"card"===e.layoutPreset?`${l.borderRadius}px ${l.borderRadius}px 0 0`:0,opacity:(e.bannerOpacity??100)/100,filter:(e.bannerBlur??0)>0?`blur(${e.bannerBlur}px)`:void 0}}),(0,r.jsx)("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)"}})]}),(0,r.jsxs)("div",{className:`relative z-10 flex flex-col ${"left-aligned"===e.layoutPreset?"items-start text-left":"items-center"} my-8 mx-auto h-fit ${"animated"===e.borderStyle?"bio-animated-border":""} ${e.boxTilt&&"none"!==e.boxTilt?"bio-box-tilt":""}`,style:T,children:[e.statusIndicator?.enabled&&(0,r.jsxs)("div",{className:`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${u()}`,style:{...g(0),backgroundColor:`${e.statusIndicator.color}15`,border:`1px solid ${e.statusIndicator.color}30`},children:[(0,r.jsx)("span",{className:"text-sm",children:e.statusIndicator.emoji}),(0,r.jsx)("span",{className:"text-[11px] font-medium",style:{color:e.statusIndicator.color},children:e.statusIndicator.text})]}),e.languageTag&&(0,r.jsx)("div",{className:`mb-3 px-2 py-0.5 rounded text-[8px] uppercase tracking-[0.3em] font-bold ${u()}`,style:{...g(0),backgroundColor:`${l.primaryColor}10`,border:`1px solid ${l.primaryColor}20`,color:l.primaryColor},children:e.languageTag}),(0,r.jsxs)("div",{className:`${u()} ${function(e){switch(e){case"glow-pulse":return"bio-avatar-glow-pulse";case"rotate-border":return"bio-avatar-rotate-border";case"glitch":return"bio-avatar-glitch";case"breathe":return"bio-avatar-breathe";case"float":return"bio-avatar-float";case"spin-slow":return"bio-avatar-spin-slow";case"pulse-ring":return"bio-avatar-pulse-ring";case"shadow-dance":return"bio-avatar-shadow-dance";default:return""}}(s.avatarEffect)} mb-5 relative`,style:g(1),children:[(0,r.jsx)("div",{className:"w-24 h-24 overflow-hidden flex items-center justify-center text-3xl font-bold",style:{...function(e){switch(e){case"rounded-square":return{borderRadius:"20%"};case"hexagon":return{clipPath:"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"};default:return{borderRadius:"50%"}}}(e.profileShape),borderRadius:"circle"===e.profileShape?`${e.avatarRadius??50}%`:"rounded-square"===e.profileShape?`${(e.avatarRadius??50)/4}px`:void 0,border:`2px solid ${l.primaryColor}60`,boxShadow:l.glowEnabled?`0 0 25px ${l.glowColor}44`:"none",backgroundColor:`${l.primaryColor}15`,color:l.primaryColor},children:e.avatarUrl?(0,r.jsx)("img",{src:e.avatarUrl,alt:"avatar",className:"w-full h-full object-cover"}):e.displayName?.[0]?.toUpperCase()||"?"}),e.avatarDecoration&&"none"!==e.avatarDecoration&&(0,r.jsx)("span",{className:"absolute -top-3 left-1/2 -translate-x-1/2 text-2xl pointer-events-none bio-avatar-deco",style:{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"},children:"cat-ears"===e.avatarDecoration?"🐱":"crown"===e.avatarDecoration?"👑":"horns"===e.avatarDecoration?"😈":"halo"===e.avatarDecoration?"😇":"🔥"})]}),(0,r.jsx)("h1",{className:`text-2xl font-bold mb-1 ${u()} ${function(e){switch(e){case"gradient":return"bio-text-gradient";case"glitch":return"bio-text-glitch";case"typewriter":return"bio-text-typewriter";case"neon-flicker":return"bio-text-neon";default:return""}}(s.textEffect)}`,style:{...g(2),..."gradient"===s.textEffect?{}:"neon-flicker"===s.textEffect?{color:l.primaryColor}:{color:"white"}},children:e.displayName||"Username"}),(0,r.jsxs)("p",{className:`text-sm mb-2 ${u()} ${e.usernameSparkles&&"none"!==e.usernameSparkles?`bio-sparkle-${e.usernameSparkles}`:""}`,style:{...g(3),color:`${l.primaryColor}aa`},children:["@",e.username||"username",e.pronouns&&(0,r.jsxs)("span",{className:"ml-2 opacity-50",children:["• ",e.pronouns]})]}),e.location&&(0,r.jsxs)("p",{className:`text-xs mb-2 ${u()}`,style:{...g(3),color:`${l.primaryColor}66`},children:["📍 ",e.location]}),e.badges.length>0&&(0,r.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-1.5 mb-4 ${u()}`,style:g(4),children:e.badges.map((e,a)=>(0,r.jsxs)("span",{className:"px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5",style:{borderRadius:`${l.borderRadius/2}px`,backgroundColor:"VIP"===e?"rgba(255, 215, 0, 0.15)":`${l.primaryColor}15`,border:`1px solid ${"VIP"===e?"rgba(255, 215, 0, 0.4)":`${l.primaryColor}30`}`,color:"VIP"===e?"#ffd700":l.primaryColor,boxShadow:"VIP"===e?"0 0 10px rgba(255, 215, 0, 0.1)":"none"},children:["VIP"===e&&(0,r.jsx)("span",{className:"bio-diamond-spin",children:(0,r.jsx)(v.Diamond,{size:10,fill:"currentColor"})}),e]},a))}),(0,r.jsx)("p",{className:`${"left-aligned"===e.layoutPreset?"text-left":"text-center"} text-sm mb-6 max-w-[280px] ${u()} ${e.typingBio?"bio-text-typewriter":""}`,style:{...g(5),color:"rgba(255,255,255,0.5)",lineHeight:"1.6"},children:e.bio||"Your bio goes here..."}),(b.showViews||b.showJoinDate||b.customStats.length>0)&&(0,r.jsxs)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-6 mb-8 ${u()}`,style:g(6),children:[b.showViews&&(0,r.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,r.jsx)(o.Eye,{size:13,style:{color:l.primaryColor}}),(0,r.jsx)("span",{className:"text-xs font-semibold text-white/70",children:void 0!==a?a.toLocaleString():"0"}),(0,r.jsx)("span",{className:"text-[9px] uppercase tracking-wider text-white/30",children:"views"})]}),b.showJoinDate&&(0,r.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,r.jsx)(i.Calendar,{size:13,style:{color:l.primaryColor}}),(0,r.jsx)("span",{className:"text-xs font-semibold text-white/70",children:"Mar 2026"})]}),b.customStats.filter(e=>e.label&&e.value).map((e,a)=>(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("div",{className:"text-sm font-bold text-white/80",children:e.value}),(0,r.jsx)("div",{className:"text-[9px] uppercase tracking-wider text-white/30",children:e.label})]},a))]}),c.filter(e=>e.url).length>0&&(0,r.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-3 mb-8 ${u()}`,style:g(7),children:c.filter(e=>e.url).map((e,a)=>(0,r.jsx)("a",{href:e.url,target:"_blank",rel:"noopener noreferrer",className:"w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",style:{backgroundColor:`${l.primaryColor}10`,border:`1px solid ${l.primaryColor}25`,color:l.primaryColor},children:(0,r.jsx)(k,{platform:e.platform,size:16})},a))}),d.filter(e=>e.enabled&&e.title).length>0&&(0,r.jsx)("div",{className:`w-full space-y-3 mb-8 ${u()}`,style:g(8),children:d.filter(e=>e.enabled&&e.title).map((e,a)=>(0,r.jsxs)("a",{href:e.url||"#",target:"_blank",rel:"noopener noreferrer",className:"bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group",style:{borderRadius:`${l.borderRadius}px`,backgroundColor:"glass"===l.cardStyle?"rgba(255,255,255,0.04)":"solid"===l.cardStyle?"rgba(255,255,255,0.06)":"transparent",border:"neon"===l.cardStyle?`1px solid ${l.primaryColor}40`:"outline"===l.cardStyle?"2px solid rgba(255,255,255,0.12)":"1px solid rgba(255,255,255,0.08)",backdropFilter:"glass"===l.cardStyle?"blur(12px)":"none",boxShadow:"neon"===l.cardStyle?`0 0 15px ${l.primaryColor}15`:"none"},children:[(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[(0,r.jsx)("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center",style:{backgroundColor:`${l.primaryColor}15`,color:l.primaryColor},children:(0,r.jsx)(h.Link2,{size:14})}),(0,r.jsx)("span",{className:"text-sm font-medium text-white/80 group-hover:text-white transition-colors",children:e.title})]}),(0,r.jsx)(t.ExternalLink,{size:14,className:"text-white/20 group-hover:text-white/50 transition-colors"})]},a))}),e.timeline?.enabled&&(e.timeline.items||[]).filter(e=>e.title).length>0&&(0,r.jsxs)("div",{className:`w-full mb-8 ${u()}`,style:g(9),children:[(0,r.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${l.primaryColor}80`},children:"Timeline"}),(0,r.jsxs)("div",{className:"relative pl-6",children:[(0,r.jsx)("div",{className:"absolute left-2 top-0 bottom-0 w-px",style:{backgroundColor:`${l.primaryColor}20`}}),(e.timeline.items||[]).filter(e=>e.title).map((e,a)=>(0,r.jsxs)("div",{className:"relative mb-6 last:mb-0",children:[(0,r.jsx)("div",{className:"absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2",style:{borderColor:l.primaryColor,backgroundColor:`${l.primaryColor}30`}}),e.date&&(0,r.jsxs)("div",{className:"flex items-center gap-1.5 mb-1",children:[(0,r.jsx)(y.Clock,{size:10,style:{color:`${l.primaryColor}60`}}),(0,r.jsx)("span",{className:"text-[10px] font-mono",style:{color:`${l.primaryColor}60`},children:e.date})]}),(0,r.jsx)("h4",{className:"text-sm font-semibold text-white/80",children:e.title}),e.description&&(0,r.jsx)("p",{className:"text-xs text-white/40 mt-0.5",children:e.description})]},a))]})]}),e.imageGallery?.enabled&&(e.imageGallery.images||[]).filter(e=>e.url).length>0&&(0,r.jsxs)("div",{className:`w-full mb-8 ${u()}`,style:g(10),children:[(0,r.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${l.primaryColor}80`},children:"Gallery"}),(0,r.jsx)("div",{className:"grid grid-cols-2 gap-2",children:(e.imageGallery.images||[]).filter(e=>e.url).map((e,a)=>(0,r.jsxs)("div",{className:"relative group rounded-xl overflow-hidden aspect-square",children:[(0,r.jsx)("img",{src:e.url,alt:e.caption||"",className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}),e.caption&&(0,r.jsx)("div",{className:"absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",children:(0,r.jsx)("span",{className:"text-[10px] text-white/80",children:e.caption})})]},a))})]}),e.embedVideo?.enabled&&e.embedVideo.url&&(0,r.jsx)("div",{className:`w-full mb-8 ${u()}`,style:g(11),children:(0,r.jsx)("div",{className:"w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06]",children:(0,r.jsx)("iframe",{src:e.embedVideo.url.replace("watch?v=","embed/").split("&")[0],className:"w-full h-full",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})})}),m.enabled&&m.url&&(0,r.jsxs)("div",{className:`w-full mb-8 ${u()}`,style:g(12),children:["spotify"===m.type&&E(m.url)&&(0,r.jsx)("iframe",{src:E(m.url,0)||"",width:"100%",height:"152",frameBorder:"0",allow:"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",loading:"lazy",className:"rounded-xl opacity-90 transition-all hover:opacity-100"}),"custom"===m.type&&(0,r.jsxs)("div",{className:"flex items-center gap-3 p-4",style:{borderRadius:`${l.borderRadius}px`,backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[(0,r.jsx)("div",{className:"w-10 h-10 rounded-lg flex items-center justify-center",style:{backgroundColor:`${l.primaryColor}15`,color:l.primaryColor},children:(0,r.jsx)(p.Music,{size:16})}),(0,r.jsx)("audio",{controls:!0,className:"flex-1 h-8 opacity-70",style:{filter:"invert(1)"},children:(0,r.jsx)("source",{src:m.url})})]})]}),e.discordWidget?.enabled&&e.discordWidget.userId&&(0,r.jsxs)("div",{className:`w-full mb-8 flex items-center gap-3 p-4 rounded-xl ${u()}`,style:{...g(13),backgroundColor:"rgba(88, 101, 242, 0.08)",border:"1px solid rgba(88, 101, 242, 0.15)"},children:[(0,r.jsx)(n.MessageCircle,{size:16,style:{color:"#5865F2"}}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"text-[10px] uppercase tracking-wider font-bold text-[#5865F2]/80",children:"Discord"}),(0,r.jsx)("div",{className:"text-xs text-white/60 font-mono",children:e.discordWidget.userId})]})]}),(0,r.jsx)("div",{className:`mt-auto pt-8 text-center ${u()}`,style:g(14),children:(0,r.jsx)("p",{className:"text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold",children:"Powered by Sagitarius.cc"})})]}),e.revealScreen?.enabled&&(0,r.jsx)("div",{className:"absolute inset-0 z-50 flex items-center justify-center cursor-pointer",style:{backdropFilter:`blur(${e.revealScreen.blur||15}px)`,backgroundColor:"rgba(0,0,0,0.5)"},onClick:e=>e.currentTarget.style.display="none",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("p",{className:"text-xl font-bold text-white mb-2",style:{textShadow:`0 0 20px ${l.primaryColor}`},children:e.revealScreen.text||"Click to enter"}),(0,r.jsx)("p",{className:"text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse",children:"Click anywhere"})]})})]})]})}e.s(["default",()=>A])}]);