-- Sistema de canje exclusivo: función atómica que valida y registra el canje server-side.
create or replace function registrar_canje(p_promo uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_promo promos%rowtype;
  v_count int;
  v_id uuid;
  v_created timestamptz;
begin
  if v_user is null then
    return jsonb_build_object('status', 'no_auth');
  end if;

  select * into v_promo from promos where id = p_promo and activa = true;
  if not found then
    return jsonb_build_object('status', 'invalida');
  end if;

  if exists (select 1 from canjes where user_id = v_user and promo_id = p_promo) then
    return jsonb_build_object('status', 'repetido');
  end if;

  if v_promo.limite_canjes is not null then
    -- bloqueo a nivel promo para evitar carrera en el conteo
    perform pg_advisory_xact_lock(hashtext(p_promo::text));
    select count(*) into v_count from canjes where promo_id = p_promo;
    if v_count >= v_promo.limite_canjes then
      return jsonb_build_object('status', 'agotada');
    end if;
  end if;

  insert into canjes (user_id, promo_id) values (v_user, p_promo)
    returning id, created_at into v_id, v_created;

  return jsonb_build_object(
    'status', 'ok',
    'canje_id', v_id,
    'codigo', upper(substr(replace(v_id::text, '-', ''), 1, 8)),
    'created_at', v_created
  );
end;
$$;

grant execute on function registrar_canje(uuid) to authenticated;
