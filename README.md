# 📊 体重管理アプリ

日々の体重と体脂肪率を記録・管理できるWebアプリケーションです。PCとiPhoneの両方で快適に使用でき、PWA（Progressive Web App）対応によりホーム画面に追加してネイティブアプリのように使用できます。

## ✨ 機能

- 📝 **データ入力**: 体重と体脂肪率を簡単に記録
- 📅 **カレンダー表示**: 過去のデータを月別に閲覧
- 📈 **グラフ表示**: 直近30日間の推移を視覚化
- 💾 **データ永続化**: localStorageによるオフライン保存
- 📱 **レスポンシブ対応**: PC・タブレット・スマートフォンで最適表示
- 🚀 **PWA対応**: iPhoneのホーム画面に追加可能

## 🖥️ デモ

（GitHub Pagesで公開後、URLをここに記載）

## 📦 インストール・使用方法

### ローカルでの使用

1. このリポジトリをクローンまたはダウンロード

```bash
git clone https://github.com/[あなたのユーザー名]/weight-tracker.git
cd weight-tracker
```

2. ローカルサーバーを起動

```bash
# Pythonを使用する場合
python -m http.server 8000

# Node.jsのhttp-serverを使用する場合
npx http-server -p 8000
```

3. ブラウザで開く

```
http://localhost:8000
```

### GitHub Pagesでの公開

1. GitHubリポジトリを作成

2. コードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[あなたのユーザー名]/weight-tracker.git
git push -u origin main
```

3. GitHub Pagesを有効化
   - リポジトリの「Settings」→「Pages」へ移動
   - Source: `main` ブランチを選択
   - 保存後、数分で公開URL（例: `https://[ユーザー名].github.io/weight-tracker/`）が表示されます

### iPhoneでホーム画面に追加

1. Safariで公開URLにアクセス
2. 画面下部の共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択
4. アプリ名を確認して「追加」をタップ
5. ホーム画面にアイコンが追加されます

## 🎨 アイコンのカスタマイズ

現在、`icons/favicon.svg`にSVG形式のアイコンが用意されています。PNG形式のアイコンを生成する場合：

### オンラインツールを使用

1. [CloudConvert](https://cloudconvert.com/svg-to-png) などのツールで変換
2. SVGファイルをアップロード
3. 192x192px と 512x512px の2つのサイズで出力
4. `icons/icon-192.png` と `icons/icon-512.png` として保存

### 独自のアイコンを作成

1. `icons/favicon.svg` を編集して好みのデザインに変更
2. 上記の方法でPNGに変換
3. `manifest.json` の設定はそのまま使用可能

## 📂 プロジェクト構造

```
weight-tracker/
├── index.html          # メインHTML
├── manifest.json       # PWA manifest
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── app.js         # メインアプリケーション
│   ├── storage.js     # データ永続化
│   ├── calendar.js    # カレンダー機能
│   └── chart.js       # グラフ描画
├── icons/
│   ├── icon-192.png   # PWAアイコン（192x192）
│   ├── icon-512.png   # PWAアイコン（512x512）
│   └── favicon.svg    # ファビコン
└── README.md          # このファイル
```

## 🔧 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: レスポンシブグリッドレイアウト
- **JavaScript (ES6+)**: モジュール構造
- **Chart.js**: グラフ描画ライブラリ
- **localStorage**: データ永続化
- **PWA**: manifest.json、Service Worker対応可能

## 💡 使い方

1. **データ入力**
   - カレンダーから日付を選択（デフォルトは今日）
   - 体重と体脂肪率を入力
   - 「保存」ボタンをクリック

2. **データ閲覧**
   - カレンダーの◀▶ボタンで月を移動
   - データがある日は青色でハイライト表示
   - 日付をクリックすると、その日のデータが表示されます

3. **データ編集**
   - 過去の日付を選択
   - 新しい値を入力して「保存」
   - 既存のデータが上書きされます

4. **データ削除**
   - データがある日付を選択
   - 「削除」ボタンをクリック
   - 確認ダイアログで「OK」を選択

5. **グラフ確認**
   - 直近30日間のデータが自動的にグラフ表示されます
   - 体重（青線）と体脂肪率（オレンジ線）の2軸グラフ
   - グラフにマウスを乗せると詳細データを確認可能

## 🌐 ブラウザ対応

- Chrome（推奨）
- Safari（iOS対応）
- Firefox
- Edge

## 📝 データ形式

データはlocalStorageに以下の形式で保存されます：

```json
{
  "2026-02-28": {
    "weight": 70.5,
    "bodyFat": 18.5,
    "timestamp": "2026-02-28T12:00:00.000Z"
  }
}
```

## 🔒 プライバシー

- すべてのデータはブラウザのlocalStorageにローカル保存されます
- サーバーへのデータ送信は一切ありません
- データのバックアップはブラウザのデータとともに管理されます

## 🤝 貢献

バグ報告や機能提案は、GitHubのIssuesでお願いします。

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

[あなたの名前]

---

**Enjoy tracking your weight! 💪**
