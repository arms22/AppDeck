# App Deck

ブラウザだけで動く、静的アプリ用のランチャーです。ランチャー自身は外部 API やサーバー通信をせず、同じ静的配信内の `apps.json` とアプリ資産だけを読み込みます。

## 起動

静的サーバーで配信する場合、正規の `apps.json` を読み込みます。Node.js がある環境では次で起動できます。

```sh
npm install
npm run dev
```

`index.html` を直接開くこともできます。この場合はブラウザの `file://` セキュリティ制約のため、`assets/manifest-fallback.js` を使用します。アプリを追加・変更した後は、正規の `apps.json` を編集してから次を実行してください。

```sh
npm run sync:manifest
```

## アプリの追加

1. アプリごとに `apps/<app-id>/` ディレクトリを作り、その中へ静的ファイルを置きます。HTML の入口は `index.html` にします。
2. `apps.json` の `apps` 配列へ項目を追加します。
3. `type` に対応するプラグインを `src/plugins.js` へ登録します。標準の `top-level` は、アプリを最上位ページとして開きます。

すべてのアプリは `type: "top-level"` とし、ランチャーは iframe に埋め込まず各アプリを直接開きます。これにより `showDirectoryPicker()`、ファイル選択、ダウンロードなどブラウザ API の iframe 制約を回避します。

ルートは `#/`（ランチャー）と `#/app/:id`（アプリ）です。新しい描画方式は `src/plugins/` にモジュールを追加して遅延読み込みできます。

## Tailwind

`src/tailwind.css` を Tailwind v4 の入口として同梱しています。Node.js を導入後、`npm run build:css` で `assets/styles.css` を生成できます。
