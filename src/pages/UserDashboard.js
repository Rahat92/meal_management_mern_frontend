import { useState } from "react";
import { useSelector } from "react-redux";



/* ─── SVG Icons ─── */
const Icon = ({ d, size = 22, stroke = 1.8, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={stroke}
        stroke="currentColor" width={size} height={size} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const ICONS = {
    home: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    meals: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z",
    wallet: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3",
    profile: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    bell: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
    chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
    settings: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
};

const NAV_ITEMS = [
    { key: "home", label: "Home", icon: ICONS.home },
    { key: "calendar", label: "Calendar", icon: ICONS.calendar },
    { key: "meals", label: "Meals", icon: ICONS.meals },
    { key: "wallet", label: "Wallet", icon: ICONS.wallet },
    { key: "profile", label: "Profile", icon: ICONS.profile },
];

/* ─── Tiny reusable components ─── */
function Toggle({ on, onToggle }) {
    return (
        <button
            onClick={onToggle}
            role="switch"
            aria-checked={on}
            className={`relative flex-shrink-0 rounded-full border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1
        w-10 h-[22px] ${on ? "bg-indigo-500" : "bg-slate-200"}`}
            style={{ transition: "background .22s" }}
        >
            <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm block ${on ? "translate-x-[18px]" : "translate-x-0"}`}
                style={{ transition: "transform .22s cubic-bezier(.22,.68,0,1.2)" }}
            />
        </button>
    );
}

function Card({ children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function SectionTitle({ title, action, onAction }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="fd font-extrabold text-slate-800 text-sm sm:text-base">{title}</h2>
            {action && (
                <button onClick={onAction} className="text-indigo-500 text-xs font-bold bg-transparent border-0 cursor-pointer hover:text-indigo-700 transition-colors">
                    {action} →
                </button>
            )}
        </div>
    );
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function MealHomePage() {
    const { user } = useSelector((state) => state.auth);
    console.log(user)
    /* ─── Data ─── */
    const DATA = {
        user: { name: user?.name, initials: user?.name?.slice(0,2).toUpperCase(), balance: 1240, perMeal: 85 },
        month: "February 2026",
        stats: { breakfast: 18, lunch: 22, dinner: 20, total: 60, off: 8 },
        week: [
            { day: "Mon", b: true, l: true, d: true },
            { day: "Tue", b: true, l: false, d: true },
            { day: "Wed", b: false, l: true, d: true },
            { day: "Thu", b: true, l: true, d: false },
            { day: "Fri", b: true, l: true, d: true },
            { day: "Sat", b: false, l: false, d: false },
            { day: "Sun", b: true, l: true, d: true },
        ],
        recent: [
            { date: "20", mo: "Feb", label: "Today", b: true, l: true, d: true, cost: 255 },
            { date: "19", mo: "Feb", label: "Yesterday", b: true, l: false, d: true, cost: 170 },
            { date: "18", mo: "Feb", label: "Monday", b: false, l: true, d: true, cost: 170 },
            { date: "17", mo: "Feb", label: "Sunday", b: true, l: true, d: false, cost: 170 },
            { date: "16", mo: "Feb", label: "Saturday", b: false, l: false, d: false, cost: 0 },
            { date: "15", mo: "Feb", label: "Friday", b: true, l: true, d: true, cost: 255 },
        ],
    };

    const MEALS = [
        { key: "b", full: "Breakfast", emoji: "🌤️", text: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-400", badge: "bg-amber-100", bar: "bg-amber-400", ring: "ring-amber-200", statKey: "breakfast" },
        { key: "l", full: "Lunch", emoji: "🌿", text: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-400", badge: "bg-emerald-100", bar: "bg-emerald-400", ring: "ring-emerald-200", statKey: "lunch" },
        { key: "d", full: "Dinner", emoji: "🌙", text: "text-violet-600", bg: "bg-violet-50", dot: "bg-violet-400", badge: "bg-violet-100", bar: "bg-violet-400", ring: "ring-violet-200", statKey: "dinner" },
    ];
    const [activeNav, setActiveNav] = useState("home");
    const [today, setToday] = useState({ b: true, l: true, d: false });

    const totalCost = DATA.stats.total * DATA.user.perMeal;
    const remaining = DATA.user.balance - totalCost;
    const todayCount = Object.values(today).filter(Boolean).length;
    const todayCost = todayCount * DATA.user.perMeal;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .fd { font-family: 'Outfit', sans-serif !important; }
        body, .meal-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fu { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .a1{animation:fu .38s .00s both;} .a2{animation:fu .38s .06s both;}
        .a3{animation:fu .38s .11s both;} .a4{animation:fu .38s .16s both;}
        .a5{animation:fu .38s .21s both;} .a6{animation:fu .38s .26s both;}
        .a7{animation:fu .38s .31s both;}
        .hs::-webkit-scrollbar { display:none; } .hs { scrollbar-width:none; }
        .lift { transition: transform .15s ease, box-shadow .15s ease; }
        .lift:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.1); }
        .lift:active { transform: scale(.98); }
        /* Desktop sidebar */
        @media (min-width: 1024px) {
          .sidebar-nav { display: flex !important; }
          .bottom-nav  { display: none  !important; }
          .main-layout { margin-left: 220px !important; }
        }
        @media (min-width: 1280px) {
          .main-layout { margin-left: 240px !important; }
        }
      `}</style>

            <div className="meal-root min-h-screen bg-slate-50">

                {/* ════════ DESKTOP SIDEBAR (hidden on mobile) ════════ */}
                <aside
                    className="sidebar-nav hidden fixed left-0 top-0 h-screen flex-col bg-white border-r border-slate-100 shadow-sm z-40"
                    style={{ width: 220 }}
                >
                    {/* Logo */}
                    <div className="px-6 py-6 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                                <span style={{ fontSize: 18 }}>🍽️</span>
                            </div>
                            <div>
                                <p className="fd font-extrabold text-slate-800 leading-none" style={{ fontSize: 15 }}>MealTrack</p>
                                <p className="text-slate-400 font-medium" style={{ fontSize: 10 }}>Feb 2026</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                        {NAV_ITEMS.map(({ key, label, icon }) => {
                            const active = activeNav === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveNav(key)}
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-0 cursor-pointer text-left transition-all
                    ${active ? "bg-indigo-50 text-indigo-600" : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                                >
                                    <Icon d={icon} size={18} stroke={active ? 2.2 : 1.8} />
                                    <span className={`font-semibold ${active ? "text-indigo-600" : ""}`} style={{ fontSize: 13 }}>{label}</span>
                                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User card at bottom */}
                    <div className="px-4 py-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: 11 }}>
                                {DATA.user.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-700 truncate" style={{ fontSize: 12 }}>{DATA.user.name}</p>
                                <p className="text-slate-400 font-medium" style={{ fontSize: 10 }}>Member</p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer flex-shrink-0">
                                <Icon d={ICONS.settings} size={16} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ════════ MAIN CONTENT ════════ */}
                <div className="main-layout">

                    {/* ── Desktop Top Bar ── */}
                    <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-100 px-6 xl:px-8 py-4 sticky top-0 z-30">
                        <div>
                            <p className="text-slate-400 font-semibold" style={{ fontSize: 11 }}>Good Morning 👋</p>
                            <h1 className="fd font-black text-slate-800" style={{ fontSize: 20 }}>
                                {DATA.user.name.split(" ")[0]} <span className="text-indigo-500">{DATA.user.name.split(" ")[1]}</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
                                <Icon d={ICONS.bell} size={18} />
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-400 border-2 border-white" />
                            </button>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 cursor-pointer hover:border-indigo-200 transition-all">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: 10 }}>
                                    {DATA.user.initials}
                                </div>
                                <p className="font-semibold text-slate-700" style={{ fontSize: 12 }}>{DATA.user.name}</p>
                            </div>
                        </div>
                    </header>

                    {/* ── Scrollable page body ── */}
                    <main className="px-4 sm:px-5 lg:px-6 xl:px-8 pt-6 lg:pt-7 pb-28 lg:pb-8 max-w-screen-xl mx-auto">

                        {/* ── Mobile header (hidden on lg+) ── */}
                        <div className="a1 flex items-center justify-between mb-5 lg:hidden">
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest mb-0.5" style={{ fontSize: 10 }}>Good Morning 👋</p>
                                <h1 className="fd font-black text-slate-800 leading-tight text-xl sm:text-2xl">
                                    {DATA.user.name.split(" ")[0]} <span className="text-indigo-500">{DATA.user.name.split(" ")[1]}</span>
                                </h1>
                            </div>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: 13 }}>
                                    {DATA.user.initials}
                                </div>
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-400 border-2 border-slate-50" />
                            </div>
                        </div>

                        {/* ══ DESKTOP: 2-col layout | MOBILE: stacked ══ */}
                        <div className="lg:grid lg:grid-cols-5 lg:gap-6 xl:gap-8">

                            {/* ── LEFT COLUMN (col-span-3) ── */}
                            <div className="lg:col-span-3 space-y-4 lg:space-y-5">

                                {/* Balance Card */}
                                <div
                                    className="a2 rounded-3xl overflow-hidden shadow-xl"
                                    style={{ background: "linear-gradient(140deg,#6366f1 0%,#7c3aed 55%,#a78bfa 100%)" }}
                                >
                                    <div className="p-4 sm:p-5 lg:p-6 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/[0.06]" />
                                        <div className="absolute -bottom-12 right-10 w-28 h-28 rounded-full bg-white/[0.04]" />

                                        <div className="flex items-start justify-between mb-4 sm:mb-5">
                                            <div>
                                                <p className="text-indigo-200 font-bold uppercase tracking-widest mb-1" style={{ fontSize: 9 }}>Available Balance</p>
                                                <p className="fd font-black text-white leading-none" style={{ fontSize: "clamp(32px, 8vw, 44px)" }}>
                                                    ৳{DATA.user.balance.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl px-3 py-2 text-center flex-shrink-0"
                                                style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <p className="text-indigo-200 font-bold uppercase tracking-widest" style={{ fontSize: 8 }}>Per Meal</p>
                                                <p className="fd text-white font-black text-base sm:text-lg">৳{DATA.user.perMeal}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {[
                                                { label: "Spent", val: `৳${totalCost.toLocaleString()}` },
                                                { label: "Remaining", val: `৳${remaining.toLocaleString()}` },
                                                { label: "Off Days", val: DATA.stats.off },
                                            ].map(({ label, val }) => (
                                                <div key={label} className="rounded-2xl p-2.5 sm:p-3"
                                                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                    <p className="text-indigo-200 font-bold uppercase tracking-widest mb-0.5" style={{ fontSize: 8 }}>{label}</p>
                                                    <p className="fd text-white font-bold text-xs sm:text-sm">{val}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Month selector + Meal Stats */}
                                <div className="a3">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="fd font-extrabold text-slate-800 text-sm sm:text-base">{DATA.month}</h2>
                                        <div className="flex gap-1.5">
                                            {["‹", "›"].map(c => (
                                                <button key={c} className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm cursor-pointer hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center">
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3 meal stat cards */}
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        {MEALS.map(({ key, full, emoji, text, bg, bar, ring, statKey }) => {
                                            const count = DATA.stats[statKey];
                                            const pct = Math.round(count / 28 * 100);
                                            return (
                                                <Card key={key} className={`lift p-3 sm:p-4 ring-1 ${ring}`}>
                                                    <div className={`w-8 h-8 sm:w-9 sm:h-9 ${bg} rounded-xl flex items-center justify-center mb-2 sm:mb-2.5`} style={{ fontSize: 16 }}>{emoji}</div>
                                                    <p className={`fd font-black ${text} leading-none text-2xl sm:text-3xl lg:text-4xl`}>{count}</p>
                                                    <p className="text-slate-500 font-semibold mt-0.5 text-xs">{full}</p>
                                                    <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                                                        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%`, transition: "width .5s ease" }} />
                                                    </div>
                                                    <p className="text-slate-400 mt-0.5" style={{ fontSize: 9 }}>{pct}% of month</p>
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {/* Total row */}
                                    <Card className="lift px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", fontSize: 20 }}>🍽️</div>
                                            <div>
                                                <p className="fd font-black text-slate-800 leading-none text-2xl sm:text-3xl">{DATA.stats.total}</p>
                                                <p className="text-slate-400 font-semibold text-xs">Total Meals</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="fd font-black text-indigo-600 leading-none text-lg sm:text-xl">৳{totalCost.toLocaleString()}</p>
                                            <p className="text-slate-400 font-semibold text-xs">Total Cost</p>
                                        </div>
                                    </Card>
                                </div>

                                {/* This Week */}
                                <div className="a5">
                                    <SectionTitle title="This Week" action="Full Calendar" />
                                    <div className="overflow-x-auto hs -mx-1 px-1">
                                        <div className="flex gap-2 sm:gap-2.5" style={{ minWidth: "max-content" }}>
                                            {DATA.week.map((d, i) => {
                                                const isToday = i === 4;
                                                const count = [d.b, d.l, d.d].filter(Boolean).length;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="lift flex flex-col items-center gap-1.5 cursor-pointer rounded-2xl"
                                                        style={{
                                                            padding: "10px 10px",
                                                            minWidth: 52,
                                                            background: isToday ? "linear-gradient(145deg,#6366f1,#8b5cf6)" : "#fff",
                                                            border: isToday ? "none" : "1px solid #f1f5f9",
                                                            boxShadow: isToday ? "0 8px 20px rgba(99,102,241,.28)" : "none",
                                                        }}
                                                    >
                                                        <span className="font-bold uppercase tracking-wide" style={{ fontSize: 10, color: isToday ? "#c7d2fe" : "#94a3b8" }}>
                                                            {d.day}
                                                        </span>
                                                        <div className="flex flex-col gap-1.5 items-center">
                                                            {[
                                                                { v: d.b, on: isToday ? "#fff" : "#fbbf24", off: isToday ? "rgba(255,255,255,.2)" : "#f1f5f9" },
                                                                { v: d.l, on: isToday ? "#fff" : "#34d399", off: isToday ? "rgba(255,255,255,.2)" : "#f1f5f9" },
                                                                { v: d.d, on: isToday ? "#fff" : "#a78bfa", off: isToday ? "rgba(255,255,255,.2)" : "#f1f5f9" },
                                                            ].map((m, j) => (
                                                                <span key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: m.v ? m.on : m.off, display: "block", flexShrink: 0 }} />
                                                            ))}
                                                        </div>
                                                        <span className="fd font-extrabold" style={{ fontSize: 11, color: isToday ? "#fff" : "#475569" }}>{count}/3</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Days – desktop shows full table */}
                                <div className="a6">
                                    <SectionTitle title="Recent Days" action="See All" />

                                    {/* Mobile list */}
                                    <div className="flex flex-col gap-2 lg:hidden">
                                        {DATA.recent.slice(0, 5).map(day => {
                                            const active = MEALS.filter(m => day[m.key]);
                                            const isOff = active.length === 0;
                                            return (
                                                <Card key={day.date} className="lift px-3 py-3 flex items-center gap-3">
                                                    <div className="flex-shrink-0 text-center w-9">
                                                        <p className="fd font-black text-slate-800 leading-none text-base">{day.date}</p>
                                                        <p className="text-slate-400 font-semibold" style={{ fontSize: 9 }}>{day.mo}</p>
                                                    </div>
                                                    <div className="w-px h-7 bg-slate-100 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-500 font-semibold mb-1" style={{ fontSize: 10 }}>{day.label}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {isOff ? (
                                                                <span className="bg-rose-50 text-rose-400 font-extrabold uppercase rounded-full px-2 py-0.5" style={{ fontSize: 8 }}>Off</span>
                                                            ) : active.map(m => (
                                                                <span key={m.key} className={`${m.badge} ${m.text} font-extrabold uppercase rounded-full px-2 py-0.5`} style={{ fontSize: 8 }}>
                                                                    {m.full[0]}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className={`fd font-black flex-shrink-0 text-sm ${isOff ? "text-slate-300" : "text-indigo-600"}`}>
                                                        {isOff ? "—" : `৳${day.cost}`}
                                                    </p>
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop table */}
                                    <div className="hidden lg:block">
                                        <Card className="overflow-hidden">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-slate-50">
                                                        <th className="text-left px-5 py-3 text-slate-400 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>Date</th>
                                                        <th className="text-left px-3 py-3 text-slate-400 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>Day</th>
                                                        <th className="text-center px-3 py-3 text-amber-500 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>🌤️ B</th>
                                                        <th className="text-center px-3 py-3 text-emerald-600 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>🌿 L</th>
                                                        <th className="text-center px-3 py-3 text-violet-600 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>🌙 D</th>
                                                        <th className="text-right px-5 py-3 text-slate-400 font-bold uppercase tracking-widest" style={{ fontSize: 10 }}>Cost</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {DATA.recent.map((day, idx) => {
                                                        const isOff = !day.b && !day.l && !day.d;
                                                        return (
                                                            <tr key={day.date} className={`hover:bg-slate-50/50 transition-colors ${idx === 0 ? "bg-indigo-50/30" : ""}`}>
                                                                <td className="px-5 py-3">
                                                                    <span className="fd font-black text-slate-800 text-sm">{day.mo} {day.date}</span>
                                                                </td>
                                                                <td className="px-3 py-3">
                                                                    <span className={`font-semibold text-xs px-2 py-1 rounded-full ${idx === 0 ? "bg-indigo-100 text-indigo-600" : "text-slate-500"}`}>{day.label}</span>
                                                                </td>
                                                                {["b", "l", "d"].map(k => (
                                                                    <td key={k} className="text-center px-3 py-3">
                                                                        {day[k]
                                                                            ? <span className="w-5 h-5 rounded-full inline-flex items-center justify-center bg-emerald-100 text-emerald-600">✓</span>
                                                                            : <span className="w-5 h-5 rounded-full inline-flex items-center justify-center bg-slate-100 text-slate-300">—</span>
                                                                        }
                                                                    </td>
                                                                ))}
                                                                <td className="text-right px-5 py-3">
                                                                    <span className={`fd font-black text-sm ${isOff ? "text-slate-300" : "text-indigo-600"}`}>
                                                                        {isOff ? "—" : `৳${day.cost}`}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </Card>
                                    </div>
                                </div>

                            </div>{/* /left col */}

                            {/* ── RIGHT COLUMN (col-span-2) – desktop only ── */}
                            <div className="lg:col-span-2 space-y-5">

                                {/* Today's Meals */}
                                <div className="a4">
                                    <Card className="overflow-hidden">
                                        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
                                            <div>
                                                <p className="fd font-extrabold text-slate-800 text-sm sm:text-base">Today's Meals</p>
                                                <p className="text-slate-400 font-medium text-xs">Feb 20, 2026</p>
                                            </div>
                                            <span className="bg-indigo-50 text-indigo-600 font-extrabold rounded-full px-2.5 py-1 uppercase tracking-widest" style={{ fontSize: 9 }}>
                                                {todayCount} ON
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-50">
                                            {MEALS.map(({ key, full, emoji, text, bg }) => (
                                                <div key={key} className="flex items-center justify-between px-4 sm:px-5 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 sm:w-9 sm:h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`} style={{ fontSize: 15 }}>{emoji}</div>
                                                        <p className={`font-semibold text-sm ${today[key] ? "text-slate-700" : "text-slate-400"}`}>{full}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {today[key] && <span className={`font-bold text-xs ${text}`}>৳{DATA.user.perMeal}</span>}
                                                        <Toggle on={today[key]} onToggle={() => setToday(p => ({ ...p, [key]: !p[key] }))} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 mt-2 rounded-2xl bg-slate-50 px-3 py-2.5 flex items-center justify-between">
                                            <p className="text-slate-500 font-semibold text-xs">Today's total</p>
                                            <p className="fd font-bold text-indigo-600 text-base sm:text-lg">৳{todayCost}</p>
                                        </div>
                                    </Card>
                                </div>

                                {/* Quick Stats – desktop only */}
                                <div className="a5 hidden lg:block">
                                    <SectionTitle title="Quick Stats" />
                                    <Card className="p-5 space-y-3">
                                        {[
                                            { label: "Avg meals/day", val: (DATA.stats.total / 20).toFixed(1), icon: "📊", color: "text-indigo-600" },
                                            { label: "Most active meal", val: "Lunch", icon: "🏆", color: "text-emerald-600" },
                                            { label: "Cost per day", val: `৳${(totalCost / 20).toFixed(0)}`, icon: "💰", color: "text-amber-600" },
                                            { label: "Days remaining", val: "8", icon: "📅", color: "text-violet-600" },
                                        ].map(({ label, val, icon, color }) => (
                                            <div key={label} className="flex items-center justify-between py-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span style={{ fontSize: 16 }}>{icon}</span>
                                                    <p className="text-slate-600 font-medium text-xs">{label}</p>
                                                </div>
                                                <p className={`fd font-extrabold text-sm ${color}`}>{val}</p>
                                            </div>
                                        ))}
                                    </Card>
                                </div>

                                {/* Monthly Progress – desktop only */}
                                <div className="a6 hidden lg:block">
                                    <SectionTitle title="Monthly Progress" />
                                    <Card className="p-5">
                                        <div className="flex items-end justify-between mb-3">
                                            <div>
                                                <p className="text-slate-400 font-semibold text-xs">Meals completed</p>
                                                <p className="fd font-black text-slate-800 text-3xl leading-none">{DATA.stats.total}<span className="text-slate-300 text-lg">/84</span></p>
                                            </div>
                                            <p className="fd font-black text-indigo-500 text-xl">{Math.round(DATA.stats.total / 84 * 100)}%</p>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-4">
                                            <div className="h-full rounded-full" style={{ width: `${Math.round(DATA.stats.total / 84 * 100)}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)", transition: "width .8s ease" }} />
                                        </div>
                                        <div className="space-y-2.5">
                                            {MEALS.map(({ full, bar, statKey }) => {
                                                const count = DATA.stats[statKey];
                                                const pct = Math.round(count / 28 * 100);
                                                return (
                                                    <div key={statKey}>
                                                        <div className="flex justify-between mb-1">
                                                            <p className="text-slate-500 font-semibold" style={{ fontSize: 11 }}>{full}</p>
                                                            <p className="text-slate-400 font-bold" style={{ fontSize: 11 }}>{count}/28</p>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                            <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%`, transition: "width .6s ease" }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </div>

                            </div>{/* /right col */}

                        </div>{/* /grid */}
                    </main>
                </div>{/* /main-layout */}

                {/* ════════ MOBILE BOTTOM NAV ════════ */}
                <nav
                    className="bottom-nav fixed bottom-0 z-50 w-full flex border-t border-slate-100"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                    }}
                >
                    {NAV_ITEMS.map(({ key, label, icon }) => {
                        const active = activeNav === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveNav(key)}
                                className="flex-1 flex flex-col items-center gap-0.5 border-0 cursor-pointer"
                                style={{
                                    paddingTop: 10,
                                    paddingBottom: "max(18px, env(safe-area-inset-bottom, 18px))",
                                    background: active ? "rgba(99,102,241,0.06)" : "transparent",
                                    color: active ? "#6366f1" : "#94a3b8",
                                    transition: "color .15s",
                                }}
                            >
                                <Icon d={icon} size={20} stroke={active ? 2.2 : 1.8} />
                                <span className="font-bold uppercase tracking-widest" style={{ fontSize: 8 }}>{label}</span>
                            </button>
                        );
                    })}
                </nav>

            </div>
        </>
    );
}