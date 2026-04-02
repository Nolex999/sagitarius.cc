module.exports=[16686,a=>{"use strict";let b=(0,a.i(70106).default)("music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);a.s(["Music",()=>b],16686)},69922,a=>{"use strict";let b=(0,a.i(70106).default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);a.s(["Link2",()=>b],69922)},64791,a=>{"use strict";let b=(0,a.i(70106).default)("video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);a.s(["Video",()=>b],64791)},5112,69472,72919,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);a.s(["Github",()=>c],5112);let d=(0,b.default)("youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]);a.s(["Youtube",()=>d],69472);let e=(0,b.default)("twitch",[["path",{d:"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",key:"c0yzno"}]]);a.s(["Twitch",()=>e],72919)},39646,13513,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("gamepad-2",[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]]);a.s(["Gamepad2",()=>c],39646);let d=(0,b.default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);a.s(["Camera",()=>d],13513)},1261,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(52495),e=a.i(77156),f=a.i(41675),g=a.i(45222),h=a.i(92759),i=a.i(5112),j=a.i(69472),k=a.i(72919),l=a.i(16686),m=a.i(39646),n=a.i(13513),o=a.i(64791),p=a.i(92258),q=a.i(44494),r=a.i(69922),s=a.i(2835),t=a.i(41710),u=a.i(67304);function v({platform:a,size:c=16}){let d={discord:g.MessageCircle,telegram:h.Send,twitter:s.Hash,github:i.Github,youtube:j.Youtube,twitch:k.Twitch,spotify:l.Music,steam:m.Gamepad2,instagram:n.Camera,tiktok:o.Video,snapchat:w,reddit:q.Globe,soundcloud:l.Music,kick:o.Video,email:p.Mail}[a]||q.Globe;return(0,b.jsx)(d,{size:c})}function w(a){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...a,width:a.size,height:a.size,children:(0,b.jsx)("path",{d:"M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"})})}let x=(0,c.memo)(function({color:a,intensity:d}){let e=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let b,c=e.current;if(!c)return;let f=c.getContext("2d");if(!f)return;let g=0,h=Math.min(Math.floor(d/100*40)+8,40),i=()=>{c.width=c.offsetWidth,c.height=c.offsetHeight};i(),window.addEventListener("resize",i);let j=Array.from({length:h},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,size:2*Math.random()+.5,opacity:.5*Math.random()+.1})),k=d=>{if(d-g<33.333333333333336){b=requestAnimationFrame(k);return}g=d,f.clearRect(0,0,c.width,c.height),j.forEach(b=>{b.x+=b.vx,b.y+=b.vy,(b.x<0||b.x>c.width)&&(b.vx*=-1),(b.y<0||b.y>c.height)&&(b.vy*=-1),f.beginPath(),f.arc(b.x,b.y,b.size,0,2*Math.PI),f.fillStyle=a+Math.floor(255*b.opacity).toString(16).padStart(2,"0"),f.fill()});for(let b=0;b<j.length;b++)for(let c=b+1;c<j.length;c++){let d=j[b].x-j[c].x,e=j[b].y-j[c].y,g=d*d+e*e;g<6400&&(f.beginPath(),f.moveTo(j[b].x,j[b].y),f.lineTo(j[c].x,j[c].y),f.strokeStyle=a+Math.floor((1-Math.sqrt(g)/80)*30).toString(16).padStart(2,"0"),f.lineWidth=.5,f.stroke())}b=requestAnimationFrame(k)};return b=requestAnimationFrame(k),()=>{cancelAnimationFrame(b),window.removeEventListener("resize",i)}},[a,d]),(0,b.jsx)("canvas",{ref:e,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),y=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*40)+8,f=(0,c.useMemo)(()=>Array.from({length:e},(a,b)=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,width:`${3*Math.random()+1}px`,height:`${3*Math.random()+1}px`,duration:`${3*Math.random()+2}s`,delay:`${5*Math.random()}s`,opacity:.7*Math.random()+.1})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:c.top,width:c.width,height:c.height,backgroundColor:a,opacity:c.opacity,animation:`bio-twinkle ${c.duration} ease-in-out infinite`,animationDelay:c.delay}},d))})}),z=(0,c.memo)(function({color:a,intensity:d}){let e=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let b,c=e.current;if(!c)return;let f=c.getContext("2d");if(!f)return;let g=0;c.width=c.offsetWidth,c.height=c.offsetHeight;let h=Array(Math.floor(c.width/12)).fill(1),i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*",j=e=>{if(e-g<50){b=requestAnimationFrame(j);return}g=e,f.fillStyle="rgba(0, 0, 0, 0.05)",f.fillRect(0,0,c.width,c.height),f.fillStyle=a,f.font="12px monospace",f.globalAlpha=d/100*.5;for(let a=0;a<h.length;a++){let b=i[Math.floor(Math.random()*i.length)];f.fillText(b,12*a,12*h[a]),12*h[a]>c.height&&Math.random()>.975&&(h[a]=0),h[a]++}f.globalAlpha=1,b=requestAnimationFrame(j)};return b=requestAnimationFrame(j),()=>cancelAnimationFrame(b)},[a,d]),(0,b.jsx)("canvas",{ref:e,className:"absolute inset-0 w-full h-full pointer-events-none",style:{contain:"strict"}})}),A=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*30)+8,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,size:`${4*Math.random()+2}px`,opacity:.6*Math.random()+.2,duration:`${5*Math.random()+5}s`,delay:`${10*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:"-5%",width:c.size,height:c.size,backgroundColor:a,opacity:c.opacity,animation:`bio-snowfall ${c.duration} linear infinite`,animationDelay:c.delay}},d))})}),B=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*40)+10,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,height:`${20*Math.random()+10}px`,opacity:.4*Math.random()+.1,duration:`${+Math.random()+.5}s`,delay:`${3*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute",style:{left:c.left,top:"-5%",width:"1px",height:c.height,backgroundColor:a,opacity:c.opacity,animation:`bio-rainfall ${c.duration} linear infinite`,animationDelay:c.delay}},d))})}),C=(0,c.memo)(function({color:a,intensity:d}){let e=Math.floor(d/100*15)+4,f=(0,c.useMemo)(()=>Array.from({length:e},()=>({left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,size:`${5*Math.random()+3}px`,shadow1:`${10*Math.random()+5}px`,shadow2:`${20*Math.random()+10}px`,duration:`${4*Math.random()+3}s`,delay:`${5*Math.random()}s`})),[e]);return(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",style:{willChange:"transform",contain:"strict"},children:f.map((c,d)=>(0,b.jsx)("div",{className:"absolute rounded-full",style:{left:c.left,top:c.top,width:c.size,height:c.size,backgroundColor:a,boxShadow:`0 0 ${c.shadow1} ${a}, 0 0 ${c.shadow2} ${a}`,opacity:0,animation:`bio-firefly ${c.duration} ease-in-out infinite`,animationDelay:c.delay}},d))})});function D({effect:a,color:c,intensity:d}){switch(a){case"particles":return(0,b.jsx)(x,{color:c,intensity:d});case"stars":return(0,b.jsx)(y,{color:c,intensity:d});case"matrix":return(0,b.jsx)(z,{color:c,intensity:d});case"snow":return(0,b.jsx)(A,{color:c,intensity:d});case"rain":return(0,b.jsx)(B,{color:c,intensity:d});case"fireflies":return(0,b.jsx)(C,{color:c,intensity:d});default:return null}}function E(a,b=0){if(!a||"string"!=typeof a)return null;let c=a.match(/(track|album|playlist|artist|episode|show)[\/:]([a-zA-Z0-9]+)/);return c&&c[1]&&c[2]?`https://open.spotify.com/embed/${c[1]}/${c[2]}?utm_source=generator&theme=${b}`:null}function F({config:a,realViews:c}){let{theme:h,effects:i,socials:j,customLinks:k,music:m,stats:n}=a,o=`https://fonts.googleapis.com/css2?family=${h.fontFamily.replace(/ /g,"+")}:wght@300;400;500;600;700;900&display=swap`,p={};if("solid"===h.bgType)p.backgroundColor=h.bgColor1;else if("gradient"===h.bgType)p.background=`linear-gradient(135deg, ${h.bgColor1} 0%, ${h.bgColor2} 100%)`;else if("image"===h.bgType)p.backgroundImage=`url(${h.bgImageUrl})`,p.backgroundSize="cover",p.backgroundPosition="center";else if("pattern"===h.bgType)switch(p.backgroundColor=h.bgColor1,h.bgPattern){case"dots":default:p.backgroundImage=`radial-gradient(${h.bgColor2} 2px, transparent 2px)`,p.backgroundSize="30px 30px";break;case"grid":p.backgroundImage=`linear-gradient(${h.bgColor2} 1px, transparent 1px), linear-gradient(90deg, ${h.bgColor2} 1px, transparent 1px)`,p.backgroundSize="30px 30px";break;case"waves":p.backgroundImage=`repeating-radial-gradient(circle at 0 0, transparent 0, ${h.bgColor2} 2px, transparent 2px, transparent 20px)`;break;case"diagonal":p.backgroundImage=`repeating-linear-gradient(45deg, ${h.bgColor2} 0, ${h.bgColor2} 2px, transparent 0, transparent 50%)`,p.backgroundSize="20px 20px"}let q=()=>{let a=i.entranceAnimation;return"none"===a?"":`bio-entrance-${a}`},s=b=>({animationDelay:`${b*((a.entranceSpeed??200)/2e3)}s`,animationFillMode:"both",animationDuration:`${(a.entranceSpeed??200)*2}ms`}),w=h.glowEnabled?`0 0 ${h.glowIntensity}px ${h.glowColor}44, 0 0 ${2*h.glowIntensity}px ${h.glowColor}22`:"none",x=()=>{let b=a.borderWidth??1,c=a.borderColor||"#ffffff",d=(a.borderOpacity??10)/100,e=`${c}${Math.round(255*d).toString(16).padStart(2,"0")}`;switch(a.borderStyle){case"solid":return{border:`${b}px solid ${e}`};case"dashed":return{border:`${b}px dashed ${e}`};case"gradient":return{border:`${b}px solid transparent`,backgroundClip:"padding-box, border-box",backgroundImage:`linear-gradient(${a.glassmorphism?.enabled?`rgba(255,255,255,${a.glassmorphism.opacity/100})`:h.bgColor1}, ${a.glassmorphism?.enabled?`rgba(255,255,255,${a.glassmorphism.opacity/100})`:h.bgColor1}), linear-gradient(135deg, ${h.primaryColor}, ${h.secondaryColor})`};default:return a.glassmorphism?.enabled&&"animated"!==a.borderStyle?{border:`${b}px solid rgba(255,255,255,0.08)`}:{border:"none"}}},y=a.boxWidth??500,z=a.boxSpacing??40,A=a.boxColor||"#000000",B=(a.boxOpacity??30)/100,C=a.boxBlur??12,F=a.boxShadowColor||"#000000",G=(a.boxShadowOpacity??50)/100,H=a.glassmorphism?.enabled?{backdropFilter:`blur(${a.glassmorphism.blur}px)`,WebkitBackdropFilter:`blur(${a.glassmorphism.blur}px)`,backgroundColor:`rgba(255,255,255,${a.glassmorphism.opacity/100})`,borderRadius:`${h.borderRadius}px`,padding:`${z}px`,maxWidth:`${y}px`,width:"100%",boxShadow:`0 8px 32px ${F}${Math.round(255*G).toString(16).padStart(2,"0")}`,...x()}:{...x(),borderRadius:`${h.borderRadius}px`,padding:`${z}px`,maxWidth:`${y}px`,width:"100%",backgroundColor:`${A}${Math.round(255*B).toString(16).padStart(2,"0")}`,backdropFilter:C>0?`blur(${C}px)`:void 0,boxShadow:`0 8px 32px ${F}${Math.round(255*G).toString(16).padStart(2,"0")}`},I="default"!==i.customCursor?{cursor:i.customCursor}:{};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @import url('${o}');
        
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
          0%, 100% { box-shadow: 0 0 20px ${h.primaryColor}44, 0 0 40px ${h.primaryColor}22; }
          50% { box-shadow: 0 0 30px ${h.primaryColor}66, 0 0 60px ${h.primaryColor}33; }
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
            text-shadow: 0 0 7px ${h.primaryColor}, 0 0 10px ${h.primaryColor}, 0 0 21px ${h.primaryColor};
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
          0%, 100% { border-color: ${h.primaryColor}40; }
          50% { border-color: ${h.primaryColor}80; }
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
          background: conic-gradient(from var(--angle, 0deg), ${h.primaryColor}, ${h.secondaryColor}, ${h.accentColor}, ${h.primaryColor});
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
          background: linear-gradient(90deg, ${h.primaryColor}, ${h.secondaryColor}, ${h.accentColor}, ${h.primaryColor});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bio-text-gradient 4s ease infinite;
        }
        
        .bio-text-glitch { animation: bio-glitch 2s ease-in-out infinite; }
        .bio-text-neon { animation: bio-neon-flicker 3s ease-in-out infinite; color: ${h.primaryColor}; }
        
        .bio-text-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: bio-typewriter 2s steps(30) forwards;
          border-right: 2px solid ${h.primaryColor};
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
          0% { box-shadow: 0 0 0 0 ${h.primaryColor}66; }
          70% { box-shadow: 0 0 0 12px ${h.primaryColor}00; }
          100% { box-shadow: 0 0 0 0 ${h.primaryColor}00; }
        }
        @keyframes bio-shadow-dance {
          0%, 100% { box-shadow: 5px 5px 20px ${h.primaryColor}44; }
          25% { box-shadow: -5px 5px 20px ${h.secondaryColor}44; }
          50% { box-shadow: -5px -5px 20px ${h.accentColor}44; }
          75% { box-shadow: 5px -5px 20px ${h.primaryColor}44; }
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
          border-radius: ${h.borderRadius+2}px;
          background: conic-gradient(from var(--angle, 0deg), ${h.primaryColor}, ${h.secondaryColor}, ${h.accentColor}, ${h.primaryColor});
          animation: bio-rotate-border 3s linear infinite;
          z-index: -1;
        }
        
        /* HOVER EFFECTS */
        ${"lift"===(i.hoverEffect||"lift")?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3), ${"none"!==w?`0 0 20px ${h.primaryColor}33`:"0 0 0 transparent"}; }
        `:""}
        ${"glow"===i.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid transparent; }
          .bio-link-hover:hover { box-shadow: 0 0 20px ${h.primaryColor}80; border-color: ${h.primaryColor}60; transform: translateY(-1px); }
        `:""}
        ${"scale"===i.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { transform: scale(1.03); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        `:""}
        ${"neon"===i.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
          .bio-link-hover:hover { 
            box-shadow: 0 0 10px ${h.primaryColor}, inset 0 0 10px ${h.primaryColor}; 
            border-color: ${h.primaryColor}; 
            color: ${h.primaryColor};
            background-color: ${h.primaryColor}10;
          }
        `:""}
        ${"shake"===i.hoverEffect?`
          @keyframes hover-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px) rotate(-1deg); }
            75% { transform: translateX(3px) rotate(1deg); }
          }
          .bio-link-hover { transition: all 0.2s ease; }
          .bio-link-hover:hover { animation: hover-shake 0.3s ease-in-out infinite; }
        `:""}
        ${"underline-slide"===i.hoverEffect?`
          .bio-link-hover { position: relative; transition: all 0.2s ease; overflow: hidden; }
          .bio-link-hover::after { content: ''; position: absolute; bottom: 0; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, ${h.primaryColor}, ${h.secondaryColor}); transition: left 0.3s ease; }
          .bio-link-hover:hover::after { left: 0; }
          .bio-link-hover:hover { transform: translateY(-1px); }
        `:""}
        ${"border-glow"===i.hoverEffect?`
          .bio-link-hover { transition: all 0.3s ease; border: 1px solid transparent !important; }
          .bio-link-hover:hover { border-color: ${h.primaryColor} !important; box-shadow: 0 0 15px ${h.primaryColor}40, inset 0 0 15px ${h.primaryColor}10; transform: translateY(-1px); }
        `:""}
        ${"tilt-3d"===i.hoverEffect?`
          .bio-link-hover { transition: all 0.2s ease; transform-style: preserve-3d; perspective: 600px; }
          .bio-link-hover:hover { transform: perspective(600px) rotateX(-5deg) rotateY(3deg) translateY(-3px); box-shadow: 5px 10px 20px rgba(0,0,0,0.3); }
        `:""}
        ${"haul"===i.hoverEffect?`
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
            border-color: ${h.primaryColor}80 !important;
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
          1% { background-color: ${h.primaryColor}20; mix-blend-mode: color-dodge; }
          2% { background-color: transparent; }
          15% { background-color: transparent; }
          16% { background-color: ${h.accentColor}20; transform: translateX(2px); }
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
        
        ${a.customCss}
      `}),(0,b.jsxs)("div",{className:"bio-page relative w-full h-full overflow-y-auto overflow-x-hidden",style:{...p,...I,fontFamily:`'${h.fontFamily}', system-ui, sans-serif`,opacity:(a.bgOpacity??100)/100},children:[(a.bgBlur??0)>0&&(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none z-0",style:{backdropFilter:`blur(${a.bgBlur}px)`}}),"video"===h.bgType&&h.bgVideoUrl&&(0,b.jsx)("video",{src:h.bgVideoUrl,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"}),i.overlayEffect&&"none"!==i.overlayEffect&&(0,b.jsx)("div",{className:`bio-overlay bio-overlay-${i.overlayEffect}`}),a.backgroundOverlay?.enabled&&(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none z-[1]",style:{backgroundColor:a.backgroundOverlay.color,opacity:a.backgroundOverlay.opacity/100}}),"none"!==i.bgEffect&&(0,b.jsx)(D,{effect:i.bgEffect,color:i.bgEffectColor,intensity:i.bgEffectIntensity}),a.bannerUrl&&(0,b.jsxs)("div",{className:`w-full overflow-hidden ${q()}`,style:{...s(0),height:`${a.bannerHeight||200}px`,flexShrink:0,position:"relative",zIndex:5},children:[(0,b.jsx)("img",{src:a.bannerUrl,alt:"Banner",className:"w-full h-full object-cover",style:{borderRadius:"card"===a.layoutPreset?`${h.borderRadius}px ${h.borderRadius}px 0 0`:0,opacity:(a.bannerOpacity??100)/100,filter:(a.bannerBlur??0)>0?`blur(${a.bannerBlur}px)`:void 0}}),(0,b.jsx)("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)"}})]}),(0,b.jsxs)("div",{className:`relative z-10 flex flex-col ${"left-aligned"===a.layoutPreset?"items-start text-left":"items-center"} my-8 mx-auto h-fit ${"animated"===a.borderStyle?"bio-animated-border":""} ${a.boxTilt&&"none"!==a.boxTilt?"bio-box-tilt":""}`,style:H,children:[a.statusIndicator?.enabled&&(0,b.jsxs)("div",{className:`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${q()}`,style:{...s(0),backgroundColor:`${a.statusIndicator.color}15`,border:`1px solid ${a.statusIndicator.color}30`},children:[(0,b.jsx)("span",{className:"text-sm",children:a.statusIndicator.emoji}),(0,b.jsx)("span",{className:"text-[11px] font-medium",style:{color:a.statusIndicator.color},children:a.statusIndicator.text})]}),a.languageTag&&(0,b.jsx)("div",{className:`mb-3 px-2 py-0.5 rounded text-[8px] uppercase tracking-[0.3em] font-bold ${q()}`,style:{...s(0),backgroundColor:`${h.primaryColor}10`,border:`1px solid ${h.primaryColor}20`,color:h.primaryColor},children:a.languageTag}),(0,b.jsxs)("div",{className:`${q()} ${function(a){switch(a){case"glow-pulse":return"bio-avatar-glow-pulse";case"rotate-border":return"bio-avatar-rotate-border";case"glitch":return"bio-avatar-glitch";case"breathe":return"bio-avatar-breathe";case"float":return"bio-avatar-float";case"spin-slow":return"bio-avatar-spin-slow";case"pulse-ring":return"bio-avatar-pulse-ring";case"shadow-dance":return"bio-avatar-shadow-dance";default:return""}}(i.avatarEffect)} mb-5 relative`,style:s(1),children:[(0,b.jsx)("div",{className:"w-24 h-24 overflow-hidden flex items-center justify-center text-3xl font-bold",style:{...function(a){switch(a){case"rounded-square":return{borderRadius:"20%"};case"hexagon":return{clipPath:"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"};default:return{borderRadius:"50%"}}}(a.profileShape),borderRadius:"circle"===a.profileShape?`${a.avatarRadius??50}%`:"rounded-square"===a.profileShape?`${(a.avatarRadius??50)/4}px`:void 0,border:`2px solid ${h.primaryColor}60`,boxShadow:h.glowEnabled?`0 0 25px ${h.glowColor}44`:"none",backgroundColor:`${h.primaryColor}15`,color:h.primaryColor},children:a.avatarUrl?(0,b.jsx)("img",{src:a.avatarUrl,alt:"avatar",className:"w-full h-full object-cover"}):a.displayName?.[0]?.toUpperCase()||"?"}),a.avatarDecoration&&"none"!==a.avatarDecoration&&(0,b.jsx)("span",{className:"absolute -top-3 left-1/2 -translate-x-1/2 text-2xl pointer-events-none bio-avatar-deco",style:{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"},children:"cat-ears"===a.avatarDecoration?"🐱":"crown"===a.avatarDecoration?"👑":"horns"===a.avatarDecoration?"😈":"halo"===a.avatarDecoration?"😇":"🔥"})]}),(0,b.jsx)("h1",{className:`text-2xl font-bold mb-1 ${q()} ${function(a){switch(a){case"gradient":return"bio-text-gradient";case"glitch":return"bio-text-glitch";case"typewriter":return"bio-text-typewriter";case"neon-flicker":return"bio-text-neon";default:return""}}(i.textEffect)}`,style:{...s(2),..."gradient"===i.textEffect?{}:"neon-flicker"===i.textEffect?{color:h.primaryColor}:{color:"white"}},children:a.displayName||"Username"}),(0,b.jsxs)("p",{className:`text-sm mb-2 ${q()} ${a.usernameSparkles&&"none"!==a.usernameSparkles?`bio-sparkle-${a.usernameSparkles}`:""}`,style:{...s(3),color:`${h.primaryColor}aa`},children:["@",a.username||"username",a.pronouns&&(0,b.jsxs)("span",{className:"ml-2 opacity-50",children:["• ",a.pronouns]})]}),a.location&&(0,b.jsxs)("p",{className:`text-xs mb-2 ${q()}`,style:{...s(3),color:`${h.primaryColor}66`},children:["📍 ",a.location]}),a.badges.length>0&&(0,b.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-1.5 mb-4 ${q()}`,style:s(4),children:a.badges.map((a,c)=>(0,b.jsxs)("span",{className:"px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5",style:{borderRadius:`${h.borderRadius/2}px`,backgroundColor:"VIP"===a?"rgba(255, 215, 0, 0.15)":`${h.primaryColor}15`,border:`1px solid ${"VIP"===a?"rgba(255, 215, 0, 0.4)":`${h.primaryColor}30`}`,color:"VIP"===a?"#ffd700":h.primaryColor,boxShadow:"VIP"===a?"0 0 10px rgba(255, 215, 0, 0.1)":"none"},children:["VIP"===a&&(0,b.jsx)("span",{className:"bio-diamond-spin",children:(0,b.jsx)(u.Diamond,{size:10,fill:"currentColor"})}),a]},c))}),(0,b.jsx)("p",{className:`${"left-aligned"===a.layoutPreset?"text-left":"text-center"} text-sm mb-6 max-w-[280px] ${q()} ${a.typingBio?"bio-text-typewriter":""}`,style:{...s(5),color:"rgba(255,255,255,0.5)",lineHeight:"1.6"},children:a.bio||"Your bio goes here..."}),(n.showViews||n.showJoinDate||n.customStats.length>0)&&(0,b.jsxs)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-6 mb-8 ${q()}`,style:s(6),children:[n.showViews&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,b.jsx)(e.Eye,{size:13,style:{color:h.primaryColor}}),(0,b.jsx)("span",{className:"text-xs font-semibold text-white/70",children:void 0!==c?c.toLocaleString():"0"}),(0,b.jsx)("span",{className:"text-[9px] uppercase tracking-wider text-white/30",children:"views"})]}),n.showJoinDate&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,b.jsx)(f.Calendar,{size:13,style:{color:h.primaryColor}}),(0,b.jsx)("span",{className:"text-xs font-semibold text-white/70",children:"Mar 2026"})]}),n.customStats.filter(a=>a.label&&a.value).map((a,c)=>(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"text-sm font-bold text-white/80",children:a.value}),(0,b.jsx)("div",{className:"text-[9px] uppercase tracking-wider text-white/30",children:a.label})]},c))]}),j.filter(a=>a.url).length>0&&(0,b.jsx)("div",{className:`flex flex-wrap ${"left-aligned"===a.layoutPreset?"justify-start":"justify-center"} gap-3 mb-8 ${q()}`,style:s(7),children:j.filter(a=>a.url).map((a,c)=>(0,b.jsx)("a",{href:a.url,target:"_blank",rel:"noopener noreferrer",className:"w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",style:{backgroundColor:`${h.primaryColor}10`,border:`1px solid ${h.primaryColor}25`,color:h.primaryColor},children:(0,b.jsx)(v,{platform:a.platform,size:16})},c))}),k.filter(a=>a.enabled&&a.title).length>0&&(0,b.jsx)("div",{className:`w-full space-y-3 mb-8 ${q()}`,style:s(8),children:k.filter(a=>a.enabled&&a.title).map((a,c)=>(0,b.jsxs)("a",{href:a.url||"#",target:"_blank",rel:"noopener noreferrer",className:"bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group",style:{borderRadius:`${h.borderRadius}px`,backgroundColor:"glass"===h.cardStyle?"rgba(255,255,255,0.04)":"solid"===h.cardStyle?"rgba(255,255,255,0.06)":"transparent",border:"neon"===h.cardStyle?`1px solid ${h.primaryColor}40`:"outline"===h.cardStyle?"2px solid rgba(255,255,255,0.12)":"1px solid rgba(255,255,255,0.08)",backdropFilter:"glass"===h.cardStyle?"blur(12px)":"none",boxShadow:"neon"===h.cardStyle?`0 0 15px ${h.primaryColor}15`:"none"},children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center",style:{backgroundColor:`${h.primaryColor}15`,color:h.primaryColor},children:(0,b.jsx)(r.Link2,{size:14})}),(0,b.jsx)("span",{className:"text-sm font-medium text-white/80 group-hover:text-white transition-colors",children:a.title})]}),(0,b.jsx)(d.ExternalLink,{size:14,className:"text-white/20 group-hover:text-white/50 transition-colors"})]},c))}),a.timeline?.enabled&&(a.timeline.items||[]).filter(a=>a.title).length>0&&(0,b.jsxs)("div",{className:`w-full mb-8 ${q()}`,style:s(9),children:[(0,b.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${h.primaryColor}80`},children:"Timeline"}),(0,b.jsxs)("div",{className:"relative pl-6",children:[(0,b.jsx)("div",{className:"absolute left-2 top-0 bottom-0 w-px",style:{backgroundColor:`${h.primaryColor}20`}}),(a.timeline.items||[]).filter(a=>a.title).map((a,c)=>(0,b.jsxs)("div",{className:"relative mb-6 last:mb-0",children:[(0,b.jsx)("div",{className:"absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2",style:{borderColor:h.primaryColor,backgroundColor:`${h.primaryColor}30`}}),a.date&&(0,b.jsxs)("div",{className:"flex items-center gap-1.5 mb-1",children:[(0,b.jsx)(t.Clock,{size:10,style:{color:`${h.primaryColor}60`}}),(0,b.jsx)("span",{className:"text-[10px] font-mono",style:{color:`${h.primaryColor}60`},children:a.date})]}),(0,b.jsx)("h4",{className:"text-sm font-semibold text-white/80",children:a.title}),a.description&&(0,b.jsx)("p",{className:"text-xs text-white/40 mt-0.5",children:a.description})]},c))]})]}),a.imageGallery?.enabled&&(a.imageGallery.images||[]).filter(a=>a.url).length>0&&(0,b.jsxs)("div",{className:`w-full mb-8 ${q()}`,style:s(10),children:[(0,b.jsx)("h3",{className:"text-[9px] uppercase tracking-[0.25em] font-bold mb-4",style:{color:`${h.primaryColor}80`},children:"Gallery"}),(0,b.jsx)("div",{className:"grid grid-cols-2 gap-2",children:(a.imageGallery.images||[]).filter(a=>a.url).map((a,c)=>(0,b.jsxs)("div",{className:"relative group rounded-xl overflow-hidden aspect-square",children:[(0,b.jsx)("img",{src:a.url,alt:a.caption||"",className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}),a.caption&&(0,b.jsx)("div",{className:"absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",children:(0,b.jsx)("span",{className:"text-[10px] text-white/80",children:a.caption})})]},c))})]}),a.embedVideo?.enabled&&a.embedVideo.url&&(0,b.jsx)("div",{className:`w-full mb-8 ${q()}`,style:s(11),children:(0,b.jsx)("div",{className:"w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06]",children:(0,b.jsx)("iframe",{src:a.embedVideo.url.replace("watch?v=","embed/").split("&")[0],className:"w-full h-full",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})})}),m.enabled&&m.url&&(0,b.jsxs)("div",{className:`w-full mb-8 ${q()}`,style:s(12),children:["spotify"===m.type&&E(m.url)&&(0,b.jsx)("iframe",{src:E(m.url,0)||"",width:"100%",height:"152",frameBorder:"0",allow:"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",loading:"lazy",className:"rounded-xl opacity-90 transition-all hover:opacity-100"}),"custom"===m.type&&(0,b.jsxs)("div",{className:"flex items-center gap-3 p-4",style:{borderRadius:`${h.borderRadius}px`,backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[(0,b.jsx)("div",{className:"w-10 h-10 rounded-lg flex items-center justify-center",style:{backgroundColor:`${h.primaryColor}15`,color:h.primaryColor},children:(0,b.jsx)(l.Music,{size:16})}),(0,b.jsx)("audio",{controls:!0,className:"flex-1 h-8 opacity-70",style:{filter:"invert(1)"},children:(0,b.jsx)("source",{src:m.url})})]})]}),a.discordWidget?.enabled&&a.discordWidget.userId&&(0,b.jsxs)("div",{className:`w-full mb-8 flex items-center gap-3 p-4 rounded-xl ${q()}`,style:{...s(13),backgroundColor:"rgba(88, 101, 242, 0.08)",border:"1px solid rgba(88, 101, 242, 0.15)"},children:[(0,b.jsx)(g.MessageCircle,{size:16,style:{color:"#5865F2"}}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-[10px] uppercase tracking-wider font-bold text-[#5865F2]/80",children:"Discord"}),(0,b.jsx)("div",{className:"text-xs text-white/60 font-mono",children:a.discordWidget.userId})]})]}),(0,b.jsx)("div",{className:`mt-auto pt-8 text-center ${q()}`,style:s(14),children:(0,b.jsx)("p",{className:"text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold",children:"Powered by Sagitarius.cc"})})]}),a.revealScreen?.enabled&&(0,b.jsx)("div",{className:"absolute inset-0 z-50 flex items-center justify-center cursor-pointer",style:{backdropFilter:`blur(${a.revealScreen.blur||15}px)`,backgroundColor:"rgba(0,0,0,0.5)"},onClick:a=>a.currentTarget.style.display="none",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("p",{className:"text-xl font-bold text-white mb-2",style:{textShadow:`0 0 20px ${h.primaryColor}`},children:a.revealScreen.text||"Click to enter"}),(0,b.jsx)("p",{className:"text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse",children:"Click anywhere"})]})})]})]})}a.s(["default",()=>F])}];

//# sourceMappingURL=_45ca3888._.js.map