import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { locationPathChanged } from "../../features/locationPath";
import { useGetProductCategoriesQuery } from "../../features/productCategory/productCategoryApi";
import { useCreateTagMutation, useCreateTagQuery } from "../../features/tag/tagApi";

/* ── Toast ─────────────────────────────────────────────────────────────────── */
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none
        flex items-center gap-2 px-4 py-2.5 rounded-xl
        bg-white border border-emerald-200 shadow-md
        text-sm font-medium text-emerald-700 whitespace-nowrap
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      {message}
    </div>
  );
}

/* ── Field wrapper ──────────────────────────────────────────────────────────── */
function Field({ label, meta, required, error, hint, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {meta && (
          <span className="text-[10px] font-mono text-gray-400">{meta}</span>
        )}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function CreateTag() {
  const { data: pCategories } = useGetProductCategoriesQuery();
  const [createTag, { isSuccess: createTagSuccess }] = useCreateTagMutation()
  const CATEGORIES = pCategories
  const [form, setForm] = useState({ name: "", bnName: "", category: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const timerRef = useRef(null);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  const showToast = (msg) => {
    clearTimeout(timerRef.current);
    setToast({ visible: true, message: msg });
    timerRef.current = setTimeout(
      () => setToast({ visible: false, message: msg }),
      3000
    );
  };

  const change = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tag name is required.";
    else if (form.name.trim().length < 2) e.name = "Minimum 2 characters.";
    if (!form.category) e.category = "Please select a category.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    createTag(form)
    // ── Replace with your real API call ──────────────────────────────────────
    // await fetch("/api/tags", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     name: form.name.trim(),
    //     bnName: form.bnName.trim(),
    //     category: form.category,
    //   }),
    // });
    // await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    // showToast("Tag created successfully");
    // setForm({ name: "", bnName: "", category: "" });
    // setErrors({});
  };

  useEffect(() => {
    if (createTagSuccess) {
      showToast("Tag created successfully");
    }
  }, [createTagSuccess])

  const handleReset = () => {
    setForm({ name: "", bnName: "", category: "" });
    setErrors({});
  };

  const inputBase =
    "w-full h-11 px-3.5 text-sm text-gray-900 rounded-xl border outline-none transition-all duration-150";

  const inputClass = (field) =>
    `${inputBase} ${errors[field]
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : focused === field
        ? "border-gray-900 bg-white ring-2 ring-gray-100"
        : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  const nameLen = form.name.length;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 sm:px-0 sm:py-12">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 mb-3">
          <span>Products</span>
          <span>›</span>
          <span>Tags</span>
          <span>›</span>
          <span className="text-gray-500">New</span>
        </div>

        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create Tag
          </h1>
          <span className="text-[10px] font-semibold tracking-widest text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
            NEW
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          Add a product tag and associate it with a category.
        </p>
      </div>

      {/* ── Model strip ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <p className="text-[11px] font-mono text-gray-500">
          Model:{" "}
          <span className="text-gray-800 font-medium">ProductsTag</span>
          &nbsp;·&nbsp; ref:{" "}
          <span className="text-gray-800 font-medium">ProductCategory</span>
        </p>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-200 rounded-2xl px-5 py-6"
      >
        {/* Tag Name */}
        <Field label="Tag name" meta="String · required" required error={errors.name}>
          <input
            type="text"
            placeholder="e.g. Wireless, Organic, Premium…"
            value={form.name}
            maxLength={80}
            onChange={(e) => change("name", e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            className={inputClass("name")}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[11px] font-mono ${nameLen > 65 ? "text-red-500" : "text-gray-400"}`}>
              {nameLen}/80
            </span>
          </div>
        </Field>

        <div className="h-px bg-gray-100 mb-5" />

        {/* Bengali Name */}
        <Field
          label="Bengali name (bnName)"
          meta="String · optional · unique"
          hint={'Optional — defaults to "". Must be unique across all tags.'}
        >
          <input
            type="text"
            placeholder="যেমন: ওয়্যারলেস, অর্গানিক…"
            value={form.bnName}
            onChange={(e) => change("bnName", e.target.value)}
            onFocus={() => setFocused("bnName")}
            onBlur={() => setFocused(null)}
            className={inputClass("bnName")}
          />
        </Field>

        <div className="h-px bg-gray-100 mb-5" />

        {/* Category */}
        <Field
          label="Category"
          meta="ObjectId · ref: ProductCategory"
          required
          error={errors.category}
        >
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => change("category", e.target.value)}
              onFocus={() => setFocused("category")}
              onBlur={() => setFocused(null)}
              className={`${inputClass("category")} pr-9 cursor-pointer appearance-none`}
            >
              <option value="">— Select a category —</option>
              {CATEGORIES?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </Field>

        <div className="h-px bg-gray-100 mb-5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-medium
              text-gray-500 hover:bg-gray-50 hover:border-gray-300
              transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl
              bg-gray-900 text-white text-sm font-semibold min-w-[120px]
              hover:bg-gray-700 active:scale-95
              transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading && (
              <svg
                className="animate-spin"
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="30" />
              </svg>
            )}
            {loading ? "Creating…" : "Create tag"}
          </button>
        </div>
      </form>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}