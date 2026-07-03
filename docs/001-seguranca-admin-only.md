# 001 — Segurança: modelo admin-only

## Contexto

O sistema foi pensado inicialmente para que professores fizessem
autocadastro e gerenciassem suas próprias reservas. Porém, como o
sistema lida com login/senha, qualquer pessoa com um email consegue
criar conta — incluindo alunos ou pessoas de fora da escola.

Para a V1, a proposta é simplificar e eliminar esse risco: **só a
admin opera o sistema**. Professores não acessam a plataforma, apenas
a admin registra as reservas para eles.

## Modelo atual (self-service)

```
Professor se cadastra com email/senha → faz login → cria própria reserva
Admin loga → gerencia todas as reservas
```

## Modelo proposto (admin-only)

```
Admin loga com email/senha → cria reservas para os professores → gerencia tudo
Professor não acessa o sistema
```

## Vantagens

- **Cadastro público removido** → zero risco de aluno ou estranho
  acessar
- **Única forma de entrar** → admin pré-criado manualmente no Supabase
- **Sem role checks complexas** → todo usuário logado é admin
- **Superfície de ataque reduzida** → menos código, menos falhas
- **Controle centralizado** → admin garante que os dados sejam
  preenchidos corretamente

## Desvantagens / Pontos de atenção

- **Sobrecarga da admin** — ela precisa preencher todas as reservas
  manualmente
- **Professores sem autonomia** — não conseguem consultar histórico
  próprio sem pedir para a admin
- **Ponto único de falha** — se a admin não consegue logar, ninguém
  usa o sistema

## Mudanças necessárias

### 1. Login — remover cadastro público

**Arquivo:** `src/app/login/page.tsx`

- Eliminar o toggle entre "Entrar" e "Criar Conta"
- Manter apenas o formulário de login com email e senha
- Redirecionar para `/admin` após login bem-sucedido (em vez de
  `/reservar`)

### 2. Página inicial — simplificar

**Arquivo:** `src/app/page.tsx`

- Se não logado: mostrar QR code + botão "Fazer Login" (como já está)
- Se logado: redirecionar direto para `/admin` (ou mostrar um atalho
  único para o dashboard)
- Remover os links "Nova Reserva", "Minhas Reservas" e "Admin"

### 3. Dashboard admin — unificar

**Arquivo:** `src/app/admin/page.tsx`

- Vira a página principal pós-login
- Pode juntar criação de reserva + listagem + gestão em uma única
  tela (ou manter separado, mas acessível pelo navbar)
- Futuro: considerar renomear a rota para `/dashboard`

### 4. Navbar — simplificar

**Arquivo:** `src/components/Navbar.tsx`

- Remover links que não fazem mais sentido (Nova Reserva, Minhas
  Reservas)
- Manter apenas: Dashboard (admin), Sair

### 5. Páginas que podem ser removidas ou redirecionadas

**Arquivos:** `src/app/reservas/page.tsx`

- "Minhas Reservas" perde o sentido — remover a rota ou redirecionar
  para `/admin`

### 6. Supabase — desabilitar signup público

- No dashboard do Supabase: `Authentication > Settings > Disable
  public signup`
- Criar o usuário admin manualmente pelo Supabase Auth

## Segurança resultante

- **Cadastro público desabilitado** no Supabase e no frontend
- **Único jeito de entrar** — admin criado manualmente
- **RLS no banco** ainda funciona como fallback
- **Sem exposição de dados** para não-autenticados

## Em discussão

- A admin deve criar reservas para os professores, ou os professores
  devem ter acesso limitado (só criar, sem ver dados dos outros)?
- A médio prazo, vale a pena implementar uma role `teacher` com
  permissões restritas?
- A navbar deve mostrar o nome da admin logada?
- Devemos ter uma tela de "esqueci minha senha" desde a V1?
