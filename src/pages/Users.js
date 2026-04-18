// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useGetUsersQuery } from '../features/bikri/bikriApi';
// import { useDispatch, useSelector } from "react-redux";
// import { locationPathChanged } from '../features/locationPath';

// /* ── Google Fonts injected once ── */
// const FontLoader = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=DM+Sans:wght@300;400;500;600&display=swap');
//     *, *::before, *::after { box-sizing: border-box; }
//     body { margin: 0; background: #F7F5F0; }
//     :root {
//       --font-display: 'Fraunces', serif;
//       --font-body: 'DM Sans', sans-serif;
//       --font-mono: 'DM Mono', monospace;
//     }
//     .font-display { font-family: var(--font-display); }
//     .font-body    { font-family: var(--font-body); }
//     .font-mono    { font-family: var(--font-mono); }

//     .card-enter { animation: cardIn 0.22s cubic-bezier(0.34,1.4,0.64,1) both; }
//     @keyframes cardIn {
//       from { opacity: 0; transform: translateY(6px) scale(0.99); }
//       to   { opacity: 1; transform: none; }
//     }
//     .modal-enter { animation: modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both; }
//     @keyframes modalIn {
//       from { opacity: 0; transform: translateY(12px) scale(0.97); }
//       to   { opacity: 1; transform: none; }
//     }
//     .slide-up { animation: slideUp 0.32s cubic-bezier(0.34,1.2,0.64,1) both; }
//     @keyframes slideUp {
//       from { opacity: 0; transform: translateY(100%); }
//       to   { opacity: 1; transform: none; }
//     }

//     select, input { font-family: var(--font-body); }
//     button { font-family: var(--font-body); }

//     input:focus, select:focus { outline: none; }

//     .btn-ghost {
//       transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
//     }
//     .btn-ghost:hover:not(:disabled) { background: #EEEBE3; transform: translateY(-1px); }
//     .btn-ghost:active:not(:disabled) { transform: translateY(0); }

//     .card-hover {
//       transition: box-shadow 0.18s, transform 0.18s;
//     }
//     .card-hover:hover {
//       box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//       transform: translateY(-1px);
//     }

//     /* Custom scrollbar */
//     ::-webkit-scrollbar { width: 6px; }
//     ::-webkit-scrollbar-track { background: transparent; }
//     ::-webkit-scrollbar-thumb { background: #D5CFC3; border-radius: 3px; }
//   `}</style>
// );

// /* ── Data ── */
// const INITIAL_USERS = [
//   { _id: "69577c3fc8fcddb5e936a789", active: true, name: "Rahat", role: "user", email: "rahat@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "69577d7fc8fcddb5e936a78e", active: true, name: "Sweety", role: "admin", email: "sweety@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "69577e1fc8fcddb5e936a791", active: false, name: "Arif", role: "user", email: "arif@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "69577f2ac8fcddb5e936a792", active: true, name: "Mitu", role: "moderator", email: "mitu@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "695780abc8fcddb5e936a793", active: true, name: "Rafi", role: "user", email: "rafi@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "695781bcc8fcddb5e936a794", active: false, name: "Nadia", role: "user", email: "nadia@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "695782cdc8fcddb5e936a795", active: true, name: "Karim", role: "admin", email: "karim@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "695783edc8fcddb5e936a796", active: true, name: "Tania", role: "moderator", email: "tania@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "695784fec8fcddb5e936a797", active: false, name: "Sabbir", role: "user", email: "sabbir@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "6957850fc8fcddb5e936a798", active: true, name: "Puja", role: "user", email: "puja@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "6957861ac8fcddb5e936a799", active: true, name: "Hasan", role: "admin", email: "hasan@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
//   { _id: "6957872bc8fcddb5e936a800", active: false, name: "Sharmin", role: "user", email: "sharmin@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
// ];

// /* ── Breakpoint hook ── */
// function useBreakpoint() {
//   const get = () => {
//     if (typeof window === "undefined") return "md";
//     const w = window.innerWidth;
//     if (w < 480) return "xs";
//     if (w < 768) return "sm";
//     if (w < 1024) return "md";
//     if (w < 1280) return "lg";
//     return "xl";
//   };
//   const [bp, setBp] = useState(get);
//   useEffect(() => {
//     const h = () => setBp(get());
//     window.addEventListener("resize", h);
//     return () => window.removeEventListener("resize", h);
//   }, []);
//   return bp;
// }

// /* ── Role config ── */
// const ROLE = {
//   admin: { avatar: "bg-sky-100 text-sky-800", badge: "bg-sky-100 text-sky-800 border-sky-200", dot: "bg-sky-500" },
//   moderator: { avatar: "bg-violet-100 text-violet-800", badge: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500" },
//   user: { avatar: "bg-stone-100 text-stone-600", badge: "bg-stone-100 text-stone-600 border-stone-200", dot: "bg-stone-400" },
// };

// const initials = (n) => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

