-- Farmers must not receive a broad UPDATE RLS policy on orders. This controlled RPC is
-- the only farmer payment transition and verifies ownership using the caller JWT.
create or replace function public.pay_for_order(p_order_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
     set payment_status = 'completed', order_status = 'processing'
   where id = p_order_id
     and farmer_id = auth.uid()
     and payment_status = 'pending';
  if not found then
    raise exception 'Order not found, is not yours, or has already been paid';
  end if;
end;
$$;

revoke all on function public.pay_for_order(bigint) from public;
grant execute on function public.pay_for_order(bigint) to authenticated;
