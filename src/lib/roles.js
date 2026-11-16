/** Permisos de interfaz por rol. La seguridad real vive en RLS/triggers; esto sólo decide qué se muestra. */
export const ROLE_LABELS = { owner: "Propietario", admin: "Administrador", manager: "Gerente", seller: "Vendedor", viewer: "Consulta" };
export const canManage = (role) => ["owner", "admin", "manager"].includes(role);
export const canSell = (role) => canManage(role) || role === "seller";
export const canEditSettings = (role) => ["owner", "admin"].includes(role);

export function tabsFor(role) {
  const tabs = [["overview", "Resumen"], ["products", "Productos"], ["categories", "Categorías"], ["inventory", "Inventario"], ["customers", "Clientes"]];
  if (canSell(role)) tabs.push(["sales", "Ventas"]);
  if (canManage(role)) tabs.push(["users", "Usuarios y permisos"]);
  if (canEditSettings(role)) tabs.push(["settings", "Configuración"]);
  return tabs;
}