// /* ── Avatar ── */
// function Avatar({ name, role, size = "md" }) {
//   const sz = size === "sm" ? "w-9 h-9 text-xs" : size === "lg" ? "w-12 h-12 text-sm" : "w-10 h-10 text-xs";
//   const r = ROLE[role] || ROLE.user;
//   return (
//     <div className={`${sz} ${r.avatar} rounded-full flex items-center justify-center font-mono font-medium shrink-0 tracking-wide`}>
//       {initials(name)}
//     </div>
//   );
// }

// /* ── RoleBadge ── */
// function RoleBadge({ role }) {
//   const r = ROLE[role] || ROLE.user;
//   return (
//     <span className={`${r.badge} font-body text-[11px] font-medium px-2 py-0.5 rounded-md border`}>
//       {role}
//     </span>
//   );
// }

// /* ── StatusBadge ── */
// function StatusBadge({ active }) {
//   return (
//     <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border font-body ${active
//       ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//       : "bg-red-50 text-red-600 border-red-200"
//       }`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
//       {active ? "active" : "inactive"}
//     </span>
//   );
// }

// /* ── StatCard ── */
// function StatCard({ label, value, accent }) {
//   return (
//     <div className="bg-white border border-stone-200/70 rounded-xl p-4 card-hover">
//       <p className="font-body text-xs text-stone-400 uppercase tracking-widest mb-1.5">{label}</p>
//       <p className={`font-display text-3xl font-light ${accent || "text-stone-800"}`}>{value}</p>
//     </div>
//   );
// }

// /* ── UserCard ── */
// function UserCard({ user, onEdit, compact }) {
//   const isAdmin = user.role === "admin";
//   const isSelf = user.manager === user._id;

//   return (
//     <div
//       className={`bg-white rounded-xl card-hover card-enter border transition-all ${isAdmin
//         ? "border-sky-300 shadow-sky-100 shadow-sm"
//         : "border-stone-200/80"
//         }`}
//     >
//       <div className={`flex items-start gap-3 ${compact ? "p-4" : "p-5"}`}>
//         <Avatar name={user.name} role={user.role} size={compact ? "sm" : "md"} />

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 flex-wrap mb-1">
//             <span className={`font-body font-semibold text-stone-800 ${compact ? "text-sm" : "text-[15px]"}`}>
//               {user.name}
//             </span>
//             <RoleBadge role={user.role} />
//             <StatusBadge active={user.active} />
//           </div>
//           <p className="font-body text-xs text-stone-400 truncate">{user.email}</p>

//           {/* Wide: show meta inline */}
//           {!compact && (
//             <div className="flex flex-wrap gap-x-6 mt-2">
//               <span className="font-mono text-[10px] text-stone-300">
//                 <span className="text-stone-400">id </span>{user._id.slice(0, 18)}…
//               </span>
//               <span className="font-mono text-[10px] text-stone-300">
//                 <span className="text-stone-400">mgr </span>{user.manager.slice(0, 18)}…{isSelf && <span className="text-stone-300"> (self)</span>}
//               </span>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={() => onEdit(user)}
//           className="btn-ghost shrink-0 font-body text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 bg-transparent cursor-pointer"
//         >
//           Edit
//         </button>
//       </div>

//       {/* Compact meta row */}
//       {compact && (
//         <div className="border-t border-stone-100 mx-4 pb-3 pt-2.5 flex gap-6">
//           <div>
//             <p className="font-body text-[10px] text-stone-300 uppercase tracking-widest mb-0.5">ID</p>
//             <p className="font-mono text-[10px] text-stone-400">{user._id.slice(0, 16)}…</p>
//           </div>
//           <div>
//             <p className="font-body text-[10px] text-stone-300 uppercase tracking-widest mb-0.5">Manager</p>
//             <p className="font-mono text-[10px] text-stone-400">
//               {user.manager.slice(0, 16)}…{isSelf && <span className="text-stone-300"> (self)</span>}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── Field ── */
// function Field({ label, children }) {
//   return (
//     <div>
//       <label className="font-body text-[11px] text-stone-400 uppercase tracking-widest block mb-1.5">{label}</label>
//       {children}
//     </div>
//   );
// }

// const inputCls = "font-body w-full h-9 px-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-lg focus:border-sky-400 focus:bg-white transition-colors";

// /* ── EditModal ── */
// function EditModal({ user, onSave, onClose, isXs }) {
//   const [form, setForm] = useState({ ...user });
//   const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex"
//       style={{
//         background: "rgba(15,15,10,0.45)",
//         backdropFilter: "blur(2px)",
//         alignItems: isXs ? "flex-end" : "center",
//         justifyContent: "center",
//         padding: isXs ? 0 : "1rem",
//       }}
//       onClick={e => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         className={`bg-white w-full shadow-2xl ${isXs ? "rounded-t-2xl slide-up" : "rounded-2xl modal-enter max-w-md"}`}
//         style={{ maxHeight: "90vh", overflowY: "auto" }}
//       >
//         {isXs && (
//           <div className="flex justify-center pt-3 pb-1">
//             <div className="w-8 h-1 bg-stone-200 rounded-full" />
//           </div>
//         )}

