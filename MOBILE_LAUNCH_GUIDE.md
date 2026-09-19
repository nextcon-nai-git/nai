# Guia Oficial de Lançamento Mobile: Nextcon NAI (iOS & Android)

Este guia orienta o time de engenharia e operações da NextCon a compilar, testar e publicar o aplicativo Nextcon NAI na Apple App Store e Google Play Store.

## Visão geral

- App ID / Bundle Identifier: `br.com.nextcon.nai`
- Nome de Exibição: `Nextcon NAI`
- Tecnologia: Capacitor 7 + Next.js 15 (Turbopack)
- Cores da marca: fundo Navy `#001F3F` com brasão NXC

## Comandos rápidos

```bash
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

## Publicação no iOS

1. Abrir o projeto no Xcode com `npm run cap:open:ios`.
2. Configurar assinatura em Signing & Capabilities.
3. Selecionar a conta da Apple Developer.
4. Garantir Bundle Identifier `br.com.nextcon.nai`.
5. Executar o app em simulador ou iPhone físico.
6. Fazer archive e distribuir via TestFlight / App Store Connect.

## Publicação no Android

1. Abrir no Android Studio com `npm run cap:open:android`.
2. Gerar keystore para release.
3. Compilar `app-release.aab`.
4. Submeter na Google Play Console.

## Híbrido em produção

No `capacitor.config.ts`, o app pode apontar para a URL pública em produção usando `server.url` com HTTPS.

## Observação

Essa documentação foi integrada ao repositório principal para manter a base do projeto e a entrega mobile em um único lugar.
