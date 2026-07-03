(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/LandingBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LandingBackground() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingBackground.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let width, height;
            let raf = 0;
            let time = 0;
            const mouse = {
                x: 0,
                y: 0,
                active: false
            };
            const init = {
                "LandingBackground.useEffect.init": ()=>{
                    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                    width = window.innerWidth;
                    height = window.innerHeight;
                    canvas.width = Math.floor(width * dpr);
                    canvas.height = Math.floor(height * dpr);
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
            }["LandingBackground.useEffect.init"];
            const draw = {
                "LandingBackground.useEffect.draw": ()=>{
                    if (document.hidden) {
                        raf = requestAnimationFrame(draw);
                        return;
                    }
                    time += 0.005;
                    ctx.fillStyle = '#030607';
                    ctx.fillRect(0, 0, width, height);
                    const isSmall = width < 700;
                    const rows = isSmall ? 18 : 26;
                    const cols = isSmall ? 18 : 28;
                    const xGap = width / cols;
                    const yGap = height / rows;
                    ctx.lineWidth = 1;
                    for(let i = 0; i <= cols; i++){
                        for(let j = 0; j <= rows; j++){
                            const bx = i * xGap;
                            const by = j * yGap;
                            // Distance from mouse
                            const dx = bx - mouse.x;
                            const dy = by - mouse.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            // Magnetic distortion
                            const influence = Math.max(0, 1 - dist / 300);
                            const angle = Math.atan2(dy, dx);
                            const offset = Math.sin(time + i * 0.2 + j * 0.3) * 10;
                            const mx = bx + Math.cos(angle) * influence * 50 + offset;
                            const my = by + Math.sin(angle) * influence * 50 + offset;
                            // Subtle particles at intersections
                            const opacity = 0.05 + influence * 0.3;
                            ctx.fillStyle = `rgba(94, 234, 212, ${opacity})`;
                            ctx.beginPath();
                            ctx.arc(mx, my, 1 + influence * 2, 0, Math.PI * 2);
                            ctx.fill();
                            // Connect nearby intersections with very faint lines if near mouse
                            if (influence > 0.4) {
                                ctx.strokeStyle = `rgba(94, 234, 212, ${influence * 0.1})`;
                                ctx.beginPath();
                                ctx.moveTo(mx, my);
                                ctx.lineTo(mouse.x, mouse.y);
                                ctx.stroke();
                            }
                        }
                    }
                    // Draw light rays from mouse
                    if (mouse.active) {
                        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 500);
                        gradient.addColorStop(0, 'rgba(94, 234, 212, 0.05)');
                        gradient.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, width, height);
                    }
                    raf = requestAnimationFrame(draw);
                }
            }["LandingBackground.useEffect.draw"];
            const handleMouseMove = {
                "LandingBackground.useEffect.handleMouseMove": (e)=>{
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                    mouse.active = true;
                }
            }["LandingBackground.useEffect.handleMouseMove"];
            const handleMouseLeave = {
                "LandingBackground.useEffect.handleMouseLeave": ()=>{
                    mouse.active = false;
                }
            }["LandingBackground.useEffect.handleMouseLeave"];
            window.addEventListener('resize', init);
            window.addEventListener('mousemove', handleMouseMove, {
                passive: true
            });
            window.addEventListener('mouseleave', handleMouseLeave);
            init();
            draw();
            return ({
                "LandingBackground.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    window.removeEventListener('resize', init);
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseleave', handleMouseLeave);
                }
            })["LandingBackground.useEffect"];
        }
    }["LandingBackground.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 z-0 overflow-hidden bg-[#030607]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "absolute inset-0 block"
            }, void 0, false, {
                fileName: "[project]/src/components/LandingBackground.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent via-[#030607]/20 to-[#030607] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/LandingBackground.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LandingBackground.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(LandingBackground, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = LandingBackground;
var _c;
__turbopack_context__.k.register(_c, "LandingBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/fetch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseFetch",
    ()=>createSupabaseFetch
]);
const DEFAULT_SUPABASE_FETCH_TIMEOUT_MS = 4000;
function createSupabaseFetch(timeoutMs = DEFAULT_SUPABASE_FETCH_TIMEOUT_MS) {
    return async (input, init)=>{
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), timeoutMs);
        const upstreamSignal = init?.signal;
        const abortFromUpstream = ()=>controller.abort(upstreamSignal?.reason);
        if (upstreamSignal?.aborted) {
            abortFromUpstream();
        } else {
            upstreamSignal?.addEventListener('abort', abortFromUpstream, {
                once: true
            });
        }
        try {
            return await fetch(input, {
                ...init,
                signal: controller.signal
            });
        } finally{
            clearTimeout(timeoutId);
            upstreamSignal?.removeEventListener('abort', abortFromUpstream);
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$fetch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/fetch.ts [app-client] (ecmascript)");
;
;
function createClient() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://ovljjdqczqsyozegdbeg.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_PHrCR6KUB8KIjrUWaJ3nMw_PiDwf4eX");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$fetch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSupabaseFetch"])()
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/HomeAuthActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeAuthActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function PrimaryLink({ href, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]",
        style: {
            background: 'linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)',
            color: '#021013',
            boxShadow: '0 4px 24px rgba(94,234,212,0.22)'
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                size: 14,
                className: "group-hover:translate-x-0.5 transition-transform"
            }, void 0, false, {
                fileName: "[project]/src/components/HomeAuthActions.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HomeAuthActions.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = PrimaryLink;
function HomeAuthActions() {
    _s();
    const [isMember, setIsMember] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeAuthActions.useEffect": ()=>{
            let mounted = true;
            try {
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                supabase.auth.getSession().then({
                    "HomeAuthActions.useEffect": ({ data })=>{
                        if (mounted) setIsMember(Boolean(data.session));
                    }
                }["HomeAuthActions.useEffect"]);
            } catch  {
                if (mounted) setIsMember(false);
            }
            return ({
                "HomeAuthActions.useEffect": ()=>{
                    mounted = false;
                }
            })["HomeAuthActions.useEffect"];
        }
    }["HomeAuthActions.useEffect"], []);
    if (isMember) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrimaryLink, {
            href: "/dashboard/software",
            children: "Enter"
        }, void 0, false, {
            fileName: "[project]/src/components/HomeAuthActions.tsx",
            lineNumber: 46,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrimaryLink, {
                href: "/auth/register",
                children: "Request Access"
            }, void 0, false, {
                fileName: "[project]/src/components/HomeAuthActions.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/auth/login",
                className: "text-xs tracking-widest uppercase transition-colors duration-300 hover:text-white/45",
                style: {
                    color: 'rgba(255,255,255,0.22)'
                },
                children: "Already a member? Sign in"
            }, void 0, false, {
                fileName: "[project]/src/components/HomeAuthActions.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HomeAuthActions.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(HomeAuthActions, "7BaaqLqnO9YzNLUCwSvLMY3zJ54=");
_c1 = HomeAuthActions;
var _c, _c1;
__turbopack_context__.k.register(_c, "PrimaryLink");
__turbopack_context__.k.register(_c1, "HomeAuthActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_7c78d2e4._.js.map