//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <Avatar name={user.name} role={user.role} size="md" />
//               <div>
//                 <h2 className="font-display font-medium text-stone-800 text-base leading-tight">Edit user</h2>
//                 <p className="font-mono text-[11px] text-stone-400 mt-0.5">{user.email}</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 bg-transparent cursor-pointer text-lg leading-none"
//             >
//               ×
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="h-px bg-stone-100 mb-5" />

//           {/* Fields */}
//           <div className={`grid gap-4 ${isXs ? "grid-cols-1" : "grid-cols-2"}`}>
//             <Field label="Name">
//               <input type="text" value={form.name} onChange={set("name")} className={inputCls} />
//             </Field>
//             <Field label="Email">
//               <input type="email" value={form.email} onChange={set("email")} className={inputCls} />
//             </Field>
//             <Field label="Role">
//               <select value={form.role} onChange={set("role")} className={inputCls}>
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//                 <option value="moderator">Moderator</option>
//               </select>
//             </Field>
//             <Field label="Status">
//               <select
//                 value={form.active ? "true" : "false"}
//                 onChange={e => setForm(f => ({ ...f, active: e.target.value === "true" }))}
//                 className={inputCls}
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </Field>
//           </div>

//           {/* Actions */}
//           <div className={`flex gap-2 mt-6 ${isXs ? "flex-col" : "justify-end"}`}>
//             <button
//               onClick={onClose}
//               className={`btn-ghost font-body text-sm font-medium px-4 py-2 rounded-lg border border-stone-200 text-stone-500 bg-transparent cursor-pointer ${isXs ? "w-full py-2.5" : ""}`}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onSave(form)}
//               className={`btn-ghost font-body text-sm font-medium px-4 py-2 rounded-lg border border-sky-300 text-sky-700 bg-sky-50 cursor-pointer ${isXs ? "w-full py-2.5" : ""}`}
//             >
//               Save changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Pagination ── */
// function Pagination({ page, pages, onPage, isXs }) {
//   const visible = useMemo(() => {
//     if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
//     const delta = isXs ? 1 : 2;
//     const range = [];
//     for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) range.push(i);
//     if (range[0] > 2) { range.unshift("…l"); range.unshift(1); }
//     else if (range[0] > 1) range.unshift(1);
//     if (range[range.length - 1] < pages - 1) { range.push("…r"); range.push(pages); }
//     else if (range[range.length - 1] < pages) range.push(pages);
//     return range;
//   }, [page, pages, isXs]);

//   const pgCls = (active, disabled) =>
//     `w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-body transition-all ${active
//       ? "border-sky-300 bg-sky-50 text-sky-700 font-medium"
//       : disabled
//         ? "border-stone-100 text-stone-300 cursor-not-allowed"
//         : "border-stone-200 text-stone-500 cursor-pointer hover:bg-stone-50 hover:border-stone-300"
//     }`;

//   return (
//     <div className="flex items-center gap-1">
//       <button disabled={page <= 1} onClick={() => onPage(page - 1)} className={pgCls(false, page <= 1)}>‹</button>
//       {visible.map((p, i) =>
//         typeof p === "string"
//           ? <span key={p + i} className="text-stone-300 text-xs px-0.5">…</span>
//           : <button key={p} onClick={() => onPage(p)} className={pgCls(p === page, false)}>{p}</button>
//       )}
//       <button disabled={page >= pages} onClick={() => onPage(page + 1)} className={pgCls(false, page >= pages)}>›</button>
//     </div>
//   );
// }

// /* ── FilterBar ── */
// function FilterBar({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter, limit, setLimit, bp, onReset }) {
//   const isXs = bp === "xs";
//   const isSm = bp === "sm";

//   const selCls = `${inputCls} w-auto`;

//   return (
//     <div className={`grid gap-2 mb-5 ${isXs ? "grid-cols-1" : isSm ? "grid-cols-2" : "grid-cols-[1fr_auto_auto_auto]"}`}>
//       <div className="relative">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none">⌕</span>
//         <input
//           type="text"
//           placeholder="Search by name or email…"
//           value={search}
//           onChange={e => { setSearch(e.target.value); onReset(); }}
//           className={`${inputCls} pl-8 ${isSm ? "col-span-2" : ""}`}
//           style={isSm ? { gridColumn: "1 / -1" } : undefined}
//         />
//       </div>
//       <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
//         <option value="all">All roles</option>
//         <option value="admin">Admin</option>
//         <option value="moderator">Moderator</option>
//         <option value="user">User</option>
//       </select>
//       <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
//         <option value="all">All status</option>
//         <option value="active">Active</option>
//         <option value="inactive">Inactive</option>
//       </select>
//       <select value={limit} onChange={e => { setLimit(Number(e.target.value)); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
//         <option value={3}>3 / page</option>
//         <option value={5}>5 / page</option>
//         <option value={10}>10 / page</option>
//         <option value={20}>20 / page</option>
//       </select>
//     </div>
//   );
// }

