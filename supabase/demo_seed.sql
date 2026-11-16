-- Crea un comercio demo independiente con 60 piezas de muestra.
-- No vincula ni modifica negocios reales. Ejecutar después de migraciones 001–004.
begin;
insert into public.businesses(name,slug,status,description,city,address,phone)
values('Maison Aurelia · Demo','maison-aurelia-demo','active','Una colección de piezas seleccionadas en oro y plata.','Cartagena','Centro Histórico, Cartagena','+57 300 000 0000')
on conflict(slug) do nothing;
insert into public.business_settings(business_id) select id from public.businesses where slug='maison-aurelia-demo' on conflict do nothing;
insert into public.categories(business_id,name,description)
select b.id,c.name,'Selección demo de '||lower(c.name) from public.businesses b cross join (values ('Anillos'),('Cadenas y collares'),('Pulseras'),('Aretes'),('Relojes'),('Dijes y accesorios')) c(name) where b.slug='maison-aurelia-demo' on conflict do nothing;
with pieces as (
 select g.n, (array['Anillos','Cadenas y collares','Pulseras','Aretes','Relojes','Dijes y accesorios'])[1+(g.n%6)] category,
 (array['Luz de Aurora','Noche de Oro','Brisa Serena','Solstice','Perla Noire','Constelación','Línea Eterna','Ritual Dorado','Luna Clara','Esencia'])[1+(g.n%10)]||' '||to_char(g.n+1,'FM00') name,
 (array['Oro 18K','Plata 925','Oro rosa','Acero inoxidable','Oro laminado'])[1+(g.n%5)] material,
 185000+(g.n*13750) price, 3+(g.n%14) stock
 from generate_series(0,59) g(n)
)
insert into public.products(business_id,category_id,name,description,reference,sku,material,price,stock,low_stock_threshold,available,image_url)
select b.id,c.id,p.name,'Diseño de joyería fina con acabado cuidado y presentación de regalo.','MA-'||to_char(p.n+1,'FM000'),'MA-DEMO-'||to_char(p.n+1,'FM000'),p.material,p.price,p.stock,3,true,
case p.n%6 when 0 then 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85' when 1 then 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85' when 2 then 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85' when 3 then 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85' when 4 then 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85' else 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85' end
from pieces p join public.businesses b on b.slug='maison-aurelia-demo' join public.categories c on c.business_id=b.id and c.name=p.category
on conflict(business_id,sku) do nothing;
commit;

