# FamTask Lite

みく・こはるの「今日やること」だけに絞った、1画面の軽量タスクアプリです。

- React + Vite（JavaScript）
- DB / API / サーバー処理なし
- チェック状態だけを `localStorage` の `famtask-lite-checks` に保存
- 端末の日付が変わるとチェック状態を自動リセット

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run test
npm run build
```

`dist` ディレクトリに静的サイトが出力されます。