// /* ── Main ── */
// export default function UserManagement() {
//   const bp = useBreakpoint();
//   const isXs = bp === "xs";
//   const isSm = bp === "sm";
//   const dispatch = useDispatch();
//   const { user } = useSelector(state => state.auth);
//   console.log(user);
//   const { data: currentUsers } = useGetUsersQuery({ managerId: user?.role === "admin" ? user.id : user?.manager?.id });
//   console.log(currentUsers);
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatus] = useState("all");
//   const [limit, setLimit] = useState(5);
//   const [page, setPage] = useState(1);
//   const [editUser, setEditUser] = useState(null);

//   useEffect(() => {
//     if(currentUsers?.data?.users) {
//       setUsers(currentUsers.data.users);
//     }
//   }, [currentUsers]);

//   useEffect(() => {
//         dispatch(locationPathChanged(window.location.pathname));
//     }, []);
//   const filtered = useMemo(() =>
//     users.filter(u => {
//       const q = search.toLowerCase();
//       return (
//         (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
//         (roleFilter === "all" || u.role === roleFilter) &&
//         (statusFilter === "all" || (statusFilter === "active" ? u.active : !u.active))
//       );
//     }),
//     [users, search, roleFilter, statusFilter]
//   );

//   const pages = Math.max(1, Math.ceil(filtered.length / limit));
//   const safePage = Math.min(page, pages);
//   const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

//   const resetPage = useCallback(() => setPage(1), []);
//   const goPage = p => setPage(Math.max(1, Math.min(p, pages)));

//   const handleSave = updated => {
//     setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
//     setEditUser(null);
//   };

//   const compact = isXs || isSm || bp === "md";
//   const twoCol = bp === "xl";
//   const maxW = { xs: "100%", sm: "100%", md: "760px", lg: "960px", xl: "1200px" }[bp];
//   const outerPad = isXs ? "1rem" : isSm ? "1.25rem 1.5rem" : "2rem 2.5rem";

//   return (
//     <>
//       <FontLoader />
//       <div
//         className="font-body min-h-screen"
//         style={{ background: "#F7F5F0", padding: outerPad, maxWidth: maxW, margin: "0 auto", width: "100%" }}
//       >
//         {/* ── Header ── */}
//         <div className="flex items-start justify-between mb-6 gap-3">
//           <div>
//             <p className="font-mono text-[11px] text-stone-400 mb-1 tracking-widest">GET /api/users</p>
//             <h1 className={`font-display font-light text-stone-800 leading-tight ${isXs ? "text-2xl" : "text-4xl"}`}>
//               User management
//             </h1>
//             {!isXs && (
//               <p className="font-body text-sm text-stone-400 mt-1.5">
//                 {users.length} total · {users.filter(u => u.active).length} active · {users.filter(u => u.role === "admin").length} admins
//               </p>
//             )}
//           </div>
//           <span className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-1">
//             200 OK
//           </span>
//         </div>

//         {/* ── Stats ── */}
//         <div className={`grid gap-3 mb-6 ${isXs ? "grid-cols-2" : "grid-cols-3"}`}>
//           <StatCard label="Total users" value={users.length} />
//           <StatCard label="Active" value={users.filter(u => u.active).length} accent="text-emerald-700" />
//           {!isXs && <StatCard label="Admins" value={users.filter(u => u.role === "admin").length} accent="text-sky-700" />}
//         </div>

//         {/* ── Filters ── */}
//         <FilterBar
//           search={search} setSearch={setSearch}
//           roleFilter={roleFilter} setRoleFilter={setRoleFilter}
//           statusFilter={statusFilter} setStatusFilter={setStatus}
//           limit={limit} setLimit={setLimit}
//           bp={bp} onReset={resetPage}
//         />

//         {/* ── Cards ── */}
//         {paginated.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-stone-300">
//             <span className="text-5xl mb-4">◌</span>
//             <p className="font-body text-sm">No users match your filters.</p>
//           </div>
//         ) : (
//           <div className={`grid gap-3 ${twoCol ? "grid-cols-2" : "grid-cols-1"}`}>
//             {paginated.map(u => (
//               <UserCard key={u._id} user={u} onEdit={setEditUser} compact={compact} />
//             ))}
//           </div>
//         )}

//         {/* ── Footer ── */}
//         <div className="flex items-center justify-between flex-wrap gap-3 mt-5 pt-5 border-t border-stone-200/80">
//           <p className="font-body text-xs text-stone-400">
//             Showing <span className="text-stone-600 font-medium">{paginated.length}</span> of{" "}
//             <span className="text-stone-600 font-medium">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
//           </p>
//           <Pagination page={safePage} pages={pages} onPage={goPage} isXs={isXs} />
//         </div>
//       </div>

//       {/* ── Modal ── */}
//       {editUser && (
//         <EditModal
//           user={editUser}
//           onSave={handleSave}
//           onClose={() => setEditUser(null)}
//           isXs={isXs}
//         />
//       )}
//     </>
//   );
// }



import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery } from '../features/bikri/bikriApi';
import { locationPathChanged } from '../features/locationPath';
import { useAddUserToAdvanceSheetMutation } from "../features/advance-sheet/advanceSheetApi";

