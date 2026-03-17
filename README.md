# NAI - Nextcon AI | Inteligência 2026

Esta é a plataforma **Nextcon Intelligence**, um ecossistema Google-Native para gestão estratégica de Saúde, Segurança do Trabalho (SST) e Auditoria Médica.

## 🚀 Infraestrutura Google de Ponta
Acesse o portal oficial hospedado integralmente no Google Cloud: [https://nai.nextconsaude.com.br](https://nai.nextconsaude.com.br)

## 🛠️ Tecnologias Utilizadas
- **Core**: Next.js 15 (App Router), React 19, TypeScript.
- **Compute**: Google Cloud Run / Firebase App Hosting.
- **AI**: Genkit 1.x + Gemini 2.0 Flash (Streaming, Voice TTS).
- **Interface**: Tailwind CSS, ShadCN UI, Lucide Icons.

## 📦 Repositório e Deploy
Para realizar o commit inicial e o deploy:

```bash
# Inicialize e conecte ao GitHub
git init
git remote add origin https://github.com/nextconsst/studio-8439299034.git
git branch -M main
git add .
git commit -m "Initial commit: NAI Platform Setup"
git push -u origin main

# Deploy de Infraestrutura
npm run infra:deploy
```

## 🌐 Configuração DNS
Para validar o domínio `nai.nextconsaude.com.br`, adicione o registro TXT no seu DNS:
- **Hostname**: `_gh-nextcon-sst-e.nai.nextconsaude.com.br`
- **Valor**: `a9925fdf66`

---
© 2026 Nextcon Saúde Empresarial • Inteligência NAI em SST.