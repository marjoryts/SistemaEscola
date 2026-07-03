# SistemaEscola

Controle de reserva de dispositivos para instituições de ensino.

## O problema

Escolas que disponibilizam computadores e tablets para professores usarem em sala de aula enfrentam um desafio simples: não há registro de quem pegou o quê, quando, e em que estado o equipamento estava. Um papel na sala dos professores resolve parcialmente, mas dados se perdem, não há visibilidade para a coordenação, e equipamentos danificados viram dor de cabeça.

## O que o sistema faz

O SistemaEscola centraliza o registro de reservas de dispositivos. Professores fazem login, informam quantos computadores e tablets estão pegando, quantos estavam com problemas, e registram observações. A coordenação (admin) tem uma visão panorâmica de todas as reservas, consegue alterar status (pendente, confirmado, concluído, cancelado) e manter um histórico confiável.

### Principais recursos

- **Autenticação** — Professores e administradores acessam o sistema com email e senha; cada um vê apenas o que precisa.
- **Reserva de dispositivos** — Ao pegar equipamentos, o professor registra a data, horário, quantidades (disponíveis e com defeito) e observações.
- **Histórico do professor** — Cada professor acompanha as próprias reservas e pode excluir registros.
- **Dashboard administrativo** — Visão geral de todas as reservas da instituição, com filtros por status e ações para gerenciar cada uma.
- **QR code na entrada** — A página inicial exibe um QR code com o link do sistema para acesso rápido pelo celular.

## Fluxo de uso

1. O professor acessa o sistema pelo link ou escaneia o QR code.
2. Faz login ou cria uma conta (novos usuários já nascem como professores).
3. Na página inicial, escolhe entre fazer uma nova reserva ou ver o histórico.
4. Ao reservar, informa os dados da retirada — o sistema salva tudo vinculado ao professor.
5. O admin acompanha as reservas em tempo real, atualiza status conforme o fluxo e mantém o controle geral.

## Stack

Next.js · React · TypeScript · Tailwind CSS · Supabase (autenticação + banco de dados)

## Status

Em desenvolvimento ativo. O schema do banco e as regras de segurança (RLS) já estão definidos, e as funcionalidades principais implementadas.