/* ── Google Fonts injected once ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; background: #F7F5F0; }
    :root {
      --font-display: 'Fraunces', serif;
      --font-body: 'DM Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }
    .font-display { font-family: var(--font-display); }
    .font-body    { font-family: var(--font-body); }
    .font-mono    { font-family: var(--font-mono); }

    .card-enter { animation: cardIn 0.22s cubic-bezier(0.34,1.4,0.64,1) both; }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(6px) scale(0.99); }
      to   { opacity: 1; transform: none; }
    }
    .modal-enter { animation: modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both; }
    @keyframes modalIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }
    .slide-up { animation: slideUp 0.32s cubic-bezier(0.34,1.2,0.64,1) both; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: none; }
    }

    select, input { font-family: var(--font-body); }
    button { font-family: var(--font-body); }

    input:focus, select:focus { outline: none; }

    .btn-ghost {
      transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
    }
    .btn-ghost:hover:not(:disabled) { background: #EEEBE3; transform: translateY(-1px); }
    .btn-ghost:active:not(:disabled) { transform: translateY(0); }

    .card-hover {
      transition: box-shadow 0.18s, transform 0.18s;
    }
    .card-hover:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transform: translateY(-1px);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D5CFC3; border-radius: 3px; }

    .menu-enter { animation: menuIn 0.15s cubic-bezier(0.34,1.4,0.64,1) both; }
    @keyframes menuIn {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to   { opacity: 1; transform: none; }
    }

    .toast-enter { animation: toastIn 0.3s cubic-bezier(0.34,1.3,0.64,1) both; }
    @keyframes toastIn {
      from { opacity: 0; transform:translateX(-50%) translateY(-100px) scale(0.96); }
      to   { opacity: 1; transform:translateX(-50%) translateY(0) scale(1); }
    }
    .toast-exit { animation: toastOut 0.2s ease-in forwards; }
    @keyframes toastOut {
      to { opacity: 0; transform:translateX(-50%) translateY(8px); }
    }

    .action-btn:hover { background: #F0EDE6; }
    .menu-item:hover  { background: #F7F5F0; }
    .menu-item-danger:hover { background: #FEF2F2; color: #B91C1C; }
  `}</style>
);

/* ── Data ── */
const INITIAL_USERS = [
  { _id: "69577c3fc8fcddb5e936a789", active: true, name: "Rahat", role: "user", email: "rahat@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577d7fc8fcddb5e936a78e", active: true, name: "Sweety", role: "admin", email: "sweety@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577e1fc8fcddb5e936a791", active: false, name: "Arif", role: "user", email: "arif@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577f2ac8fcddb5e936a792", active: true, name: "Mitu", role: "moderator", email: "mitu@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695780abc8fcddb5e936a793", active: true, name: "Rafi", role: "user", email: "rafi@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695781bcc8fcddb5e936a794", active: false, name: "Nadia", role: "user", email: "nadia@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695782cdc8fcddb5e936a795", active: true, name: "Karim", role: "admin", email: "karim@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695783edc8fcddb5e936a796", active: true, name: "Tania", role: "moderator", email: "tania@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695784fec8fcddb5e936a797", active: false, name: "Sabbir", role: "user", email: "sabbir@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957850fc8fcddb5e936a798", active: true, name: "Puja", role: "user", email: "puja@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957861ac8fcddb5e936a799", active: true, name: "Hasan", role: "admin", email: "hasan@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957872bc8fcddb5e936a800", active: false, name: "Sharmin", role: "user", email: "sharmin@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
];

/* ── Breakpoint hook ── */
function useBreakpoint() {
  const get = () => {
    if (typeof window === "undefined") return "md";
    const w = window.innerWidth;
    if (w < 480) return "xs";
    if (w < 768) return "sm";
    if (w < 1024) return "md";
    if (w < 1280) return "lg";
    return "xl";
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

/* ── Role config ── */
const ROLE = {
  admin: { avatar: "bg-sky-100 text-sky-800", badge: "bg-sky-100 text-sky-800 border-sky-200", dot: "bg-sky-500" },
  moderator: { avatar: "bg-violet-100 text-violet-800", badge: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500" },
  user: { avatar: "bg-stone-100 text-stone-600", badge: "bg-stone-100 text-stone-600 border-stone-200", dot: "bg-stone-400" },
};

const initials = (n) => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

/* ── Avatar ── */
function Avatar({ name, role, size = "md" }) {
  const sz = size === "sm" ? "w-9 h-9 text-xs" : size === "lg" ? "w-12 h-12 text-sm" : "w-10 h-10 text-xs";
  const r = ROLE[role] || ROLE.user;
  return (
    <div className={`${sz} ${r.avatar} rounded-full flex items-center justify-center font-mono font-medium shrink-0 tracking-wide`}>
      {initials(name)}
    </div>
  );
}

/* ── RoleBadge ── */
function RoleBadge({ role }) {
  const r = ROLE[role] || ROLE.user;
  return (
    <span className={`${r.badge} font-body text-[11px] font-medium px-2 py-0.5 rounded-md border`}>
      {role}
    </span>
  );
}

/* ── StatusBadge ── */
function StatusBadge({ active }) {
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border font-body ${active
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-600 border-red-200"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
      {active ? "active" : "inactive"}
    </span>
  );
}

/* ── StatCard ── */
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-stone-200/70 rounded-xl p-4 card-hover">
      <p className="font-body text-xs text-stone-400 uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`font-display text-3xl font-light ${accent || "text-stone-800"}`}>{value}</p>
    </div>
  );
}

/* ── ActionMenu (⋯ dropdown) ── */
function ActionMenu({ user, onAddToSheet, onToggleActive, open, setOpen }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const menuItemCls = "menu-item w-full flex items-center gap-2.5 px-3 py-2 text-left font-body text-sm text-stone-600 rounded-lg cursor-pointer transition-colors";
  const dangerCls = "menu-item menu-item-danger w-full flex items-center gap-2.5 px-3 py-2 text-left font-body text-sm text-red-500 rounded-lg cursor-pointer transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`action-btn w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 bg-transparent cursor-pointer transition-colors text-base leading-none ${open ? "bg-stone-100 border-stone-300" : ""}`}
        title="More actions"
      >
        ⋯
      </button>

      {open && (
        <div
          className="menu-enter absolute right-0 top-9 z-30 bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 min-w-[168px]"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
        >
          <button
            className={menuItemCls}
            onClick={() => { onAddToSheet(user); setOpen(false); }}
          >
            <span className="text-emerald-500">⊞</span>
            Add to sheet
          </button>

          <div className="h-px bg-stone-100 my-1" />

          <button
            className={dangerCls}
            onClick={() => { onToggleActive(user); setOpen(false); }}
          >
            <span>{user.active ? "⊘" : "⊕"}</span>
            {user.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── UserCard ── */
function UserCard({ user, onEdit, onAddToSheet, onToggleActive, compact }) {
  const isAdmin = user.role === "admin";
  const isSelf = user.manager === user._id;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl card-hover card-enter border transition-all relative ${isAdmin ? "border-sky-300 shadow-sky-100 shadow-sm" : "border-stone-200/80"
        }`}
      style={{ zIndex: menuOpen ? 10 : undefined }}
    >
      <div className={`flex items-start gap-3 ${compact ? "p-4" : "p-5"}`}>
        <Avatar name={user.name} role={user.role} size={compact ? "sm" : "md"} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`font-body font-semibold text-stone-800 ${compact ? "text-sm" : "text-[15px]"}`}>
              {user.name}
            </span>
            <RoleBadge role={user.role} />
            <StatusBadge active={user.active} />
          </div>
          <p className="font-body text-xs text-stone-400 truncate">{user.email}</p>

          {!compact && (
            <div className="flex flex-wrap gap-x-6 mt-2">
              <span className="font-mono text-[10px] text-stone-300">
                <span className="text-stone-400">id </span>{user._id.slice(0, 18)}…
              </span>
              <span className="font-mono text-[10px] text-stone-300">
                <span className="text-stone-400">mgr </span>{user.manager.slice(0, 18)}…{isSelf && <span className="text-stone-300"> (self)</span>}
              </span>
            </div>
          )}
        </div>

        {/* ── Action group ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(user)}
            className="action-btn font-body text-xs font-medium px-3 h-7 rounded-lg border border-stone-200 text-stone-500 bg-transparent cursor-pointer transition-colors whitespace-nowrap"
          >
            Edit
          </button>
          <ActionMenu user={user} onAddToSheet={onAddToSheet} onToggleActive={onToggleActive} open={menuOpen} setOpen={setMenuOpen} />
        </div>
      </div>

      {compact && (
        <div className="border-t border-stone-100 mx-4 pb-3 pt-2.5 flex gap-6">
          <div>
            <p className="font-body text-[10px] text-stone-300 uppercase tracking-widest mb-0.5">ID</p>
            <p className="font-mono text-[10px] text-stone-400">{user._id.slice(0, 16)}…</p>
          </div>
          <div>
            <p className="font-body text-[10px] text-stone-300 uppercase tracking-widest mb-0.5">Manager</p>
            <p className="font-mono text-[10px] text-stone-400">
              {user.manager.slice(0, 16)}…{isSelf && <span className="text-stone-300"> (self)</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Field ── */
function Field({ label, children }) {
  return (
    <div>
      <label className="font-body text-[11px] text-stone-400 uppercase tracking-widest block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "font-body w-full h-9 px-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-lg focus:border-sky-400 focus:bg-white transition-colors";

/* ── EditModal ── */
function EditModal({ user, onSave, onClose, isXs }) {
  const [form, setForm] = useState({ ...user });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{
        background: "rgba(15,15,10,0.45)",
        backdropFilter: "blur(2px)",
        alignItems: isXs ? "flex-end" : "center",
        justifyContent: "center",
        padding: isXs ? 0 : "1rem",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white w-full shadow-2xl ${isXs ? "rounded-t-2xl slide-up" : "rounded-2xl modal-enter max-w-md"}`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {isXs && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 bg-stone-200 rounded-full" />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} role={user.role} size="md" />
              <div>
                <h2 className="font-display font-medium text-stone-800 text-base leading-tight">Edit user</h2>
                <p className="font-mono text-[11px] text-stone-400 mt-0.5">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 bg-transparent cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 mb-5" />

          {/* Fields */}
          <div className={`grid gap-4 ${isXs ? "grid-cols-1" : "grid-cols-2"}`}>
            <Field label="Name">
              <input type="text" value={form.name} onChange={set("name")} className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set("email")} className={inputCls} />
            </Field>
            <Field label="Role">
              <select value={form.role} onChange={set("role")} className={inputCls}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.active ? "true" : "false"}
                onChange={e => setForm(f => ({ ...f, active: e.target.value === "true" }))}
                className={inputCls}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>
          </div>

          {/* Actions */}
          <div className={`flex gap-2 mt-6 ${isXs ? "flex-col" : "justify-end"}`}>
            <button
              onClick={onClose}
              className={`btn-ghost font-body text-sm font-medium px-4 py-2 rounded-lg border border-stone-200 text-stone-500 bg-transparent cursor-pointer ${isXs ? "w-full py-2.5" : ""}`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className={`btn-ghost font-body text-sm font-medium px-4 py-2 rounded-lg border border-sky-300 text-sky-700 bg-sky-50 cursor-pointer ${isXs ? "w-full py-2.5" : ""}`}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ page, pages, onPage, isXs }) {
  const visible = useMemo(() => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const delta = isXs ? 1 : 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) range.push(i);
    if (range[0] > 2) { range.unshift("…l"); range.unshift(1); }
    else if (range[0] > 1) range.unshift(1);
    if (range[range.length - 1] < pages - 1) { range.push("…r"); range.push(pages); }
    else if (range[range.length - 1] < pages) range.push(pages);
    return range;
  }, [page, pages, isXs]);

  const pgCls = (active, disabled) =>
    `w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-body transition-all ${active
      ? "border-sky-300 bg-sky-50 text-sky-700 font-medium"
      : disabled
        ? "border-stone-100 text-stone-300 cursor-not-allowed"
        : "border-stone-200 text-stone-500 cursor-pointer hover:bg-stone-50 hover:border-stone-300"
    }`;

  return (
    <div className="flex items-center gap-1">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className={pgCls(false, page <= 1)}>‹</button>
      {visible.map((p, i) =>
        typeof p === "string"
          ? <span key={p + i} className="text-stone-300 text-xs px-0.5">…</span>
          : <button key={p} onClick={() => onPage(p)} className={pgCls(p === page, false)}>{p}</button>
      )}
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className={pgCls(false, page >= pages)}>›</button>
    </div>
  );
}

/* ── FilterBar ── */
function FilterBar({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter, limit, setLimit, bp, onReset }) {
  const isXs = bp === "xs";
  const isSm = bp === "sm";

  const selCls = `${inputCls} w-auto`;

  return (
    <div className={`grid gap-2 mb-5 ${isXs ? "grid-cols-1" : isSm ? "grid-cols-2" : "grid-cols-[1fr_auto_auto_auto]"}`}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none">⌕</span>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); onReset(); }}
          className={`${inputCls} pl-8 ${isSm ? "col-span-2" : ""}`}
          style={isSm ? { gridColumn: "1 / -1" } : undefined}
        />
      </div>
      <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
        <option value="all">All roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select value={limit} onChange={e => { setLimit(Number(e.target.value)); onReset(); }} className={`${selCls} ${isXs ? "w-full" : ""}`}>
        <option value={3}>3 / page</option>
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
      </select>
    </div>
  );
}

/* ── Main ── */
export default function UserManagement() {
  const bp = useBreakpoint();
  const isXs = bp === "xs";
  const isSm = bp === "sm";
  const toastTimer = useRef(null);
  const { user } = useSelector(state => state.auth);
  const [limit, setLimit] = useState(2);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(handler);
  }, [search])

  const [page, setPage] = useState(1);

  const { data: currentUsers, isSuccess: currentUserSuccess } = useGetUsersQuery({ managerId: user?.role === "admin" ? user.id : user?.manager?.id, page, limit, search: debouncedSearch });
  const [addUserToAdvanceSheet, { isSuccess: addUserToAdvanceSheetSuccess, isError: isAddUserToAdvanceSheetError, error: addUserToAdvanceSheetError }] = useAddUserToAdvanceSheetMutation();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatus] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);  // { msg, type }

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAddToSheet = useCallback((user) => {
    // showToast(`${user.name} added to sheet ⊞`, "sheet");
    addUserToAdvanceSheet({ userId: user._id });
  }, [addUserToAdvanceSheet]);

  useEffect(() => {
    if (addUserToAdvanceSheetSuccess) {
      showToast(`User added to sheet ⊞`, "sheet");
    }
  }, [addUserToAdvanceSheetSuccess, showToast]);
  useEffect(() => {
    if (addUserToAdvanceSheetError) {
      showToast(`${ addUserToAdvanceSheetError?.data?.message }`, "danger");
    }
  }, [isAddUserToAdvanceSheetError, addUserToAdvanceSheetError,  showToast]);

  const handleToggleActive = useCallback((user) => {
    setUsers(prev => prev.map(u =>
      u._id === user._id ? { ...u, active: !u.active } : u
    ));
    showToast(
      user.active ? `${user.name} deactivated` : `${user.name} activated`,
      user.active ? "danger" : "success"
    );
  }, [showToast]);


  useEffect(() => {
    if (currentUsers?.data?.users) {
      setUsers(currentUsers.data.users);
    }
  }, [currentUsers, currentUserSuccess]);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  const filtered = useMemo(() =>
    users.filter(u => {
      const q = search.toLowerCase();
      return (
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (roleFilter === "all" || u.role === roleFilter) &&
        (statusFilter === "all" || (statusFilter === "active" ? u.active : !u.active))
      );
    }),
    [users, search, roleFilter, statusFilter]
  );

  const pages = currentUsers?.data?.totalPages;
  const safePage = Math.min(page, pages);
  const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);
  const resetPage = useCallback(() => setPage(1), []);
  const goPage = p => setPage(Math.max(1, Math.min(p, pages)));
  const handleSave = updated => {
    setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
    setEditUser(null);
  };

  const compact = isXs || isSm || bp === "md";
  const twoCol = bp === "xl";
  const maxW = { xs: "100%", sm: "100%", md: "760px", lg: "960px", xl: "1200px" }[bp];
  const outerPad = isXs ? "1rem" : isSm ? "1.25rem 1.5rem" : "2rem 2.5rem";

  return (
    <>
      <FontLoader />
      <div
        className="font-body min-h-screen"
        style={{ background: "#F7F5F0", padding: outerPad, maxWidth: maxW, margin: "0 auto", width: "100%" }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6 gap-3">
          <div>
            <p className="font-mono text-[11px] text-stone-400 mb-1 tracking-widest">GET /api/users</p>
            <h1 className={`font-display font-light text-stone-800 leading-tight ${isXs ? "text-2xl" : "text-4xl"}`}>
              User management
            </h1>
            {!isXs && (
              <p className="font-body text-sm text-stone-400 mt-1.5">
                {users.length} total · {users.filter(u => u.active).length} active · {users.filter(u => u.role === "admin").length} admins
              </p>
            )}
          </div>
          <span className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-1">
            200 OK
          </span>
        </div>

        {/* ── Stats ── */}
        <div className={`grid gap-3 mb-6 ${isXs ? "grid-cols-2" : "grid-cols-3"}`}>
          <StatCard label="Total users" value={currentUsers?.data?.totalUsers} />
          <StatCard label="Active" value={users.filter(u => u.active).length} accent="text-emerald-700" />
          {!isXs && <StatCard label="Admins" value={users.filter(u => u.role === "admin").length} accent="text-sky-700" />}
        </div>

        {/* ── Filters ── */}
        <FilterBar
          search={search} setSearch={setSearch}
          roleFilter={roleFilter} setRoleFilter={setRoleFilter}
          statusFilter={statusFilter} setStatusFilter={setStatus}
          limit={limit} setLimit={setLimit}
          bp={bp} onReset={resetPage}
        />

        {/* ── Cards ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-300">
            <span className="text-5xl mb-4">◌</span>
            <p className="font-body text-sm">No users match your filters.</p>
          </div>
        ) : (
          <div className={`grid gap-3 ${twoCol ? "grid-cols-2" : "grid-cols-1"}`}>
            {filtered.map(u => (
              <UserCard
                key={u._id}
                user={u}
                onEdit={setEditUser}
                onAddToSheet={handleAddToSheet}
                onToggleActive={handleToggleActive}
                compact={compact}
              />
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mt-5 pt-5 border-t border-stone-200/80">
          <p className="font-body text-xs text-stone-400">
            Showing <span className="text-stone-600 font-medium">{paginated.length}</span> of{" "}
            <span className="text-stone-600 font-medium">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
          </p>
          <Pagination page={safePage} pages={pages} onPage={goPage} isXs={isXs} />
        </div>
      </div>

      {/* ── Modal ── */}
      {editUser && (
        <EditModal
          user={editUser}
          onSave={handleSave}
          onClose={() => setEditUser(null)}
          isXs={isXs}
        />
      )}

      {toast && (
        <div className="fixed top-24 w-[100] left-1/2 m-auto z-50 toast-enter"
          style={{ transform: "translateX(-50%)" }}>
          <div className={`flex items-center gap-2.5 font-body text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border ${toast.type === "danger"
            ? "bg-red-50 text-red-700 border-red-200"
            : toast.type === "sheet"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-white text-stone-700 border-stone-200"
            }`}>
            <span>{toast.type === "danger" ? "⊘" : toast.type === "sheet" ? "⊞" : "✓"}</span>
            {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}