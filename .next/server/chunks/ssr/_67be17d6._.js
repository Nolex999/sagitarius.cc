module.exports=[5112,69472,72919,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);a.s(["Github",()=>c],5112);let d=(0,b.default)("youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]);a.s(["Youtube",()=>d],69472);let e=(0,b.default)("twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);a.s(["Twitch",()=>e],72919)},16686,a=>{"use strict";let b=(0,a.i(70106).default)("music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);a.s(["Music",()=>b],16686)},39646,13513,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("gamepad-2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);a.s(["Gamepad2",()=>c],39646);let d=(0,b.default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);a.s(["Camera",()=>d],13513)},64791,a=>{"use strict";let b=(0,a.i(70106).default)("video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);a.s(["Video",()=>b],64791)},69922,a=>{"use strict";let b=(0,a.i(70106).default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);a.s(["Link2",()=>b],69922)},1261,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(52495),e=a.i(77156),f=a.i(41675),g=a.i(45222),h=a.i(92759),i=a.i(5112),j=a.i(69472),k=a.i(72919),l=a.i(16686),m=a.i(39646),n=a.i(13513),o=a.i(64791),p=a.i(92258),q=a.i(44494),r=a.i(69922),s=a.i(2835),t=a.i(41710),u=a.i(67304);function v({platform:a,size:c=16}){let d={discord:g.MessageCircle,telegram:h.Send,twitter:s.Hash,github:i.Github,youtube:j.Youtube,twitch:k.Twitch,spotify:l.Music,steam:m.Gamepad2,instagram:n.Camera,tiktok:o.Video,snapchat:w,reddit:q.Globe,soundcloud:l.Music,kick:o.Video,email:p.Mail}[a]||q.Globe;return(0,b.jsx)(d,{size:c})}function w(a){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...a,width:a.size,height:a.size,children:(0,b.jsx)("path",{d:"M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"})})}let x=(0,c.memo)(function({color:a,intensity:d}){let e=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let b,c=e.current;if(!c)return;let f=c.getContext("2d");if(!f)return;let g=0,h=Math.min(Math.floor(d/100*40)+8,40),i=()=>{c.width=c.offsetWidth,c.height=c.offsetHeight};i(),window.addEventListener("resize",i);let j=Array.from({length:h},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,size:2*Math.random()+.5,opacity:.5*Math.random()+.1})),k=d=>{if(d-g<33.333333333333336){b=requestAnimationFrame(k);return}g=d,f.clearRect(0,0,c.width,c.height),j.forEach(b=>{b.x+=b.vx,b.y+=b.vy,(b.x<0||b.x>c.width)&&(b.vx*=-1),(b.y<0||b.y>c.height)&&(b.vy*=-1),f.beginPath(),f.arc(b.x,b.y,b.size,0,2*Math.PI),f.fillStyle=a+Math.floor(255*b.opacity).toString(16).padStart(2,"0"),f.fill()});for(let b=0;b<j.length;b++)for(let c=b+1;c<j.length;c++){let d=j[b].x-j[c].x,e=j[b].y-j[c].y,g=d*d+e*e;g<6400&&(f.beginPath(),f.moveTo(j[b].x,j[b].y),f.lineTo(j[c].x,j[c].y),f.strokeStyle=a+Math.floor((1-Math.sqrt(g)/80)*30).toString(16).padStart(2,"0"),f.lineWidth=.5,f.stroke())}b=requestAnimationFrame(k)};return b=requestAnimationFrame(k),()=>{cancelAnimationFrame(b),window.removeEventListener("resize",i)}},[a,d]),(0,b.jsx)("canvas",{ref:e,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),y=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*40)+8,f=(0,c.useMemo)(()=>Array.from({length:e},(a,b)=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,width:`${3*Math.random()+1}px`,height:`${3*Math.random()+1}px`,duration:`${3*Math.random()+2}s`,delay:`${5*Math.random()}s`,opacity:.7*Math.random()+.1})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:c.top,width:c.width,height:c.height,backgroundColor:a,opacity:c.opacity,animation:`bio-twinkle ${c.duration} ease-in-out infinite`,animationDelay:c.delay}},d))})}),z=(0,c.memo)(function({color:a,intensity:d}){let e=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let b,c=e.current;if(!c)return;let f=c.getContext("2d");if(!f)return;let g=0;c.width=c.offsetWidth,c.height=c.offsetHeight;let h=Array(Math.floor(c.width/12)).fill(1),i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*",j=e=>{if(e-g<50){b=requestAnimationFrame(j);return}g=e,f.fillStyle="rgba(0, 0, 0, 0.05)",f.fillRect(0,0,c.width,c.height),f.fillStyle=a,f.font="12px monospace",f.globalAlpha=d/100*.5;for(let a=0;a<h.length;a++){let b=i[Math.floor(Math.random()*i.length)];f.fillText(b,12*a,12*h[a]),12*h[a]>c.height&&Math.random()>.975&&(h[a]=0),h[a]++}f.globalAlpha=1,b=requestAnimationFrame(j)};return b=requestAnimationFrame(j),()=>cancelAnimationFrame(b)},[a,d]),(0,b.jsx)("canvas",{ref:e,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),A=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*30)+8,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,size:`${4*Math.random()+2}px`,opacity:.6*Math.random()+.2,duration:`${5*Math.random()+5}s`,delay:`${10*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:"-5%",width:c.size,height:c.size,backgroundColor:a,opacity:c.opacity,animation:`bio-snowfall ${c.duration} linear infinite`,animationDelay:c.delay}},d))})}),B=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*40)+10,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,height:`${20*Math.random()+10}px`,opacity:.4*Math.random()+.1,duration:`${+Math.random()+.5}s`,delay:`${3*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute",style:{left:c.left,top:"-5%",width:"1px",height:c.height,backgroundColor:a,opacity:c.opacity,animation:`bio-rainfall ${c.duration} linear infinite`,animationDelay:c.delay}},d))})}),C=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*15)+4,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,size:`${5*Math.random()+3}px`,shadow1:`${10*Math.random()+5}px`,shadow2:`${20*Math.random()+10}px`,duration:`${4*Math.random()+3}s`,delay:`${5*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:c.top,width:c.size,height:c.size,backgroundColor:a,boxShadow:`0 0 ${c.shadow1} ${a}, 0 0 ${c.shadow2} ${a}`,opacity:0,animation:`bio-firefly ${c.duration} ease-in-out infinite`,animationDelay:c.delay}},d))})});function D({effect:a,color:c,intensity:d}){switch(a){case"particles":return(0,b.jsx)(x,{color:c,intensity:d});case"stars":return(0,b.jsx)(y,{color:c,intensity:d});case"matrix":return(0,b.jsx)(z,{color:c,intensity:d});case"snow":return(0,b.jsx)(A,{color:c,intensity:d});case"rain":return(0,b.jsx)(B,{color:c,intensity:d});case"fireflies":return(0,b.jsx)(C,{color:c,intensity:d});default:return null}}function E(a,b=0){if(!a||"string"!=typeof a)return null;let c=a.match(/(track|album|playlist|artist|episode|show)[\/:]([a-zA-Z0-9]+)/);return c&&c[1]&&c[2]?`https://open.spotify.com/embed/${c[1]}/${c[2]}?utm_source=generator&theme=${b}`:null}function F({config:a,realViews:h}){let{theme:i,effects:j,socials:k,customLinks:m,music:n,stats:o}=a,p=`https://fonts.googleapis.com/css2?family=${i.fontFamily.replace(/ /g,"+")}:wght@300;400;500;600;700;900&display=swap`,[q,s]=(0,c.useState)(!1),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)(!1),A=(0,c.useRef)(null);(0,c.useEffect)(()=>{s(!a.revealScreen?.enabled)},[a.revealScreen?.enabled]),(0,c.useEffect)(()=>{n.enabled&&n.url&&"custom"===n.type&&q?n.autoplay&&A.current?.play().then(()=>x(!0)).catch(a=>console.log("Audio play blocked:",a)):(A.current?.pause(),x(!1))},[n.enabled,n.url,n.type,q,n.autoplay]),(0,c.useEffect)(()=>{if(!j.beatSync||!q)return void z(!1);let a=j.beatSyncBpm||120,b=()=>{z(!0),setTimeout(()=>z(!1),150)};b();let c=setInterval(b,60/a*1e3);return()=>clearInterval(c)},[j.beatSync,[j.beatSyncBpm],q]),(0,c.useEffect)(()=>{let a;if(!j.beatSync||"custom"!==n.type||!n.enabled||!n.url||!q||!w)return;let b=A.current;if(!b)return;let c=null;try{let d=(c=new(window.AudioContext||window.webkitAudioContext)).createAnalyser();c.createMediaElementSource(b).connect(d),d.connect(c.destination),d.fftSize=64;let e=d.frequencyBinCount,f=new Uint8Array(e),g=()=>{d.getByteFrequencyData(f);let b=0;for(let a=0;a<4;a++)b+=f[a];b/4>160&&(z(!0),setTimeout(()=>z(!1),120)),a=requestAnimationFrame(g)};a=requestAnimationFrame(g)}catch(a){}return()=>{a&&cancelAnimationFrame(a),c&&c.close()}},[j.beatSync,n.type,n.enabled,n.url,q,w]);let B={};if("solid"===i.bgType)B.backgroundColor=i.bgColor1;else if("gradient"===i.bgType)B.background=`linear-gradient(${i.gradientAngle||135}deg, ${i.bgColor1} 0%, ${i.bgColor2} 100%)`;else if("image"===i.bgType)B.backgroundImage=`url(${i.bgImageUrl})`,B.backgroundSize="cover",B.backgroundPosition="center";else if("pattern"===i.bgType)switch(B.backgroundColor=i.bgColor1,i.bgPattern){case"dots":default:B.backgroundImage=`radial-gradient(${i.bgColor2} 2px, transparent 2px)`,B.backgroundSize="30px 30px";break;case"grid":B.backgroundImage=`linear-gradient(${i.bgColor2} 1px, transparent 1px), linear-gradient(90deg, ${i.bgColor2} 1px, transparent 1px)`,B.backgroundSize="30px 30px";break;case"waves":B.backgroundImage=`repeating-radial-gradient(circle at 0 0, transparent 0, ${i.bgColor2} 2px, transparent 2px, transparent 20px)`;break;case"diagonal":B.backgroundImage=`repeating-linear-gradient(45deg, ${i.bgColor2} 0, ${i.bgColor2} 2px, transparent 0, transparent 50%)`,B.backgroundSize="20px 20px"}let C=(b,c)=>{let d=void 0!==c?c:b*(a.entranceSpeed??200);return{animationDelay:`${d}ms`,animationFillMode:"both",animationDuration:`${(a.entranceSpeed??200)*2}ms`}},F=i.glowEnabled?`0 0 ${i.glowIntensity}px ${i.glowColor}44, 0 0 ${2*i.glowIntensity}px ${i.glowColor}22`:"none",G=()=>"left-aligned"===a.layoutPreset?"items-start text-left":"items-center",H=()=>{let b=a.borderWidth??1,c=a.borderColor||"#ffffff",d=(a.borderOpacity??10)/100,e=`${c}${Math.round(255*d).toString(16).padStart(2,"0")}`;switch(a.borderStyle){case"solid":return{border:`${b}px solid ${e}`};case"dashed":return{border:`${b}px dashed ${e}`};case"gradient":return{border:`${b}px solid transparent`,backgroundClip:"padding-box, border-box",backgroundImage:`linear-gradient(${a.glassmorphism?.enabled?`rgba(255,255,255,${a.glassmorphism.opacity/100})`:i.bgColor1}, ${a.glassmorphism?.enabled?`rgba(255,255,255,${a.glassmorphism.opacity/100})`:i.bgColor1}), linear-gradient(135deg, ${i.primaryColor}, ${i.secondaryColor})`};default:return a.glassmorphism?.enabled&&"animated"!==a.borderStyle?{border:`${b}px solid rgba(255,255,255,0.08)`}:{border:"none"}}},I=a.boxWidth??500,J=a.boxSpacing??40,K=a.boxColor||"#000000",L=(a.boxOpacity??30)/100,M=a.boxBlur??12,N=a.boxShadowColor||"#000000",O=(a.boxShadowOpacity??50)/100,P=a.glassmorphism?.enabled?{backdropFilter:`blur(${a.glassmorphism.blur}px)`,WebkitBackdropFilter:`blur(${a.glassmorphism.blur}px)`,backgroundColor:`rgba(255,255,255,${a.glassmorphism.opacity/100})`,borderRadius:`${i.borderRadius}px`,padding:`${J}px`,maxWidth:`${I}px`,width:"100%",boxShadow:`0 8px 32px ${N}${Math.round(255*O).toString(16).padStart(2,"0")}`,...H()}:{...H(),borderRadius:`${i.borderRadius}px`,padding:`${J}px`,maxWidth:`${I}px`,width:"100%",backgroundColor:`${K}${Math.round(255*L).toString(16).padStart(2,"0")}`,backdropFilter:M>0?`blur(${M}px)`:void 0,boxShadow:`0 8px 32px ${N}${Math.round(255*O).toString(16).padStart(2,"0")}`},Q="default"!==j.customCursor?{cursor:j.customCursor}:{},R=j.capcutFilter&&"none"!==j.capcutFilter?`capcut-${j.capcutFilter}`:"",S=j.beatSync&&("card"===j.beatSyncElement||"all"===j.beatSyncElement)&&y,T=j.beatSync&&("border"===j.beatSyncElement||Math.round(j.beatSyncStrength||0)>0)&&y,U=j.beatSync&&("background"===j.beatSyncElement||"all"===j.beatSyncElement)&&y,V=j.beatSync&&("avatar"===j.beatSyncElement||"all"===j.beatSyncElement)&&y,W=()=>{let a=j.entranceAnimation;return"none"===a?"":`bio-entrance-${a}`};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @import url('${p}');
        
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
          0%, 100% { box-shadow: 0 0 20px ${i.primaryColor}44, 0 0 40px ${i.primaryColor}22; }
          50% { box-shadow: 0 0 30px ${i.primaryColor}66, 0 0 60px ${i.primaryColor}33; }
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
            text-shadow: 0 0 7px ${i.primaryColor}, 0 0 10px ${i.primaryColor}, 0 0 21px ${i.primaryColor};
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
          0%, 100% { border-color: ${i.primaryColor}40; }
          50% { border-color: ${i.primaryColor}80; }
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
          background: conic-gradient(from var(--angle, 0deg), ${i.primaryColor}, ${i.secondaryColor}, ${i.accentColor}, ${i.primaryColor});
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
          background: linear-gradient(90deg, ${i.primaryColor}, ${i.secondaryColor}, ${i.accentColor}, ${i.primaryColor});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bio-text-gradient 4s ease infinite;
        }
        
        .bio-text-glitch { animation: bio-glitch 2s ease-in-out infinite; }
        .bio-text-neon { animation: bio-neon-flicker 3s ease-in-out infinite; color: ${i.primaryColor}; }
        
        .bio-text-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: bio-typewriter 2s steps(30) forwards;
          border-right: 2px solid ${i.primaryColor};
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
          0% { box-shadow: 0 0 0 0 ${i.primaryColor}66; }
          70% { box-shadow: 0 0 0 12px ${i.primaryColor}00; }
          100% { box-shadow: 0 0 0 0 ${i.primaryColor}00; }
        }
        @keyframes bio-shadow-dance {
          0%, 100% { box-shadow: 5px 5px 20px ${i.primaryColor}44; }
          25% { box-shadow: -5px 5px 20px ${i.secondaryColor}44; }
          50% { box-shadow: -5px -5px 20px ${i.accentColor}44; }
          75% { box-shadow: 5px -5px 20px ${i.primaryColor}44; }
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
          border-radius: ${i.borderRadius+2}px;
          background: conic-gradient(from var(--angle, 0deg), ${i.primaryColor}, ${i.secondaryColor}, ${i.accentColor}, ${i.primaryColor});
          animation: bio-rotate-border 3s linear infinite;
          z-index: -1;
        }
        
        /* HOVER EFFECTS */
        ${"lift"===(j.hoverEffect||"lift")?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3), ${"none"!==F?`0 0 20px ${i.primaryColor}33`:"0 0 0 transparent"}; }
        `:""}
        ${"glow"===j.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid transparent; }
          .bio-link-hover:hover { box-shadow: 0 0 20px ${i.primaryColor}80; border-color: ${i.primaryColor}60; transform: translateY(-1px); }
        `:""}
        ${"scale"===j.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: scale(1.03); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        `:""}
        ${"neon"===j.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
          .bio-link-hover:hover { 
            box-shadow: 0 0 10px ${i.primaryColor}, inset 0 0 10px ${i.primaryColor}; 
            border-color: ${i.primaryColor}; 
            color: ${i.primaryColor};
            background-color: ${i.primaryColor}10;
          }
        `:""}
        ${"shake"===j.hoverEffect?`
          @keyframes hover-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-1deg); }
            75% { transform: translateX(3px) rotate(1deg); }
          }
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { animation: hover-shake 0.3s ease-in-out infinite; }
        `:""}
        ${"underline-slide"===j.hoverEffect?`
          .bio-link-hover { position: relative; transition: all 0.2s ease; overflow: hidden; }
          .bio-link-hover::after { content: ''; position: absolute; bottom: 0; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, ${i.primaryColor}, ${i.secondaryColor}); transition: left 0.3s ease; }
          .bio-link-hover:hover::after { left: 0; }
          .bio-link-hover:hover { transform: translateY(-1px); }
        `:""}
        ${"border-glow"===j.hoverEffect?`
          .bio-link-hover { transition: all 0.3s ease; border: 1px solid transparent !important; }
          .bio-link-hover:hover { border-color: ${i.primaryColor} !important; box-shadow: 0 0 15px ${i.primaryColor}40, inset 0 0 15px ${i.primaryColor}10; transform: translateY(-1px); }
        `:""}
        ${"tilt-3d"===j.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; transform-style: preserve-3d; perspective: 600px; }
          .bio-link-hover:hover { transform: perspective(600px) rotateX(-5deg) rotateY(3deg) translateY(-3px); box-shadow: 5px 10px 20px rgba(0,0,0,0.3); }
        `:""}
        ${"haul"===j.hoverEffect?`
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
            border-color: ${i.primaryColor}80 !important;
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
          1% { background-color: ${i.primaryColor}20; mix-blend-mode: color-dodge; }
          2% { background-color: transparent; }
          15% { background-color: transparent; }
          16% { background-color: ${i.accentColor}20; transform: translateX(2px); }
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
        ${"scale"===a.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: scale(1.02); }":""}
        ${"reverse-scale"===a.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: scale(0.98); }":""}
        ${"tilt-x"===a.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: perspective(800px) rotateX(-3deg); }":""}
        ${"tilt-y"===a.boxTilt?".bio-box-tilt { transition: transform 0.3s ease; } .bio-box-tilt:hover { transform: perspective(800px) rotateY(3deg); }":""}
 
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
          10% { box-shadow: 0 0 35px ${i.primaryColor}, inset 0 0 20px ${i.primaryColor}; }
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
        
        ${a.customCss}
      `}),(0,b.jsxs)("div",{className:`bio-page relative w-full h-full overflow-y-auto overflow-x-hidden ${R}`,style:{...B,...Q,fontFamily:`'${i.fontFamily}', system-ui, sans-serif`,opacity:(a.bgOpacity??100)/100,transform:U?`scale(${1+(j.beatSyncStrength||30)/1e3})`:"scale(1)",transition:U?"transform 0.05s ease-out":"transform 0.3s ease-out"},children:[(a.bgBlur??0)>0&&(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none z-0",style:{backdropFilter:`blur(${a.bgBlur}px)`}}),"video"===i.bgType&&i.bgVideoUrl&&(0,b.jsx)("video",{src:i.bgVideoUrl,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"}),j.overlayEffect&&"none"!==j.overlayEffect&&(0,b.jsx)("div",{className:`bio-overlay bio-overlay-${j.overlayEffect}`}),a.backgroundOverlay?.enabled&&(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none z-[1]",style:{backgroundColor:a.backgroundOverlay.color,opacity:a.backgroundOverlay.opacity/100}}),"none"!==j.bgEffect&&(0,b.jsx)(D,{effect:j.bgEffect,color:j.bgEffectColor,intensity:j.bgEffectIntensity}),j.beatSync&&j.beatSyncFlash&&y&&(0,b.jsx)("div",{className:"capcut-flash-overlay"}),a.bannerUrl&&(0,b.jsxs)("div",{className:`w-full overflow-hidden ${W()}`,style:{...C(0,0),height:`${a.bannerHeight||200}px`,flexShrink:0,position:"relative",zIndex:5},children:[(0,b.jsx)("img",{src:a.bannerUrl,alt:"Banner",className:"w-full h-full object-cover",style:{borderRadius:"card"===a.layoutPreset?`${i.borderRadius}px ${i.borderRadius}px 0 0`:0,opacity:(a.bannerOpacity??100)/100,filter:(a.bannerBlur??0)>0?`blur(${a.bannerBlur}px)`:void 0}}),(0,b.jsx)("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)"}})]}),(0,b.jsxs)("div",{id:"bio-preview-container",className:`relative z-10 flex flex-col ${G()} my-8 mx-auto h-fit ${"animated"===a.borderStyle?"bio-animated-border":""} ${a.boxTilt&&"none"!==a.boxTilt?"bio-box-tilt":""} ${S?"beat-hit-card":""} ${T?"beat-hit-border":""} ${j.beatSync&&j.beatSyncShake&&y?"capcut-shake":""}`,style:P,children:[a.statusIndicator?.enabled&&(0,b.jsxs)("div",{className:`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${W()}`,style:{...C(0,0),backgroundColor:`${a.statusIndicator.color}15`,border:`1px solid ${a.statusIndicator.color}30`},children:[(0,b.jsx)("span",{className:"text-sm",children:a.statusIndicator.emoji}),(0,b.jsx)("span",{className:"text-[11px] font-medium",style:{color:a.statusIndicator.color},children:a.statusIndicator.text})]}),a.languageTag&&(0,b.jsx)("div",{className:`mb-3 px-2 py-0.5 rounded text-[8px] uppercase tracking-[0.3em] font-bold ${W()}`,style:{...C(0,0),backgroundColor:`${i.primaryColor}10`,border:`1px solid ${i.primaryColor}20`,color:i.primaryColor},children:a.languageTag}),(a.blocks||[]).map((c,p)=>{if(!c.enabled)return null;let q={color:c.customStyles?.color,backgroundColor:c.customStyles?.bgColor,borderColor:c.customStyles?.borderColor,borderRadius:c.customStyles?.borderRadius!==void 0?`${c.customStyles.borderRadius}px`:void 0,padding:c.customStyles?.padding!==void 0?`${c.customStyles.padding}px`:void 0,fontSize:c.customStyles?.fontSize!==void 0?`${c.customStyles.fontSize}px`:void 0,textAlign:c.customStyles?.textAlign||("left-aligned"===a.layoutPreset?"left":"center"),width:"100%",...C(p,c.delay)},s="none"!==c.animationIn?`bio-entrance-${c.animationIn}`:"",y="none"!==c.animationLoop?`bio-loop-${c.animationLoop}`:"",z="avatar"===c.type&&V;return(0,b.jsxs)("div",{className:`w-full flex flex-col ${G()} ${s} ${y} mb-6 last:mb-0 ${z?"beat-hit-card":""}`,style:q,children:["avatar"===c.type&&(0,b.jsxs)("div",{className:`${(a=>{switch(a){case"glow-pulse":return"bio-avatar-glow-pulse";case"rotate-border":return"bio-avatar-rotate-border";case"glitch":return"bio-avatar-glitch";case"breathe":return"bio-avatar-breathe";case"float":return"bio-avatar-float";case"spin-slow":return"bio-avatar-spin-slow";case"pulse-ring":return"bio-avatar-pulse-ring";case"shadow-dance":return"bio-avatar-shadow-dance";default:return""}})(j.avatarEffect)} relative`,children:[(0,b.jsx)("div",{className:"w-24 h-24 overflow-hidden flex items-center justify-center text-3xl font-bold",style:{...function(a){switch(a){case"rounded-square":return{borderRadius:"20%"};case"hexagon":return{clipPath:"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"};default:return{borderRadius:"50%"}}}(a.profileShape),borderRadius:"circle"===a.profileShape?`${a.avatarRadius??50}%`:"rounded-square"===a.profileShape?`${(a.avatarRadius??50)/4}px`:void 0,border:`2px solid ${i.primaryColor}60`,boxShadow:i.glowEnabled?`0 0 25px ${i.glowColor}44`:"none",backgroundColor:`${i.primaryColor}15`,color:i.primaryColor},children:a.avatarUrl?(0,b.jsx)("img",{src:a.avatarUrl,alt:"avatar",className:"w-full h-full object-cover"}):a.displayName?.[0]?.toUpperCase()||"?"}),a.avatarDecoration&&"none"!==a.avatarDecoration&&(0,b.jsx)("span",{className:"absolute -top-3 left-1/2 -translate-x-1/2 text-2xl pointer-events-none bio-avatar-deco",style:{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"},children:"cat-ears"===a.avatarDecoration?"🐱":"crown"===a.avatarDecoration?"👑":"horns"===a.avatarDecoration?"😈":"halo"===a.avatarDecoration?"😇":"🔥"})]}),"title"===c.type&&(0,b.jsx)("h1",{className:`text-2xl font-bold ${(a=>{switch(a){case"gradient":return"bio-text-gradient";case"glitch":return"bio-text-glitch";case"typewriter":return"bio-text-typewriter";case"neon-flicker":return"bio-text-neon";default:return""}})(j.textEffect)}`,style:{..."gradient"===j.textEffect?{}:"neon-flicker"===j.textEffect?{color:i.primaryColor}:{color:"white"}},children:a.displayName||"Username"}),"subtitle"===c.type&&(0,b.jsxs)("div",{className:"flex flex-col items-center",children:[(0,b.jsxs)("p",{className:`text-sm ${a.usernameSparkles&&"none"!==a.usernameSparkles?`bio-sparkle-${a.usernameSparkles}`:""}`,style:{color:`${i.primaryColor}aa`},children:["@",a.username||"username",a.pronouns&&(0,b.jsxs)("span",{className:"ml-2 opacity-50",children:["• ",a.pronouns]})]}),a.location&&(0,b.jsxs)("p",{className:"text-xs mt-1",style:{color:`${i.primaryColor}66`},children:["📍 ",a.location]})]}),"badges"===c.type&&a.badges.length>0&&(0,b.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-1.5`,children:a.badges.map((a,c)=>(0,b.jsxs)("span",{className:"px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5",style:{borderRadius:`${i.borderRadius/2}px`,backgroundColor:"VIP"===a?"rgba(255, 215, 0, 0.15)":`${i.primaryColor}15`,border:`1px solid ${"VIP"===a?"rgba(255, 215, 0, 0.4)":`${i.primaryColor}30`}`,color:"VIP"===a?"#ffd700":i.primaryColor,boxShadow:"VIP"===a?"0 0 10px rgba(255, 215, 0, 0.1)":"none"},children:["VIP"===a&&(0,b.jsx)("span",{className:"bio-diamond-spin",children:(0,b.jsx)(u.Diamond,{size:10,fill:"currentColor"})}),a]},c))}),"bio"===c.type&&(0,b.jsx)("p",{className:`${"left-aligned"===a.layoutPreset?"text-left":"text-center"} text-sm max-w-[280px] ${a.typingBio?"bio-text-typewriter":""}`,style:{color:"rgba(255,255,255,0.5)",lineHeight:"1.6"},children:a.bio||"Your bio goes here..."}),"stats"===c.type&&(o.showViews||o.showJoinDate||o.customStats.length>0)&&(0,b.jsxs)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-6`,children:[o.showViews&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,b.jsx)(e.Eye,{size:13,style:{color:i.primaryColor}}),(0,b.jsx)("span",{className:"text-xs font-semibold text-white/70",children:void 0!==h?h.toLocaleString():"0"}),(0,b.jsx)("span",{className:"text-[9px] uppercase tracking-wider text-white/30",children:"views"})]}),o.showJoinDate&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,b.jsx)(f.Calendar,{size:13,style:{color:i.primaryColor}}),(0,b.jsx)("span",{className:"text-xs font-semibold text-white/70",children:"Mar 2026"})]}),o.customStats.filter(a=>a.label&&a.value).map((a,c)=>(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"text-sm font-bold text-white/80",children:a.value}),(0,b.jsx)("div",{className:"text-[9px] uppercase tracking-wider text-white/30",children:a.label})]},c))]}),"socials"===c.type&&k.filter(a=>a.url).length>0&&(0,b.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-3`,children:k.filter(a=>a.url).map((a,c)=>(0,b.jsx)("a",{href:a.url,target:"_blank",rel:"noopener noreferrer",className:"w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",style:{backgroundColor:`${i.primaryColor}10`,border:`1px solid ${i.primaryColor}25`,color:i.primaryColor},children:(0,b.jsx)(v,{platform:a.platform,size:16})},c))}),"links"===c.type&&m.filter(a=>a.enabled&&a.title).length>0&&(0,b.jsx)("div",{className:"w-full space-y-3",children:m.filter(a=>a.enabled&&a.title).map((a,c)=>(0,b.jsxs)("a",{href:a.url||"#",target:"_blank",rel:"noopener noreferrer",className:"bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group",style:{borderRadius:`${i.borderRadius}px`,backgroundColor:"glass"===i.cardStyle?"rgba(255,255,255,0.04)":"solid"===i.cardStyle?"rgba(255,255,255,0.06)":"transparent",border:"neon"===i.cardStyle?`1px solid ${i.primaryColor}40`:"outline"===i.cardStyle?"2px solid rgba(255,255,255,0.12)":"1px solid rgba(255,255,255,0.08)",backdropFilter:"glass"===i.cardStyle?"blur(12px)":"none",boxShadow:"neon"===i.cardStyle?`0 0 15px ${i.primaryColor}15`:"none"},children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center",style:{backgroundColor:`${i.primaryColor}15`,color:i.primaryColor},children:(0,b.jsx)(r.Link2,{size:14})}),(0,b.jsx)("span",{className:"text-sm font-medium text-white/80 group-hover:text-white transition-colors",children:a.title})]}),(0,b.jsx)(d.ExternalLink,{size:14,className:"text-white/20 group-hover:text-white/50 transition-colors"})]},c))}),"timeline"===c.type&&a.timeline?.enabled&&(a.timeline.items||[]).filter(a=>a.title).length>0&&(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${i.primaryColor}80`},children:"Timeline"}),(0,b.jsxs)("div",{className:"relative pl-6 text-left",children:[(0,b.jsx)("div",{className:"absolute left-2 top-0 bottom-0 w-px",style:{backgroundColor:`${i.primaryColor}20`}}),(a.timeline.items||[]).filter(a=>a.title).map((a,c)=>(0,b.jsxs)("div",{className:"relative mb-6 last:mb-0",children:[(0,b.jsx)("div",{className:"absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2",style:{borderColor:i.primaryColor,backgroundColor:`${i.primaryColor}30`}}),a.date&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5 mb-1",children:[(0,b.jsx)(t.Clock,{size:10,style:{color:`${i.primaryColor}60`}}),(0,b.jsx)("span",{className:"text-[10px] font-mono",style:{color:`${i.primaryColor}60`},children:a.date})]}),(0,b.jsx)("h4",{className:"text-sm font-semibold text-white/80",children:a.title}),a.description&&(0,b.jsx)("p",{className:"text-xs text-white/40 mt-0.5",children:a.description})]},c))]})]}),"gallery"===c.type&&a.imageGallery?.enabled&&(a.imageGallery.images||[]).filter(a=>a.url).length>0&&(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${i.primaryColor}80`},children:"Gallery"}),(0,b.jsx)("div",{className:"grid grid-cols-2 gap-2",children:(a.imageGallery.images||[]).filter(a=>a.url).map((a,c)=>(0,b.jsxs)("div",{className:"relative group rounded-xl overflow-hidden aspect-square",children:[(0,b.jsx)("img",{src:a.url,alt:a.caption||"",className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}),a.caption&&(0,b.jsx)("div",{className:"absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",children:(0,b.jsx)("span",{className:"text-[10px] text-white/80",children:a.caption})})]},c))})]}),"video"===c.type&&a.embedVideo?.enabled&&a.embedVideo.url&&(0,b.jsx)("div",{className:"w-full",children:(0,b.jsx)("div",{className:"w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06]",children:(0,b.jsx)("iframe",{src:a.embedVideo.url.replace("watch?v=","embed/").split("&")[0],className:"w-full h-full",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})})}),"music"===c.type&&n.enabled&&n.url&&(0,b.jsxs)("div",{className:"w-full",children:["spotify"===n.type&&E(n.url)&&(0,b.jsx)("iframe",{src:E(n.url,0)||"",width:"100%",height:"152",frameBorder:"0",allow:"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",loading:"lazy",className:"rounded-xl opacity-90 transition-all hover:opacity-100"}),"custom"===n.type&&(0,b.jsxs)("div",{className:"flex items-center gap-3 p-4",style:{borderRadius:`${i.borderRadius}px`,backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[(0,b.jsx)("button",{onClick:()=>{let a=A.current;a&&(w?(a.pause(),x(!1)):(a.play().catch(a=>console.log(a)),x(!0)))},className:"w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-white/5 hover:bg-white/10",style:{color:i.primaryColor},children:w?(0,b.jsxs)("span",{className:"flex gap-0.5 items-end justify-center h-4 pb-0.5",children:[(0,b.jsx)("span",{className:"w-0.5 h-2.5 bg-current animate-[pulse_0.8s_infinite] rounded-full"}),(0,b.jsx)("span",{className:"w-0.5 h-4 bg-current animate-[pulse_0.5s_infinite] rounded-full"}),(0,b.jsx)("span",{className:"w-0.5 h-3 bg-current animate-[pulse_1.2s_infinite] rounded-full"})]}):(0,b.jsx)(l.Music,{size:16})}),(0,b.jsxs)("div",{className:"flex-1 text-left truncate",children:[(0,b.jsx)("span",{className:"text-[9px] text-white/40 block uppercase tracking-wider font-bold",children:"Custom Soundtrack"}),(0,b.jsx)("span",{className:"text-xs text-white/80 font-medium truncate block max-w-[180px]",children:n.url.split("/").pop()||"soundtrack.mp3"})]})]})]}),"discord"===c.type&&a.discordWidget?.enabled&&a.discordWidget.userId&&(0,b.jsxs)("div",{className:"w-full flex items-center gap-3 p-4 rounded-xl text-left",style:{backgroundColor:"rgba(88, 101, 242, 0.08)",border:"1px solid rgba(88, 101, 242, 0.15)"},children:[(0,b.jsx)(g.MessageCircle,{size:16,style:{color:"#5865F2"}}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-[10px] uppercase tracking-wider font-bold text-[#5865F2]/80",children:"Discord"}),(0,b.jsx)("div",{className:"text-xs text-white/60 font-mono",children:a.discordWidget.userId})]})]})]},c.id)}),(0,b.jsx)("div",{className:`mt-auto pt-8 text-center ${W()}`,style:C(14),children:(0,b.jsx)("p",{className:"text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold",children:"Powered by Sagitarius.cc"})})]}),n.enabled&&n.url&&"custom"===n.type&&(0,b.jsx)("audio",{ref:A,src:n.url,loop:!0,preload:"auto",crossOrigin:"anonymous",style:{display:"none"}}),a.revealScreen?.enabled&&!q&&(0,b.jsx)("div",{className:"absolute inset-0 z-50 flex items-center justify-center cursor-pointer",style:{backdropFilter:`blur(${a.revealScreen.blur||15}px)`,backgroundColor:"rgba(0,0,0,0.5)"},onClick:()=>{s(!0);let a=A.current;a&&n.autoplay&&a.play().then(()=>x(!0)).catch(a=>console.log("Interactive play blocked:",a))},children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("p",{className:"text-xl font-bold text-white mb-2 animate-bounce",style:{textShadow:`0 0 20px ${i.primaryColor}`},children:a.revealScreen.text||"Click to enter"}),(0,b.jsx)("p",{className:"text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse",children:"Click anywhere"})]})})]})]})}a.s(["default",()=>F])}];

//# sourceMappingURL=_67be17d6._.js.map