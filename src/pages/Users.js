// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { locationPathChanged } from '../features/locationPath';
// import { useGetUsersQuery } from '../features/bikri/bikriApi';

// const Users = () => {
//     const dispatch = useDispatch();
//     const {user} = useSelector(state => state.auth);
//     console.log(user);
//     const { data: users } = useGetUsersQuery({managerId: user?.role === "admin" ? user.id : user?.manager?.id});
//     console.log(users);
//     useEffect(() => {
//         dispatch(locationPathChanged(window.location.pathname));
//     }, []);
//     return (
//         <div>Users</div>
//     )
// }

// export default Users



/**
 * UserManagement.jsx
 * Fully responsive: 320px mobile → 1920px+ desktop
 *
 * Breakpoints (via useBreakpoint hook):
 *   xs  < 480px   — single-column, stacked filters, bottom-sheet modal
 *   sm  < 768px   — two-column filter row
 *   md  < 1024px  — standard layout
 *   lg  < 1280px  — wider content, inline card meta
 *   xl  ≥ 1280px  — full desktop, two-column card grid
 */

import { useState, useMemo, useEffect, useCallback } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  { _id: "69577c3fc8fcddb5e936a789", active: true,  name: "Rahat",   role: "user",      email: "rahat@gmail.com",   photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577d7fc8fcddb5e936a78e", active: true,  name: "Sweety",  role: "admin",     email: "sweety@gmail.com",  photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577e1fc8fcddb5e936a791", active: false, name: "Arif",    role: "user",      email: "arif@gmail.com",    photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "69577f2ac8fcddb5e936a792", active: true,  name: "Mitu",    role: "moderator", email: "mitu@gmail.com",    photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695780abc8fcddb5e936a793", active: true,  name: "Rafi",    role: "user",      email: "rafi@gmail.com",    photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695781bcc8fcddb5e936a794", active: false, name: "Nadia",   role: "user",      email: "nadia@gmail.com",   photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695782cdc8fcddb5e936a795", active: true,  name: "Karim",   role: "admin",     email: "karim@gmail.com",   photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695783edc8fcddb5e936a796", active: true,  name: "Tania",   role: "moderator", email: "tania@gmail.com",   photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "695784fec8fcddb5e936a797", active: false, name: "Sabbir",  role: "user",      email: "sabbir@gmail.com",  photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957850fc8fcddb5e936a798", active: true,  name: "Puja",    role: "user",      email: "puja@gmail.com",    photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957861ac8fcddb5e936a799", active: true,  name: "Hasan",   role: "admin",     email: "hasan@gmail.com",   photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
  { _id: "6957872bc8fcddb5e936a800", active: false, name: "Sharmin", role: "user",      email: "sharmin@gmail.com", photo: "default.png", manager: "69577d7fc8fcddb5e936a78e" },
];

// ─── Breakpoint hook ──────────────────────────────────────────────────────────

function useBreakpoint() {
  const get = () => {
    if (typeof window === "undefined") return "md";
    const w = window.innerWidth;
    if (w < 480)  return "xs";
    if (w < 768)  return "sm";
    if (w < 1024) return "md";
    if (w < 1280) return "lg";
    return "xl";
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const handler = () => setBp(get());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_STYLES = {
  admin:     { bg: "#E6F1FB", color: "#0C447C" },
  moderator: { bg: "#EEEDFE", color: "#3C3489" },
  user:      { bg: "#F1EFE8", color: "#444441" },
};

const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Avatar({ name, role, size = 44 }) {
  const s = ROLE_STYLES[role] || ROLE_STYLES.user;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: s.bg, color: s.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 500, fontSize: Math.round(size * 0.32), flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  const map = {
    default:   { background: "#F1EFE8", color: "#444441" },
    admin:     { background: "#E6F1FB", color: "#0C447C" },
    moderator: { background: "#EEEDFE", color: "#3C3489" },
    success:   { background: "#EAF3DE", color: "#27500A" },
    danger:    { background: "#FCEBEB", color: "#791F1F" },
  };
  const s = map[variant] || map.default;
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 6, ...s }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, color = "#1a1a1a" }) {
  return (
    <div style={{ background: "#f5f5f3", borderRadius: 8, padding: "0.875rem 1rem" }}>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color }}>{value}</p>
    </div>
  );
}

