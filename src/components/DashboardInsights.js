"use client";

import { useMemo } from "react";

const money = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(Number(value || 0));

export default function DashboardInsights({ sales, products, timezone = "America/Bogota" }) {
  const days = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        key: new Intl.DateTimeFormat("en-CA", {
          timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit"
        }).format(date),
        label: date.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", ""),
        total: 0,
        count: 0
      };
    });

    const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    for (const sale of sales || []) {
      const date = new Date(sale.created_at);
      if (Number.isNaN(date.getTime())) continue;
      if (sale.status !== "paid") continue;
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit"
      }).format(date);
      const bucket = byKey.get(key);
      if (bucket) {
        bucket.total += Number(sale.total || 0);
        bucket.count += 1;
      }
    }
    return buckets;
  }, [sales, timezone]);

  const maxTotal = Math.max(1, ...days.map((day) => day.total));
  const lowStock = useMemo(() => (products || [])
    .filter((product) => Number(product.stock || 0) <= Number(product.low_stock_threshold || 2))
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 5), [products]);

  const totalRecent = days.reduce((sum, day) => sum + day.total, 0);
  const countRecent = days.reduce((sum, day) => sum + day.count, 0);

  return (
    <section className="jp-insights" aria-label="Analítica reciente">
      <article className="jp-insight-card jp-sales-insight">
        <div className="jp-insight-heading">
          <div>
            <span className="eyebrow">RENDIMIENTO COMERCIAL</span>
            <h2>Ventas recientes</h2>
          </div>
          <span className="jp-insight-period">7 días</span>
        </div>
        <div className="jp-sales-summary">
          <strong>{money(totalRecent)}</strong>
          <span>{countRecent} {countRecent === 1 ? "venta" : "ventas"} registradas en el periodo</span>
        </div>
        <div className="jp-sales-chart" role="img" aria-label="Gráfico de ventas diarias de los últimos siete días">
          {days.map((day) => (
            <div className="jp-sales-day" key={day.key}>
              <div className="jp-sales-bar-track" title={`${day.label}: ${money(day.total)}`}>
                <span style={{ height: `${day.total ? Math.max(5, (day.total / maxTotal) * 100) : 0}%` }} />
              </div>
              <small>{day.label}</small>
              <span className="jp-sales-count">{day.count}</span>
            </div>
          ))}
        </div>
        <p className="jp-insight-footnote">Suma de ventas pagadas en el periodo, dentro de los registros recientes cargados por el panel.</p>
      </article>

      <article className="jp-insight-card jp-stock-insight">
        <div className="jp-insight-heading">
          <div>
            <span className="eyebrow">CONTROL DE INVENTARIO</span>
            <h2>Atención prioritaria</h2>
          </div>
          <span className={`jp-stock-total ${lowStock.length ? "warning" : ""}`}>{lowStock.length}</span>
        </div>
        {lowStock.length ? (
          <ul className="jp-stock-list">
            {lowStock.map((product) => (
              <li key={product.id}>
                <span className="jp-stock-product">{product.name}</span>
                <span className="jp-stock-quantity">{Number(product.stock || 0)} uds.</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="jp-stock-empty">
            <span aria-hidden="true">✧</span>
            <p>No hay alertas de stock bajo en los productos cargados.</p>
          </div>
        )}
        <p className="jp-insight-footnote">Se aplica el mínimo configurado para cada producto; cuando no existe, se usa el umbral predeterminado de 2 unidades.</p>
      </article>
    </section>
  );
}
