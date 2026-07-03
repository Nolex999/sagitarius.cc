(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,53339,e=>{"use strict";let t=(0,e.i(75254).default)("music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);e.s(["Music",()=>t],53339)},58524,e=>{"use strict";let t=(0,e.i(75254).default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);e.s(["Link2",()=>t],58524)},78716,e=>{"use strict";let t=(0,e.i(75254).default)("video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);e.s(["Video",()=>t],78716)},50682,23616,57909,e=>{"use strict";var t=e.i(75254);let a=(0,t.default)("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);e.s(["Github",()=>a],50682);let r=(0,t.default)("youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]);e.s(["Youtube",()=>r],23616);let o=(0,t.default)("twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);e.s(["Twitch",()=>o],57909)},92163,68553,e=>{"use strict";var t=e.i(75254);let a=(0,t.default)("gamepad-2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);e.s(["Gamepad2",()=>a],92163);let r=(0,t.default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);e.s(["Camera",()=>r],68553)},54598,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(78917),o=e.i(86536),i=e.i(87316),n=e.i(94983),s=e.i(14764),l=e.i(50682),c=e.i(23616),d=e.i(57909),p=e.i(53339),m=e.i(92163),b=e.i(68553),u=e.i(78716),f=e.i(63488),x=e.i(48256),h=e.i(58524),g=e.i(88081),y=e.i(3116),k=e.i(13032);function v({platform:e,size:a=16}){let r={discord:n.MessageCircle,telegram:s.Send,twitter:g.Hash,github:l.Github,youtube:c.Youtube,twitch:d.Twitch,spotify:p.Music,steam:m.Gamepad2,instagram:b.Camera,tiktok:u.Video,snapchat:w,reddit:x.Globe,soundcloud:p.Music,kick:u.Video,email:f.Mail}[e]||x.Globe;return(0,t.jsx)(r,{size:a})}function w(e){return(0,t.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...e,width:e.size,height:e.size,children:(0,t.jsx)("path",{d:"M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"})})}let $=(0,a.memo)(function({color:e,intensity:r}){let o=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t,a=o.current;if(!a)return;let i=a.getContext("2d");if(!i)return;let n=0,s=Math.min(Math.floor(r/100*40)+8,40),l=()=>{a.width=a.offsetWidth,a.height=a.offsetHeight};l(),window.addEventListener("resize",l);let c=Array.from({length:s},()=>({x:Math.random()*a.width,y:Math.random()*a.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,size:2*Math.random()+.5,opacity:.5*Math.random()+.1})),d=r=>{if(r-n<33.333333333333336){t=requestAnimationFrame(d);return}n=r,i.clearRect(0,0,a.width,a.height),c.forEach(t=>{t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>a.width)&&(t.vx*=-1),(t.y<0||t.y>a.height)&&(t.vy*=-1),i.beginPath(),i.arc(t.x,t.y,t.size,0,2*Math.PI),i.fillStyle=e+Math.floor(255*t.opacity).toString(16).padStart(2,"0"),i.fill()});for(let t=0;t<c.length;t++)for(let a=t+1;a<c.length;a++){let r=c[t].x-c[a].x,o=c[t].y-c[a].y,n=r*r+o*o;n<6400&&(i.beginPath(),i.moveTo(c[t].x,c[t].y),i.lineTo(c[a].x,c[a].y),i.strokeStyle=e+Math.floor((1-Math.sqrt(n)/80)*30).toString(16).padStart(2,"0"),i.lineWidth=.5,i.stroke())}t=requestAnimationFrame(d)};return t=requestAnimationFrame(d),()=>{cancelAnimationFrame(t),window.removeEventListener("resize",l)}},[e,r]),(0,t.jsx)("canvas",{ref:o,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),C=(0,a.memo)(function({color:e,intensity:r}){let o=Math.floor(r/100*40)+8,i=(0,a.useMemo)(()=>Array.from({length:o},(e,t)=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,width:`${3*Math.random()+1}px`,height:`${3*Math.random()+1}px`,duration:`${3*Math.random()+2}s`,delay:`${5*Math.random()}s`,opacity:.7*Math.random()+.1})),[o]);return(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,r)=>(0,t.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:a.top,width:a.width,height:a.height,backgroundColor:e,opacity:a.opacity,animation:`bio-twinkle ${a.duration} ease-in-out infinite`,animationDelay:a.delay}},r))})}),j=(0,a.memo)(function({color:e,intensity:r}){let o=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t,a=o.current;if(!a)return;let i=a.getContext("2d");if(!i)return;let n=0;a.width=a.offsetWidth,a.height=a.offsetHeight;let s=Array(Math.floor(a.width/12)).fill(1),l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*",c=o=>{if(o-n<50){t=requestAnimationFrame(c);return}n=o,i.fillStyle="rgba(0, 0, 0, 0.05)",i.fillRect(0,0,a.width,a.height),i.fillStyle=e,i.font="12px monospace",i.globalAlpha=r/100*.5;for(let e=0;e<s.length;e++){let t=l[Math.floor(Math.random()*l.length)];i.fillText(t,12*e,12*s[e]),12*s[e]>a.height&&Math.random()>.975&&(s[e]=0),s[e]++}i.globalAlpha=1,t=requestAnimationFrame(c)};return t=requestAnimationFrame(c),()=>cancelAnimationFrame(t)},[e,r]),(0,t.jsx)("canvas",{ref:o,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),S=(0,a.memo)(function({color:e,intensity:r}){let o=Math.floor(r/100*30)+8,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,size:`${4*Math.random()+2}px`,opacity:.6*Math.random()+.2,duration:`${5*Math.random()+5}s`,delay:`${10*Math.random()}s`})),[o]);return(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,r)=>(0,t.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:"-5%",width:a.size,height:a.size,backgroundColor:e,opacity:a.opacity,animation:`bio-snowfall ${a.duration} linear infinite`,animationDelay:a.delay}},r))})}),N=(0,a.memo)(function({color:e,intensity:r}){let o=Math.floor(r/100*40)+10,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,height:`${20*Math.random()+10}px`,opacity:.4*Math.random()+.1,duration:`${+Math.random()+.5}s`,delay:`${3*Math.random()}s`})),[o]);return(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,r)=>(0,t.jsx)("div",{className:"absolute",style:{left:a.left,top:"-5%",width:"1px",height:a.height,backgroundColor:e,opacity:a.opacity,animation:`bio-rainfall ${a.duration} linear infinite`,animationDelay:a.delay}},r))})}),M=(0,a.memo)(function({color:e,intensity:r}){let o=Math.floor(r/100*15)+4,i=(0,a.useMemo)(()=>Array.from({length:o},()=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,size:`${5*Math.random()+3}px`,shadow1:`${10*Math.random()+5}px`,shadow2:`${20*Math.random()+10}px`,duration:`${4*Math.random()+3}s`,delay:`${5*Math.random()}s`})),[o]);return(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:i.map((a,r)=>(0,t.jsx)("div",{className:"absolute rounded-full",style:{left:a.left,top:a.top,width:a.size,height:a.size,backgroundColor:e,boxShadow:`0 0 ${a.shadow1} ${e}, 0 0 ${a.shadow2} ${e}`,opacity:0,animation:`bio-firefly ${a.duration} ease-in-out infinite`,animationDelay:a.delay}},r))})});function z({effect:e,color:a,intensity:r}){switch(e){case"particles":return(0,t.jsx)($,{color:a,intensity:r});case"stars":return(0,t.jsx)(C,{color:a,intensity:r});case"matrix":return(0,t.jsx)(j,{color:a,intensity:r});case"snow":return(0,t.jsx)(S,{color:a,intensity:r});case"rain":return(0,t.jsx)(N,{color:a,intensity:r});case"fireflies":return(0,t.jsx)(M,{color:a,intensity:r});default:return null}}function E(e,t=0){if(!e||"string"!=typeof e)return null;let a=e.match(/(track|album|playlist|artist|episode|show)[\/:]([a-zA-Z0-9]+)/);return a&&a[1]&&a[2]?`https://open.spotify.com/embed/${a[1]}/${a[2]}?utm_source=generator&theme=${t}`:null}function A({config:e,realViews:s}){let{theme:l,effects:c,socials:d,customLinks:m,music:b,stats:u}=e,f=`https://fonts.googleapis.com/css2?family=${l.fontFamily.replace(/ /g,"+")}:wght@300;400;500;600;700;900&display=swap`,[x,g]=(0,a.useState)(!1),[w,$]=(0,a.useState)(!1),[C,j]=(0,a.useState)(!1),S=(0,a.useRef)(null);(0,a.useEffect)(()=>{g(!e.revealScreen?.enabled)},[e.revealScreen?.enabled]),(0,a.useEffect)(()=>{b.enabled&&b.url&&"custom"===b.type&&x?b.autoplay&&S.current?.play().then(()=>$(!0)).catch(e=>console.log("Audio play blocked:",e)):(S.current?.pause(),$(!1))},[b.enabled,b.url,b.type,x,b.autoplay]),(0,a.useEffect)(()=>{if(!c.beatSync||!x)return void j(!1);let e=c.beatSyncBpm||120,t=()=>{j(!0),setTimeout(()=>j(!1),150)};t();let a=setInterval(t,60/e*1e3);return()=>clearInterval(a)},[c.beatSync,[c.beatSyncBpm],x]),(0,a.useEffect)(()=>{let e;if(!c.beatSync||"custom"!==b.type||!b.enabled||!b.url||!x||!w)return;let t=S.current;if(!t)return;let a=null;try{let r=(a=new(window.AudioContext||window.webkitAudioContext)).createAnalyser();a.createMediaElementSource(t).connect(r),r.connect(a.destination),r.fftSize=64;let o=r.frequencyBinCount,i=new Uint8Array(o),n=()=>{r.getByteFrequencyData(i);let t=0;for(let e=0;e<4;e++)t+=i[e];t/4>160&&(j(!0),setTimeout(()=>j(!1),120)),e=requestAnimationFrame(n)};e=requestAnimationFrame(n)}catch(e){}return()=>{e&&cancelAnimationFrame(e),a&&a.close()}},[c.beatSync,b.type,b.enabled,b.url,x,w]);let N={};if("solid"===l.bgType)N.backgroundColor=l.bgColor1;else if("gradient"===l.bgType)N.background=`linear-gradient(${l.gradientAngle||135}deg, ${l.bgColor1} 0%, ${l.bgColor2} 100%)`;else if("image"===l.bgType)N.backgroundImage=`url(${l.bgImageUrl})`,N.backgroundSize="cover",N.backgroundPosition="center";else if("pattern"===l.bgType)switch(N.backgroundColor=l.bgColor1,l.bgPattern){case"dots":default:N.backgroundImage=`radial-gradient(${l.bgColor2} 2px, transparent 2px)`,N.backgroundSize="30px 30px";break;case"grid":N.backgroundImage=`linear-gradient(${l.bgColor2} 1px, transparent 1px), linear-gradient(90deg, ${l.bgColor2} 1px, transparent 1px)`,N.backgroundSize="30px 30px";break;case"waves":N.backgroundImage=`repeating-radial-gradient(circle at 0 0, transparent 0, ${l.bgColor2} 2px, transparent 2px, transparent 20px)`;break;case"diagonal":N.backgroundImage=`repeating-linear-gradient(45deg, ${l.bgColor2} 0, ${l.bgColor2} 2px, transparent 0, transparent 50%)`,N.backgroundSize="20px 20px"}let M=(t,a)=>{let r=void 0!==a?a:t*(e.entranceSpeed??200);return{animationDelay:`${r}ms`,animationFillMode:"both",animationDuration:`${(e.entranceSpeed??200)*2}ms`}},A=l.glowEnabled?`0 0 ${l.glowIntensity}px ${l.glowColor}44, 0 0 ${2*l.glowIntensity}px ${l.glowColor}22`:"none",F=()=>"left-aligned"===e.layoutPreset?"items-start text-left":"items-center",R=()=>{let t=e.borderWidth??1,a=e.borderColor||"#ffffff",r=(e.borderOpacity??10)/100,o=`${a}${Math.round(255*r).toString(16).padStart(2,"0")}`;switch(e.borderStyle){case"solid":return{border:`${t}px solid ${o}`};case"dashed":return{border:`${t}px dashed ${o}`};case"gradient":return{border:`${t}px solid transparent`,backgroundClip:"padding-box, border-box",backgroundImage:`linear-gradient(${e.glassmorphism?.enabled?`rgba(255,255,255,${e.glassmorphism.opacity/100})`:l.bgColor1}, ${e.glassmorphism?.enabled?`rgba(255,255,255,${e.glassmorphism.opacity/100})`:l.bgColor1}), linear-gradient(135deg, ${l.primaryColor}, ${l.secondaryColor})`};default:return e.glassmorphism?.enabled&&"animated"!==e.borderStyle?{border:`${t}px solid rgba(255,255,255,0.08)`}:{border:"none"}}},T=e.boxWidth??500,I=e.boxSpacing??40,V=e.boxColor||"#000000",X=(e.boxOpacity??30)/100,Y=e.boxBlur??12,P=e.boxShadowColor||"#000000",q=(e.boxShadowOpacity??50)/100,D=e.glassmorphism?.enabled?{backdropFilter:`blur(${e.glassmorphism.blur}px)`,WebkitBackdropFilter:`blur(${e.glassmorphism.blur}px)`,backgroundColor:`rgba(255,255,255,${e.glassmorphism.opacity/100})`,borderRadius:`${l.borderRadius}px`,padding:`${I}px`,maxWidth:`${T}px`,width:"100%",boxShadow:`0 8px 32px ${P}${Math.round(255*q).toString(16).padStart(2,"0")}`,...R()}:{...R(),borderRadius:`${l.borderRadius}px`,padding:`${I}px`,maxWidth:`${T}px`,width:"100%",backgroundColor:`${V}${Math.round(255*X).toString(16).padStart(2,"0")}`,backdropFilter:Y>0?`blur(${Y}px)`:void 0,boxShadow:`0 8px 32px ${P}${Math.round(255*q).toString(16).padStart(2,"0")}`},B="default"!==c.customCursor?{cursor:c.customCursor}:{},L=c.capcutFilter&&"none"!==c.capcutFilter?`capcut-${c.capcutFilter}`:"",O=c.beatSync&&("card"===c.beatSyncElement||"all"===c.beatSyncElement)&&C,U=c.beatSync&&("border"===c.beatSyncElement||Math.round(c.beatSyncStrength||0)>0)&&C,W=c.beatSync&&("background"===c.beatSyncElement||"all"===c.beatSyncElement)&&C,H=c.beatSync&&("avatar"===c.beatSyncElement||"all"===c.beatSyncElement)&&C,G=()=>{let e=c.entranceAnimation;return"none"===e?"":`bio-entrance-${e}`};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
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
        ${"lift"===(c.hoverEffect||"lift")?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3), ${"none"!==A?`0 0 20px ${l.primaryColor}33`:"0 0 0 transparent"}; }
        `:""}
        ${"glow"===c.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid transparent; }
          .bio-link-hover:hover { box-shadow: 0 0 20px ${l.primaryColor}80; border-color: ${l.primaryColor}60; transform: translateY(-1px); }
        `:""}
        ${"scale"===c.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: scale(1.03); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        `:""}
        ${"neon"===c.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
          .bio-link-hover:hover { 
            box-shadow: 0 0 10px ${l.primaryColor}, inset 0 0 10px ${l.primaryColor}; 
            border-color: ${l.primaryColor}; 
            color: ${l.primaryColor};
            background-color: ${l.primaryColor}10;
          }
        `:""}
        ${"shake"===c.hoverEffect?`
          @keyframes hover-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-1deg); }
            75% { transform: translateX(3px) rotate(1deg); }
          }
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { animation: hover-shake 0.3s ease-in-out infinite; }
        `:""}
        ${"underline-slide"===c.hoverEffect?`
          .bio-link-hover { position: relative; transition: all 0.2s ease; overflow: hidden; }
          .bio-link-hover::after { content: ''; position: absolute; bottom: 0; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, ${l.primaryColor}, ${l.secondaryColor}); transition: left 0.3s ease; }
          .bio-link-hover:hover::after { left: 0; }
          .bio-link-hover:hover { transform: translateY(-1px); }
        `:""}
        ${"border-glow"===c.hoverEffect?`
          .bio-link-hover { transition: all 0.3s ease; border: 1px solid transparent !important; }
          .bio-link-hover:hover { border-color: ${l.primaryColor} !important; box-shadow: 0 0 15px ${l.primaryColor}40, inset 0 0 15px ${l.primaryColor}10; transform: translateY(-1px); }
        `:""}
        ${"tilt-3d"===c.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; transform-style: preserve-3d; perspective: 600px; }
          .bio-link-hover:hover { transform: perspective(600px) rotateX(-5deg) rotateY(3deg) translateY(-3px); box-shadow: 5px 10px 20px rgba(0,0,0,0.3); }
        `:""}
        ${"haul"===c.hoverEffect?`
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
          background: linear-gradient(90deg, #5eead4, #38bdf8, #5eead4, #38bdf8);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }
        .bio-sparkle-silver {
          background: linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0, #e8e8e8);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: bio-sparkle-shimmer 3s linear infinite;
        }
        .bio-sparkle-fire {
          background: linear-gradient(90deg, #06b6d4, #38bdf8, #5eead4, #06b6d4);
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

        /* CAPCUT & CANVA ADVANCED EFFECTS */
        
        /* Loop Animations */
        @keyframes bio-loop-float-key {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .bio-loop-float { animation: bio-loop-float-key 3s ease-in-out infinite; }
        
        @keyframes bio-loop-breathe-key {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .bio-loop-breathe { animation: bio-loop-breathe-key 2.5s ease-in-out infinite; }
        
        @keyframes bio-loop-spin-slow-key {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .bio-loop-spin-slow { animation: bio-loop-spin-slow-key 12s linear infinite; }
        
        @keyframes bio-loop-shake-key {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-1px, -1px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(1deg); }
        }
        .bio-loop-shake { animation: bio-loop-shake-key 0.6s ease-in-out infinite; }
        
        @keyframes bio-loop-pulse-key {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.97); opacity: 0.85; }
        }
        .bio-loop-pulse { animation: bio-loop-pulse-key 2s ease-in-out infinite; }
        
        .bio-loop-glow-pulse {
          animation: bio-glow-pulse 2.5s ease-in-out infinite;
        }
        
        .bio-loop-glitch {
          animation: bio-glitch 2s ease-in-out infinite;
        }
        
        @keyframes bio-loop-swing-key {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(4deg); }
          75% { transform: rotate(-4deg); }
        }
        .bio-loop-swing { animation: bio-loop-swing-key 2s ease-in-out infinite; transform-origin: top center; }
        
        @keyframes bio-loop-shimmer-key {
          0% { filter: brightness(1) contrast(1); }
          50% { filter: brightness(1.25) contrast(1.15) saturate(1.1); }
          100% { filter: brightness(1) contrast(1); }
        }
        .bio-loop-shimmer { animation: bio-loop-shimmer-key 2s ease-in-out infinite; }

        /* CapCut Filters & Warp */
        .capcut-crt::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, transparent 65%, rgba(0, 0, 0, 0.45) 100%),
                      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05));
          background-size: 100% 100%, 100% 4px, 6px 100%;
          z-index: 99;
          pointer-events: none;
          opacity: 0.8;
        }

        @keyframes capcut-rgb-split-key {
          0%, 100% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; filter: hue-rotate(0deg); }
          50% { text-shadow: -2px 0 0 red, 2px 0 0 cyan; filter: hue-rotate(180deg); }
        }
        .capcut-rgb-split {
          animation: capcut-rgb-split-key 0.2s infinite;
        }

        @keyframes capcut-shake-key {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-3px, 2px) rotate(-1deg); }
          75% { transform: translate(3px, -2px) rotate(1deg); }
        }
        .capcut-shake {
          animation: capcut-shake-key 0.15s infinite;
        }

        @keyframes capcut-flash-key {
          0% { opacity: 0.4; background-color: #ffffff; }
          100% { opacity: 0; background-color: transparent; }
        }
        .capcut-flash-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 98;
          animation: capcut-flash-key 0.25s ease-out forwards;
        }

        /* Beat Hit pulse animation */
        @keyframes beat-hit-zoom {
          0% { transform: scale(1); }
          10% { transform: scale(1.05); filter: brightness(1.1); }
          100% { transform: scale(1); }
        }
        .beat-hit-card {
          animation: beat-hit-zoom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes beat-hit-glow-anim {
          0% { box-shadow: 0 0 10px rgba(255,255,255,0.05); }
          10% { box-shadow: 0 0 35px ${l.primaryColor}, inset 0 0 20px ${l.primaryColor}; }
          100% { box-shadow: 0 0 10px rgba(255,255,255,0.05); }
        }
        .beat-hit-border {
          animation: beat-hit-glow-anim 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* Animated Gradient running borders (Canva extension) */
        @keyframes running-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .border-running-gradient {
          background-size: 200% 200% !important;
          animation: running-gradient 4s ease infinite !important;
        }
        
        ${e.customCss}
      `}),(0,t.jsxs)("div",{className:`bio-page relative w-full h-full overflow-y-auto overflow-x-hidden ${L}`,style:{...N,...B,fontFamily:`'${l.fontFamily}', system-ui, sans-serif`,opacity:(e.bgOpacity??100)/100,transform:W?`scale(${1+(c.beatSyncStrength||30)/1e3})`:"scale(1)",transition:W?"transform 0.05s ease-out":"transform 0.3s ease-out"},children:[(e.bgBlur??0)>0&&(0,t.jsx)("div",{className:"absolute inset-0 pointer-events-none z-0",style:{backdropFilter:`blur(${e.bgBlur}px)`}}),"video"===l.bgType&&l.bgVideoUrl&&(0,t.jsx)("video",{src:l.bgVideoUrl,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"}),c.overlayEffect&&"none"!==c.overlayEffect&&(0,t.jsx)("div",{className:`bio-overlay bio-overlay-${c.overlayEffect}`}),e.backgroundOverlay?.enabled&&(0,t.jsx)("div",{className:"absolute inset-0 pointer-events-none z-[1]",style:{backgroundColor:e.backgroundOverlay.color,opacity:e.backgroundOverlay.opacity/100}}),"none"!==c.bgEffect&&(0,t.jsx)(z,{effect:c.bgEffect,color:c.bgEffectColor,intensity:c.bgEffectIntensity}),c.beatSync&&c.beatSyncFlash&&C&&(0,t.jsx)("div",{className:"capcut-flash-overlay"}),e.bannerUrl&&(0,t.jsxs)("div",{className:`w-full overflow-hidden ${G()}`,style:{...M(0,0),height:`${e.bannerHeight||200}px`,flexShrink:0,position:"relative",zIndex:5},children:[(0,t.jsx)("img",{src:e.bannerUrl,alt:"Banner",className:"w-full h-full object-cover",style:{borderRadius:"card"===e.layoutPreset?`${l.borderRadius}px ${l.borderRadius}px 0 0`:0,opacity:(e.bannerOpacity??100)/100,filter:(e.bannerBlur??0)>0?`blur(${e.bannerBlur}px)`:void 0}}),(0,t.jsx)("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)"}})]}),(0,t.jsxs)("div",{id:"bio-preview-container",className:`relative z-10 flex flex-col ${F()} my-8 mx-auto h-fit ${"animated"===e.borderStyle?"bio-animated-border":""} ${e.boxTilt&&"none"!==e.boxTilt?"bio-box-tilt":""} ${O?"beat-hit-card":""} ${U?"beat-hit-border":""} ${c.beatSync&&c.beatSyncShake&&C?"capcut-shake":""}`,style:D,children:[e.statusIndicator?.enabled&&(0,t.jsxs)("div",{className:`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${G()}`,style:{...M(0,0),backgroundColor:`${e.statusIndicator.color}15`,border:`1px solid ${e.statusIndicator.color}30`},children:[(0,t.jsx)("span",{className:"text-sm",children:e.statusIndicator.emoji}),(0,t.jsx)("span",{className:"text-[11px] font-medium",style:{color:e.statusIndicator.color},children:e.statusIndicator.text})]}),e.languageTag&&(0,t.jsx)("div",{className:`mb-3 px-2 py-0.5 rounded text-[8px] uppercase tracking-[0.3em] font-bold ${G()}`,style:{...M(0,0),backgroundColor:`${l.primaryColor}10`,border:`1px solid ${l.primaryColor}20`,color:l.primaryColor},children:e.languageTag}),(e.blocks||[]).map((a,f)=>{if(!a.enabled)return null;let x={color:a.customStyles?.color,backgroundColor:a.customStyles?.bgColor,borderColor:a.customStyles?.borderColor,borderRadius:a.customStyles?.borderRadius!==void 0?`${a.customStyles.borderRadius}px`:void 0,padding:a.customStyles?.padding!==void 0?`${a.customStyles.padding}px`:void 0,fontSize:a.customStyles?.fontSize!==void 0?`${a.customStyles.fontSize}px`:void 0,textAlign:a.customStyles?.textAlign||("left-aligned"===e.layoutPreset?"left":"center"),width:"100%",...M(f,a.delay)},g="none"!==a.animationIn?`bio-entrance-${a.animationIn}`:"",C="none"!==a.animationLoop?`bio-loop-${a.animationLoop}`:"",j="avatar"===a.type&&H;return(0,t.jsxs)("div",{className:`w-full flex flex-col ${F()} ${g} ${C} mb-6 last:mb-0 ${j?"beat-hit-card":""}`,style:x,children:["avatar"===a.type&&(0,t.jsxs)("div",{className:`${(e=>{switch(e){case"glow-pulse":return"bio-avatar-glow-pulse";case"rotate-border":return"bio-avatar-rotate-border";case"glitch":return"bio-avatar-glitch";case"breathe":return"bio-avatar-breathe";case"float":return"bio-avatar-float";case"spin-slow":return"bio-avatar-spin-slow";case"pulse-ring":return"bio-avatar-pulse-ring";case"shadow-dance":return"bio-avatar-shadow-dance";default:return""}})(c.avatarEffect)} relative`,children:[(0,t.jsx)("div",{className:"w-24 h-24 overflow-hidden flex items-center justify-center text-3xl font-bold",style:{...function(e){switch(e){case"rounded-square":return{borderRadius:"20%"};case"hexagon":return{clipPath:"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"};default:return{borderRadius:"50%"}}}(e.profileShape),borderRadius:"circle"===e.profileShape?`${e.avatarRadius??50}%`:"rounded-square"===e.profileShape?`${(e.avatarRadius??50)/4}px`:void 0,border:`2px solid ${l.primaryColor}60`,boxShadow:l.glowEnabled?`0 0 25px ${l.glowColor}44`:"none",backgroundColor:`${l.primaryColor}15`,color:l.primaryColor},children:e.avatarUrl?(0,t.jsx)("img",{src:e.avatarUrl,alt:"avatar",className:"w-full h-full object-cover"}):e.displayName?.[0]?.toUpperCase()||"?"}),e.avatarDecoration&&"none"!==e.avatarDecoration&&(0,t.jsx)("span",{className:"absolute -top-3 left-1/2 -translate-x-1/2 text-2xl pointer-events-none bio-avatar-deco",style:{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"},children:"cat-ears"===e.avatarDecoration?"🐱":"crown"===e.avatarDecoration?"👑":"horns"===e.avatarDecoration?"😈":"halo"===e.avatarDecoration?"😇":"🔥"})]}),"title"===a.type&&(0,t.jsx)("h1",{className:`text-2xl font-bold ${(e=>{switch(e){case"gradient":return"bio-text-gradient";case"glitch":return"bio-text-glitch";case"typewriter":return"bio-text-typewriter";case"neon-flicker":return"bio-text-neon";default:return""}})(c.textEffect)}`,style:{..."gradient"===c.textEffect?{}:"neon-flicker"===c.textEffect?{color:l.primaryColor}:{color:"white"}},children:e.displayName||"Username"}),"subtitle"===a.type&&(0,t.jsxs)("div",{className:"flex flex-col items-center",children:[(0,t.jsxs)("p",{className:`text-sm ${e.usernameSparkles&&"none"!==e.usernameSparkles?`bio-sparkle-${e.usernameSparkles}`:""}`,style:{color:`${l.primaryColor}aa`},children:["@",e.username||"username",e.pronouns&&(0,t.jsxs)("span",{className:"ml-2 opacity-50",children:["• ",e.pronouns]})]}),e.location&&(0,t.jsxs)("p",{className:"text-xs mt-1",style:{color:`${l.primaryColor}66`},children:["📍 ",e.location]})]}),"badges"===a.type&&e.badges.length>0&&(0,t.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-1.5`,children:e.badges.map((e,a)=>(0,t.jsxs)("span",{className:"px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5",style:{borderRadius:`${l.borderRadius/2}px`,backgroundColor:"VIP"===e?"rgba(255, 215, 0, 0.15)":`${l.primaryColor}15`,border:`1px solid ${"VIP"===e?"rgba(255, 215, 0, 0.4)":`${l.primaryColor}30`}`,color:"VIP"===e?"#5eead4":l.primaryColor,boxShadow:"VIP"===e?"0 0 10px rgba(255, 215, 0, 0.1)":"none"},children:["VIP"===e&&(0,t.jsx)("span",{className:"bio-diamond-spin",children:(0,t.jsx)(k.Diamond,{size:10,fill:"currentColor"})}),e]},a))}),"bio"===a.type&&(0,t.jsx)("p",{className:`${"left-aligned"===e.layoutPreset?"text-left":"text-center"} text-sm max-w-[280px] ${e.typingBio?"bio-text-typewriter":""}`,style:{color:"rgba(255,255,255,0.5)",lineHeight:"1.6"},children:e.bio||"Your bio goes here..."}),"stats"===a.type&&(u.showViews||u.showJoinDate||u.customStats.length>0)&&(0,t.jsxs)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-6`,children:[u.showViews&&(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)(o.Eye,{size:13,style:{color:l.primaryColor}}),(0,t.jsx)("span",{className:"text-xs font-semibold text-white/70",children:void 0!==s?s.toLocaleString():"0"}),(0,t.jsx)("span",{className:"text-[9px] uppercase tracking-wider text-white/30",children:"views"})]}),u.showJoinDate&&(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)(i.Calendar,{size:13,style:{color:l.primaryColor}}),(0,t.jsx)("span",{className:"text-xs font-semibold text-white/70",children:"Mar 2026"})]}),u.customStats.filter(e=>e.label&&e.value).map((e,a)=>(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"text-sm font-bold text-white/80",children:e.value}),(0,t.jsx)("div",{className:"text-[9px] uppercase tracking-wider text-white/30",children:e.label})]},a))]}),"socials"===a.type&&d.filter(e=>e.url).length>0&&(0,t.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===e.layoutPreset?"justify-start":"justify-center"} gap-3`,children:d.filter(e=>e.url).map((e,a)=>(0,t.jsx)("a",{href:e.url,target:"_blank",rel:"noopener noreferrer",className:"w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",style:{backgroundColor:`${l.primaryColor}10`,border:`1px solid ${l.primaryColor}25`,color:l.primaryColor},children:(0,t.jsx)(v,{platform:e.platform,size:16})},a))}),"links"===a.type&&m.filter(e=>e.enabled&&e.title).length>0&&(0,t.jsx)("div",{className:"w-full space-y-3",children:m.filter(e=>e.enabled&&e.title).map((e,a)=>(0,t.jsxs)("a",{href:e.url||"#",target:"_blank",rel:"noopener noreferrer",className:"bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group",style:{borderRadius:`${l.borderRadius}px`,backgroundColor:"glass"===l.cardStyle?"rgba(255,255,255,0.04)":"solid"===l.cardStyle?"rgba(255,255,255,0.06)":"transparent",border:"neon"===l.cardStyle?`1px solid ${l.primaryColor}40`:"outline"===l.cardStyle?"2px solid rgba(255,255,255,0.12)":"1px solid rgba(255,255,255,0.08)",backdropFilter:"glass"===l.cardStyle?"blur(12px)":"none",boxShadow:"neon"===l.cardStyle?`0 0 15px ${l.primaryColor}15`:"none"},children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center",style:{backgroundColor:`${l.primaryColor}15`,color:l.primaryColor},children:(0,t.jsx)(h.Link2,{size:14})}),(0,t.jsx)("span",{className:"text-sm font-medium text-white/80 group-hover:text-white transition-colors",children:e.title})]}),(0,t.jsx)(r.ExternalLink,{size:14,className:"text-white/20 group-hover:text-white/50 transition-colors"})]},a))}),"timeline"===a.type&&e.timeline?.enabled&&(e.timeline.items||[]).filter(e=>e.title).length>0&&(0,t.jsxs)("div",{className:"w-full",children:[(0,t.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${l.primaryColor}80`},children:"Timeline"}),(0,t.jsxs)("div",{className:"relative pl-6 text-left",children:[(0,t.jsx)("div",{className:"absolute left-2 top-0 bottom-0 w-px",style:{backgroundColor:`${l.primaryColor}20`}}),(e.timeline.items||[]).filter(e=>e.title).map((e,a)=>(0,t.jsxs)("div",{className:"relative mb-6 last:mb-0",children:[(0,t.jsx)("div",{className:"absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2",style:{borderColor:l.primaryColor,backgroundColor:`${l.primaryColor}30`}}),e.date&&(0,t.jsxs)("div",{className:"flex items-center gap-1.5 mb-1",children:[(0,t.jsx)(y.Clock,{size:10,style:{color:`${l.primaryColor}60`}}),(0,t.jsx)("span",{className:"text-[10px] font-mono",style:{color:`${l.primaryColor}60`},children:e.date})]}),(0,t.jsx)("h4",{className:"text-sm font-semibold text-white/80",children:e.title}),e.description&&(0,t.jsx)("p",{className:"text-xs text-white/40 mt-0.5",children:e.description})]},a))]})]}),"gallery"===a.type&&e.imageGallery?.enabled&&(e.imageGallery.images||[]).filter(e=>e.url).length>0&&(0,t.jsxs)("div",{className:"w-full",children:[(0,t.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${l.primaryColor}80`},children:"Gallery"}),(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:(e.imageGallery.images||[]).filter(e=>e.url).map((e,a)=>(0,t.jsxs)("div",{className:"relative group rounded-xl overflow-hidden aspect-square",children:[(0,t.jsx)("img",{src:e.url,alt:e.caption||"",className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}),e.caption&&(0,t.jsx)("div",{className:"absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",children:(0,t.jsx)("span",{className:"text-[10px] text-white/80",children:e.caption})})]},a))})]}),"video"===a.type&&e.embedVideo?.enabled&&e.embedVideo.url&&(0,t.jsx)("div",{className:"w-full",children:(0,t.jsx)("div",{className:"w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06]",children:(0,t.jsx)("iframe",{src:e.embedVideo.url.replace("watch?v=","embed/").split("&")[0],className:"w-full h-full",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})})}),"music"===a.type&&b.enabled&&b.url&&(0,t.jsxs)("div",{className:"w-full",children:["spotify"===b.type&&E(b.url)&&(0,t.jsx)("iframe",{src:E(b.url,0)||"",width:"100%",height:"152",frameBorder:"0",allow:"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",loading:"lazy",className:"rounded-xl opacity-90 transition-all hover:opacity-100"}),"custom"===b.type&&(0,t.jsxs)("div",{className:"flex items-center gap-3 p-4",style:{borderRadius:`${l.borderRadius}px`,backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[(0,t.jsx)("button",{onClick:()=>{let e=S.current;e&&(w?(e.pause(),$(!1)):(e.play().catch(e=>console.log(e)),$(!0)))},className:"w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-white/5 hover:bg-white/10",style:{color:l.primaryColor},children:w?(0,t.jsxs)("span",{className:"flex gap-0.5 items-end justify-center h-4 pb-0.5",children:[(0,t.jsx)("span",{className:"w-0.5 h-2.5 bg-current animate-[pulse_0.8s_infinite] rounded-full"}),(0,t.jsx)("span",{className:"w-0.5 h-4 bg-current animate-[pulse_0.5s_infinite] rounded-full"}),(0,t.jsx)("span",{className:"w-0.5 h-3 bg-current animate-[pulse_1.2s_infinite] rounded-full"})]}):(0,t.jsx)(p.Music,{size:16})}),(0,t.jsxs)("div",{className:"flex-1 text-left truncate",children:[(0,t.jsx)("span",{className:"text-[9px] text-white/40 block uppercase tracking-wider font-bold",children:"Custom Soundtrack"}),(0,t.jsx)("span",{className:"text-xs text-white/80 font-medium truncate block max-w-[180px]",children:b.url.split("/").pop()||"soundtrack.mp3"})]})]})]}),"discord"===a.type&&e.discordWidget?.enabled&&e.discordWidget.userId&&(0,t.jsxs)("div",{className:"w-full flex items-center gap-3 p-4 rounded-xl text-left",style:{backgroundColor:"rgba(88, 101, 242, 0.08)",border:"1px solid rgba(88, 101, 242, 0.15)"},children:[(0,t.jsx)(n.MessageCircle,{size:16,style:{color:"#5865F2"}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-[10px] uppercase tracking-wider font-bold text-[#5865F2]/80",children:"Discord"}),(0,t.jsx)("div",{className:"text-xs text-white/60 font-mono",children:e.discordWidget.userId})]})]})]},a.id)}),(0,t.jsx)("div",{className:`mt-auto pt-8 text-center ${G()}`,style:M(14),children:(0,t.jsx)("p",{className:"text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold",children:"Powered by Sagitarius.cc"})})]}),b.enabled&&b.url&&"custom"===b.type&&(0,t.jsx)("audio",{ref:S,src:b.url,loop:!0,preload:"auto",crossOrigin:"anonymous",style:{display:"none"}}),e.revealScreen?.enabled&&!x&&(0,t.jsx)("div",{className:"absolute inset-0 z-50 flex items-center justify-center cursor-pointer",style:{backdropFilter:`blur(${e.revealScreen.blur||15}px)`,backgroundColor:"rgba(0,0,0,0.5)"},onClick:()=>{g(!0);let e=S.current;e&&b.autoplay&&e.play().then(()=>$(!0)).catch(e=>console.log("Interactive play blocked:",e))},children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("p",{className:"text-xl font-bold text-white mb-2 animate-bounce",style:{textShadow:`0 0 20px ${l.primaryColor}`},children:e.revealScreen.text||"Click to enter"}),(0,t.jsx)("p",{className:"text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse",children:"Click anywhere"})]})})]})]})}e.s(["default",()=>A])}]);