// ─── UserCard ─────────────────────────────────────────────────────────────────

function UserCard({ user, onEdit, layout }) {
  // layout: "compact" (xs/sm/md) | "wide" (lg) | "full" (xl — 2-col grid)
  const isAdmin  = user.role === "admin";
  const isSelf   = user.manager === user._id;
  const roleBadge = ROLE_STYLES[user.role] ? user.role : "default";

  return (
    <div
      style={{
        background: "#fff",
        border: isAdmin ? "2px solid #378ADD" : "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: 12,
        padding: layout === "compact" ? "0.875rem 1rem" : "1rem 1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={user.name} role={user.role} size={layout === "compact" ? 40 : 46} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 500, fontSize: layout === "compact" ? 14 : 15 }}>
              {user.name}
            </span>
            <Badge variant={roleBadge}>{user.role}</Badge>
            <Badge variant={user.active ? "success" : "danger"}>
              {user.active ? "active" : "inactive"}
            </Badge>
          </div>
          <p
            style={{
              fontSize: 13, color: "#666", margin: "3px 0 0",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </p>
          {/* Show meta inline on wider cards */}
          {layout !== "compact" && (
            <div style={{ display: "flex", gap: 20, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>
                ID: <span style={{ fontFamily: "monospace", color: "#888" }}>{user._id.slice(0, 16)}…</span>
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>
                Manager:{" "}
                <span style={{ fontFamily: "monospace", color: "#888" }}>
                  {user.manager.slice(0, 16)}…{isSelf && " (self)"}
                </span>
              </span>
            </div>
          )}
        </div>

        <button onClick={() => onEdit(user)} style={btnStyle}>Edit</button>
      </div>

      {/* Compact meta row */}
      {layout === "compact" && (
        <div
          style={{
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
            marginTop: 10, paddingTop: 8,
            display: "flex", gap: 20, flexWrap: "wrap",
          }}
        >
          <div>
            <p style={metaLabel}>ID</p>
            <p style={metaValue}>{user._id.slice(0, 14)}…</p>
          </div>
          <div>
            <p style={metaLabel}>Manager</p>
            <p style={metaValue}>
              {user.manager.slice(0, 14)}…{isSelf && <span style={{ color: "#ccc" }}> (self)</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EditModal ────────────────────────────────────────────────────────────────

function EditModal({ user, onSave, onClose, bp }) {
  const [form, setForm] = useState({ ...user });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isXs = bp === "xs";

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: isXs ? "flex-end" : "center",
        justifyContent: "center",
        padding: isXs ? 0 : "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: isXs ? "20px 20px 0 0" : 14,
          border: isXs ? "none" : "0.5px solid rgba(0,0,0,0.12)",
          padding: isXs ? "0 1rem 2rem" : "1.5rem",
          width: "100%",
          maxWidth: isXs ? "100%" : 480,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Mobile drag handle */}
        {isXs && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
            <div style={{ width: 36, height: 4, background: "#ddd", borderRadius: 2 }} />
          </div>
        )}

        {/* Modal header */}
        <div
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={user.name} role={user.role} size={38} />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Edit user</h2>
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ ...btnStyle, padding: "4px 10px", fontSize: 12 }}
          >
            ✕
          </button>
        </div>

        {/* Form fields — 2-col on sm+ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isXs ? "1fr" : "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            { label: "Name",  key: "name",  type: "text"  },
            { label: "Email", key: "email", type: "email" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={fieldLabel}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={set(key)}
                style={inputStyle}
              />
            </div>
          ))}

          <div>
            <label style={fieldLabel}>Role</label>
            <select value={form.role} onChange={set("role")} style={inputStyle}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label style={fieldLabel}>Status</label>
            <select
              value={form.active ? "true" : "false"}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "true" }))}
              style={inputStyle}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex", gap: 8,
            justifyContent: isXs ? "stretch" : "flex-end",
            marginTop: "1.25rem",
          }}
        >
          <button
            onClick={onClose}
            style={{ ...btnStyle, borderColor: "#E24B4A", color: "#A32D2D", flex: isXs ? 1 : undefined }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            style={{
              ...btnStyle,
              background: "#E6F1FB", borderColor: "#378ADD", color: "#0C447C",
              flex: isXs ? 1 : undefined,
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, pages, onPage, bp }) {
  const isXs = bp === "xs";

  const visible = useMemo(() => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const delta = isXs ? 1 : 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
      range.push(i);
    }
    if (range[0] > 2)      { range.unshift("…l"); range.unshift(1); }
    else if (range[0] > 1)   range.unshift(1);
    if (range[range.length - 1] < pages - 1) { range.push("…r"); range.push(pages); }
    else if (range[range.length - 1] < pages) range.push(pages);
    return range;
  }, [page, pages, isXs]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        style={pgBtnStyle(false, page <= 1)}
      >
        ‹
      </button>
      {visible.map((p, i) =>
        typeof p === "string" ? (
          <span key={p} style={{ fontSize: 13, color: "#bbb", padding: "0 2px" }}>…</span>
        ) : (
          <button key={p} onClick={() => onPage(p)} style={pgBtnStyle(p === page, false)}>
            {p}
          </button>
        )
      )}
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        style={pgBtnStyle(false, page >= pages)}
      >
        ›
      </button>
    </div>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

function FilterBar({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter, limit, setLimit, bp, onReset }) {
  const isXs = bp === "xs";
  const isSm = bp === "sm";

  const cols = isXs
    ? "1fr"
    : isSm
    ? "1fr 1fr"
    : "1fr auto auto auto";

  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); onReset(); }}
        style={{ ...inputStyle, gridColumn: isSm ? "1 / -1" : undefined }}
      />
      <select
        value={roleFilter}
        onChange={(e) => { setRoleFilter(e.target.value); onReset(); }}
        style={{ ...inputStyle, width: isXs ? "100%" : "auto" }}
      >
        <option value="all">All roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => { setStatusFilter(e.target.value); onReset(); }}
        style={{ ...inputStyle, width: isXs ? "100%" : "auto" }}
      >
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select
        value={limit}
        onChange={(e) => { setLimit(Number(e.target.value)); onReset(); }}
        style={{ ...inputStyle, width: isXs ? "100%" : "auto" }}
      >
        <option value={3}>3 / page</option>
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
      </select>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const bp = useBreakpoint();

  const [users, setUsers]           = useState(INITIAL_USERS);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatus]   = useState("all");
  const [limit, setLimit]           = useState(5);
  const [page, setPage]             = useState(1);
  const [editUser, setEditUser]     = useState(null);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        return (
          (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
          (roleFilter === "all" || u.role === roleFilter) &&
          (statusFilter === "all" || (statusFilter === "active" ? u.active : !u.active))
        );
      }),
    [users, search, roleFilter, statusFilter]
  );

  const pages    = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, pages);
  const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

  const resetPage = useCallback(() => setPage(1), []);
  const goPage    = (p) => setPage(Math.max(1, Math.min(p, pages)));

  const handleSave = (updated) => {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setEditUser(null);
  };

  // Responsive layout decisions
  const isXs = bp === "xs";
  const cardLayout  = isXs || bp === "sm" || bp === "md" ? "compact" : "wide";
  const twoColCards = bp === "xl";
  const maxWidth    = { xs: "100%", sm: "100%", md: 760, lg: 960, xl: 1200 }[bp];
  const outerPad    = isXs ? "1rem" : bp === "sm" ? "1.25rem" : "2rem 2.5rem";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        .um-root { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; }
        .um-root select, .um-root input { font-family: inherit; }
        .um-root button { font-family: inherit; }
      `}</style>

      <div
        className="um-root"
        style={{
          padding: outerPad,
          maxWidth,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ── Header ────────────────────────────────────── */}
        <div
          style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: isXs ? "1rem" : "1.5rem",
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 2px", letterSpacing: "0.03em" }}>
              GET /api/users
            </p>
            <h1 style={{ fontSize: isXs ? 18 : 22, fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
              User management
            </h1>
            {!isXs && (
              <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
                {users.length} total · {users.filter((u) => u.active).length} active ·{" "}
                {users.filter((u) => u.role === "admin").length} admins
              </p>
            )}
          </div>
          <span
            style={{
              fontSize: 12, fontWeight: 500,
              padding: "4px 12px", borderRadius: 6,
              background: "#EAF3DE", color: "#27500A",
              flexShrink: 0, marginTop: 2,
            }}
          >
            200 success
          </span>
        </div>

        {/* ── Stats ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isXs ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: 10,
            marginBottom: "1.25rem",
          }}
        >
          <StatCard label="Total users" value={users.length} />
          <StatCard label="Active"      value={users.filter((u) => u.active).length} color="#27500A" />
          {!isXs && (
            <StatCard label="Admins" value={users.filter((u) => u.role === "admin").length} />
          )}
        </div>

        {/* ── Filters ───────────────────────────────────── */}
        <FilterBar
          search={search}             setSearch={setSearch}
          roleFilter={roleFilter}     setRoleFilter={setRoleFilter}
          statusFilter={statusFilter} setStatusFilter={setStatus}
          limit={limit}               setLimit={setLimit}
          bp={bp}                     onReset={resetPage}
        />

        {/* ── Cards ─────────────────────────────────────── */}
        {paginated.length === 0 ? (
          <div
            style={{
              textAlign: "center", padding: "3rem 0",
              color: "#bbb", fontSize: 14,
            }}
          >
            No users match your filters.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: twoColCards ? "1fr 1fr" : "1fr",
              gap: 10,
            }}
          >
            {paginated.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onEdit={setEditUser}
                layout={cardLayout}
              />
            ))}
          </div>
        )}

        {/* ── Footer ────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            Showing {paginated.length} of {filtered.length} result
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <Pagination page={safePage} pages={pages} onPage={goPage} bp={bp} />
        </div>
      </div>

      {/* ── Edit modal ────────────────────────────────────── */}
      {editUser && (
        <EditModal
          user={editUser}
          onSave={handleSave}
          onClose={() => setEditUser(null)}
          bp={bp}
        />
      )}
    </>
  );
}

// ─── Shared style objects ─────────────────────────────────────────────────────

const btnStyle = {
  background: "transparent",
  border: "0.5px solid rgba(0,0,0,0.22)",
  borderRadius: 8,
  padding: "6px 14px",
  fontSize: 13,
  cursor: "pointer",
  color: "inherit",
  whiteSpace: "nowrap",
};

const inputStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.18)",
  borderRadius: 8,
  padding: "7px 10px",
  fontSize: 13,
  outline: "none",
  width: "100%",
  height: 36,
  color: "inherit",
};

const fieldLabel = { fontSize: 12, color: "#888", display: "block", marginBottom: 4 };
const metaLabel  = { fontSize: 11, color: "#aaa", margin: "0 0 2px" };
const metaValue  = { fontSize: 11, fontFamily: "monospace", color: "#888", margin: 0 };

const pgBtnStyle = (active, disabled) => ({
  width: 32, height: 32,
  display: "flex", alignItems: "center", justifyContent: "center",
  border: active ? "0.5px solid #378ADD" : "0.5px solid rgba(0,0,0,0.18)",
  borderRadius: 8,
  background: active ? "#E6F1FB" : "transparent",
  color: active ? "#0C447C" : "#666",
  fontWeight: active ? 500 : 400,
  fontSize: 13,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.35 : 1,
});