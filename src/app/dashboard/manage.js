"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { tabsFor, ROLE_LABELS } from "@/lib/roles";
import Icon from "@/components/Icons";
import SiteEditor from "./site-editor";
import DashboardInsights from "@/components/DashboardInsights";
const money = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(n || 0));
export default function Manage({ business, role }) {
  const nav = tabsFor(role); const [tab, setTab] = useState("overview"); const [data, setData] = useState({ products: [], categories: [], customers: [], movements: [], sales: [] }); const [message, setMessage] = useState(""); const sb = useMemo(() => createClient(), []);
  async function load() { const names = ["products", "categories", "customers", "inventory_movements", "sales"]; const results = await Promise.all(names.map((table) => sb.from(table).select(table === "products" ? "*,category:categories(name)" : "*").eq("business_id", business.id).order("created_at", { ascending: false }).limit(100))); const error = results.find((r) => r.error)?.error; if (error) setMessage(error.message); else setData({ products: results[0].data || [], categories: results[1].data || [], customers: results[2].data || [], movements: results[3].data || [], sales: results[4].data || [] }); }
  useEffect(() => { load(); }, []); const active = nav.find(([k]) => k === tab)?.[1] || "Resumen"; const stats = { total: data.products.length, available: data.products.filter((p) => p.available && p.stock > 0).length, low: data.products.filter((p) => p.stock <= (p.low_stock_threshold || 2)).length, value: data.products.reduce((s, p) => s + Number(p.price || 0) * Number(p.stock || 0), 0) };
  return <div className="manage-wrap"><aside className="manage-side"><div className="side-brand"><span className="side-monogram">✦</span><div><h2>{business.name}</h2><div className="manage-slug">/{business.slug} · {ROLE_LABELS[role] || role}</div></div></div><nav className="side-nav">{nav.map(([k, label]) => <button key={k} className={tab === k ? "side-link active" : "side-link"} onClick={() => setTab(k)}><Icon name={k} size={18} /><span>{label}</span></button>)}</nav></aside><section className="manage-main"><div className="manage-head"><div><div className="manage-date">{new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</div><h1>{active}</h1></div><button className="btn" onClick={load}>Actualizar</button></div>{message && <div className="notice error">{message}</div>}<Panel tab={tab} data={data} stats={stats} business={business} sb={sb} reload={load} /></section></div>;
}
function Panel({ tab, data, stats, business, sb, reload }) { if (tab === "overview") return <Overview stats={stats} data={data} />; if (["products", "categories", "customers"].includes(tab)) return <Crud table={tab} title={{ products: "Productos", categories: "Categorías", customers: "Clientes" }[tab]} data={data[tab]} business={business} sb={sb} reload={reload} />; if (tab === "inventory") return <Inventory data={data} business={business} sb={sb} reload={reload} />; if (tab === "sales") return <Sales data={data} business={business} sb={sb} reload={reload} />; if (tab === "users") return <Users />; if (tab === "editor") return <SiteEditor business={business} sb={sb} />; return <Settings business={business} sb={sb} />; }
function Overview({ stats, data }) { return <><div className="stats-row"><Stat label="Productos cargados" value={stats.total} /><Stat label="Disponibles" value={stats.available} /><Stat label="Inventario bajo" value={stats.low} tone={stats.low ? "warn" : ""} /><Stat label="Valor inventario cargado" value={money(stats.value)} /></div><DashboardInsights sales={data.sales} products={data.products} timezone={business.timezone} /><div className="dashboard-grid"><article className="table-card"><div className="eyebrow">Catálogo</div><h2>Productos recientes</h2>{data.products.slice(0, 6).map((p) => <Row key={p.id} title={p.name} detail={`${p.sku || "Sin SKU"} · ${p.category?.name || "Sin categoría"}`} value={money(p.price)} />)}{!data.products.length && <p className="muted">Aún no hay productos.</p>}</article><article className="table-card"><div className="eyebrow">Actividad</div><h2>Ventas recientes</h2>{data.sales.slice(0, 6).map((s) => <Row key={s.id} title="Venta registrada" detail={new Date(s.created_at).toLocaleString("es-CO")} value={money(s.total)} />)}{!data.sales.length && <p className="muted">Las ventas aparecerán aquí.</p>}</article></div></>; }
function Stat({ label, value, tone }) { return <article className={`stat-card ${tone || ""}`}><span>{label}</span><strong>{value}</strong></article>; }
function Row({ title, detail, value }) { return <div className="entity-row"><div><strong>{title}</strong><small>{detail}</small></div><strong>{value}</strong></div>; }
function Crud({ table, title, data, business, sb, reload }) {
  const fields = table === "products"
    ? ["name", "sku", "material", "price", "stock"]
    : table === "categories"
      ? ["name", "description"]
      : ["name", "email", "phone"];
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const payload = { ...form, business_id: business.id };
    if (payload.price !== undefined && payload.price !== "") payload.price = Number(payload.price);
    if (payload.stock !== undefined && payload.stock !== "") payload.stock = Number(payload.stock);

    const result = editingId
      ? await sb.from(table).update(payload).eq("id", editingId).eq("business_id", business.id)
      : await sb.from(table).insert(payload);

    setBusy(false);
    if (result.error) {
      setNote(result.error.message);
      return;
    }
    setForm({});
    setEditingId(null);
    setNote(editingId ? "Registro actualizado." : "Registro creado.");
    await reload();
  }

  function edit(item) {
    setEditingId(item.id);
    setForm(Object.fromEntries(fields.map((field) => [field, item[field] ?? ""])));
    setNote("Editando el registro seleccionado.");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
    setNote("");
  }

  async function remove(id) {
    if (!window.confirm("¿Eliminar este registro?")) return;
    const { error } = await sb.from(table).delete().eq("id", id).eq("business_id", business.id);
    if (error) setNote(error.message);
    else {
      if (editingId === id) cancelEdit();
      setNote("Registro eliminado.");
      await reload();
    }
  }

  return (
    <>
      <form className="inline-form" onSubmit={save}>
        <h3>{editingId ? "Editar registro" : "Nuevo registro"}</h3>
        {fields.map((field) => (
          <input
            key={field}
            placeholder={field.replaceAll("_", " ")}
            type={["price", "stock"].includes(field) ? "number" : "text"}
            min={["price", "stock"].includes(field) ? "0" : undefined}
            step={field === "price" ? "1" : undefined}
            value={form[field] ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
            required={field === "name"}
          />
        ))}
        <button className="btn primary" disabled={busy}>{busy ? "Guardando…" : editingId ? "Guardar edición" : "Crear registro"}</button>
        {editingId && <button className="btn" type="button" onClick={cancelEdit} disabled={busy}>Cancelar</button>}
      </form>
      {note && <p className="muted" role="status" aria-live="polite">{note}</p>}
      <article className="table-card">
        <div className="section-heading"><h2>{title}</h2><span className="muted">{data.length} registros cargados</span></div>
        {data.map((item) => (
          <div className="entity-row" key={item.id}>
            <div><strong>{item.name}</strong><small>{item.sku || item.email || item.description || ""}</small></div>
            <div className="compact-actions">
              {item.price != null && <strong>{money(item.price)}</strong>}
              <button type="button" className="btn" onClick={() => edit(item)}>Editar</button>
              <button type="button" className="btn danger" onClick={() => remove(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
        {!data.length && <p className="muted">No hay registros todavía.</p>}
      </article>
    </>
  );
}
function Inventory({ data, business, sb, reload }) { const [form, setForm] = useState({ product_id: "", quantity: "", movement_type: "entry" }); async function save(e) { e.preventDefault(); const signed = form.movement_type === "entry" || form.movement_type === "return" ? Math.abs(Number(form.quantity)) : -Math.abs(Number(form.quantity)); const { error } = await sb.from("inventory_movements").insert({ business_id: business.id, product_id: form.product_id, quantity: signed, movement_type: form.movement_type }); if (error) alert(error.message); else { setForm({ product_id: "", quantity: "", movement_type: "entry" }); reload(); } } return <><form className="inline-form" onSubmit={save}><h3>Registrar movimiento</h3><select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required><option value="">Selecciona un producto</option>{data.products.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.stock} uds.</option>)}</select><select value={form.movement_type} onChange={(e) => setForm({ ...form, movement_type: e.target.value })}><option value="entry">Entrada</option><option value="sale">Salida</option><option value="adjustment">Ajuste negativo</option><option value="return">Devolución</option></select><input type="number" min="1" placeholder="Cantidad" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /><button className="btn primary">Aplicar movimiento</button></form><article className="table-card"><div className="section-heading"><h2>Existencias y trazabilidad</h2><span className="muted">{data.movements.length} movimientos</span></div>{data.products.map((p) => <Row key={p.id} title={p.name} detail={`${p.sku || "Sin SKU"} · mínimo ${p.low_stock_threshold || 2}`} value={<span className={p.stock <= (p.low_stock_threshold || 2) ? "text-warn" : ""}>{p.stock} uds.</span>} />)}{!data.products.length && <p className="muted">Crea productos para controlar inventario.</p>}</article></>; }
function Sales({ data, business, sb, reload }) { const [form, setForm] = useState({ total: "", customer_id: "" }); async function save(e) { e.preventDefault(); const { error } = await sb.from("sales").insert({ business_id: business.id, customer_id: form.customer_id || null, total: Number(form.total), status: "paid" }); if (error) alert(error.message); else { setForm({ total: "", customer_id: "" }); reload(); } } return <><form className="inline-form" onSubmit={save}><h3>Registrar venta</h3><select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}><option value="">Cliente general</option>{data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input type="number" min="0" placeholder="Total COP" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} required /><button className="btn primary">Registrar venta</button></form><article className="table-card"><h2>Ventas recientes</h2>{data.sales.map((s) => <Row key={s.id} title="Venta registrada" detail={new Date(s.created_at).toLocaleString("es-CO")} value={money(s.total)} />)}</article></>; }
function Users() { return <article className="settings-card"><div className="eyebrow">Accesos</div><h2>Usuarios y permisos</h2><p className="muted">Los roles se administran en `business_members` y se protegen con RLS: propietario, administrador, gerente, vendedor y consulta.</p></article>; }
function Settings({ business, sb }) {
  const [form, setForm] = useState({
    name: business.name || "",
    description: business.description || "",
    phone: business.phone || "",
    address: business.address || "",
    city: business.city || ""
  });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const { error } = await sb.from("businesses")
      .update(form)
      .eq("id", business.id);
    setBusy(false);
    setNote(error ? error.message : "Identidad comercial guardada.");
  }

  return (
    <article className="settings-card jp-business-settings">
      <div className="eyebrow">IDENTIDAD DE NEGOCIO</div>
      <h2>Configuración general</h2>
      <p className="muted">Estos datos identifican a la joyería en su escaparate público.</p>
      <form onSubmit={save}>
        <label>Nombre comercial<input value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
        <label>Descripción<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows="4" /></label>
        <div className="jp-settings-grid">
          <label>Teléfono<input value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label>
          <label>Ciudad<input value={form.city} onChange={(event) => update("city", event.target.value)} /></label>
        </div>
        <label>Dirección<input value={form.address} onChange={(event) => update("address", event.target.value)} /></label>
        <button className="btn primary" disabled={busy}>{busy ? "Guardando…" : "Guardar identidad"}</button>
      </form>
      {note && <p className="muted" role="status" aria-live="polite">{note}</p>}
    </article>
  );
}
