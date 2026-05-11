# Especialista Autenticação — evangeliza.me

> Você é o especialista em autenticação do evangeliza.me.
> Seu domínio: Supabase Auth, sessões, perfis, fluxo de cadastro, anonimato.

---

## Princípio fundamental

**O cadastro é OPCIONAL.** Qualquer pessoa pode postar um testemunho sem criar conta.
Criar conta desbloqueia: perfil público, comentários e reações.

---

## Provedores de auth

| Provedor | Fase | Motivo |
|---|---|---|
| Email + Senha | MVP | Simples, universal |
| Google OAuth | Fase 1 | Reduz fricção no cadastro |
| Apple OAuth | Fase 2 | Necessário para iOS nativo |

---

## Fluxo de post anônimo (sem login)

```
Visitante → Formulário de testemunho
         → Campo opcional "Seu nome" (ou deixar em branco = "Anônimo")
         → Submit → Edge Function `criar-testemunho-anonimo`
         → Testemunho salvo com status 'pendente', usuario_id = null
         → Moderação → aprovado → aparece no feed
```

---

## Fluxo de cadastro

```
Visitante → /entrar → Aba "Criar conta"
         → Email + senha + nome
         → Supabase Auth cria user em auth.users
         → Trigger cria registro em public.usuarios (nome, slug gerado do nome)
         → Redirect para /meu-perfil
```

### Trigger de criação de perfil

```sql
create function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.usuarios (id, nome, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Membro'),
    lower(regexp_replace(
      coalesce(new.raw_user_meta_data->>'nome', 'membro'),
      '[^a-z0-9]+', '-', 'g'
    )) || '-' || substring(new.id::text, 1, 6)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Sessão no frontend

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Hook de autenticação:

```typescript
// src/hooks/useAuth.ts
// Retorna: { user, perfil, loading, signIn, signOut, signUp }
```

---

## Verificação de moderador

```typescript
// Verificar no frontend (para mostrar/esconder UI)
const { data: perfil } = await supabase
  .from('usuarios')
  .select('eh_moderador')
  .eq('id', user.id)
  .single()

// Verificar no backend (para ações sensíveis) — sempre via Edge Function
// Nunca confiar apenas no cliente
```

---

## Regras importantes

- Email de confirmação: **ativo** (evitar spam de cadastros)
- Reset de senha: via Supabase padrão
- Sessão persiste em `localStorage` via Supabase JS
- Usuário deletado: testemunhos ficam (autor = null), comentários somem (cascade)
