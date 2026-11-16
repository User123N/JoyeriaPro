create policy public_active_business on public.businesses for select using (status = 'active');
create policy public_active_categories on public.categories for select using (exists (select 1 from public.businesses b where b.id = business_id and b.status = 'active'));
create policy public_available_products on public.products for select using (available = true and stock > 0 and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'active'));
