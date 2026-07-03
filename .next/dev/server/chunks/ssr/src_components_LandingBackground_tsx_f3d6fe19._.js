module.exports = [
"[project]/src/components/LandingBackground.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function LandingBackground() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let width, height;
        let time = 0;
        const mouse = {
            x: 0,
            y: 0,
            active: false
        };
        const init = ()=>{
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        const draw = ()=>{
            time += 0.005;
            ctx.fillStyle = '#030607';
            ctx.fillRect(0, 0, width, height);
            const rows = 40;
            const cols = 40;
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
            requestAnimationFrame(draw);
        };
        window.addEventListener('resize', init);
        window.addEventListener('mousemove', (e)=>{
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });
        window.addEventListener('mouseleave', ()=>{
            mouse.active = false;
        });
        init();
        draw();
        return ()=>{
            window.removeEventListener('resize', init);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 z-0 overflow-hidden bg-[#030607]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "absolute inset-0 block"
            }, void 0, false, {
                fileName: "[project]/src/components/LandingBackground.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent via-[#030607]/20 to-[#030607] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/LandingBackground.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LandingBackground.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_LandingBackground_tsx_f3d6fe19._.js.map