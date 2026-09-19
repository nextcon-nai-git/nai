# NAI - Nextcon Intelligence

Este repositório consolida a base do produto NAI com a stack de entrega mobile e lançamento institucional da versão enterprise.

## Objetivo

A plataforma foi concebida para:
- centralizar dados de saúde, SST e gestão documental
- apoiar avaliação, acompanhamento e auditoria médica
- automatizar triagem documental e análise operacional
- aplicar regras de acesso por empresa, perfil e papel
- operar de forma híbrida web + mobile nativo via Capacitor

## Stack principal

- Next.js 15
- React 19
- TypeScript
- Firebase / Google Cloud
- Genkit + Gemini
- Firestore e Storage
- Capacitor 7 para iOS e Android

## Regras de uso

- Este repositório deve ser usado apenas para desenvolvimento, homologação e documentação interna.
- Dados reais de clientes, documentos sensíveis e credenciais não devem ser publicados em repositórios públicos.
- Os ambientes de produção devem usar autenticação, rede privada e segredos próprios, com acesso restrito.

## Desenvolvimento

```bash
npm install
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Mobile / Capacitor

```bash
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

## Implantação

```bash
npm run infra:rules
npm run infra:deploy
```

## Segurança

Consulte `SECURITY.md` para política de vulnerabilidades e boas práticas.

## Aviso

Este projeto trata de dados sensíveis e exige controles de acesso, auditoria, retenção e governança adequados antes de uso em produção com dados reais.
