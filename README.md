# Dynamic Site Template

SiteCraft **動的サイトオプション（月額¥12,800 / 初期費用0円）** 向けテンプレート。

ブランド訴求・世界観重視のコーポレート／ポートフォリオサイト用。

## 構成

```
dynamic-template/
├── index.html        メイン（全セクション・全[EDIT]マーカー入り）
├── style.css         ダーク＋ゴールドの標準テーマ
├── script.js         GSAP+ScrollTrigger+Lenis アニメーション制御
├── images/           画像配置先（work1.jpg〜work4.jpg, ogp.jpg）
└── README.md         このファイル
```

## 使用ライブラリ（CDN読み込み）

| ライブラリ | 用途 |
|---|---|
| GSAP 3.12 | アニメーション基盤 |
| ScrollTrigger | スクロール連動 |
| Lenis 1.1 | スムーススクロール |

すべてCDN配信。npm install不要、静的ホスティング（Vercel/Netlify/Cloudflare）で動作。

## 実装済みの動き

- ローディング画面（プログレスバー）
- カスタムカーソル（PCのみ、mix-blend-modeで反転）
- ヘッダーのスクロール時の背景切替
- ヒーローの行単位テキスト出現
- セクションタイトルの文字単位出現
- スクロール連動パララックス背景
- Services項目のホバー演出
- Worksカードの画像ズーム
- 数字カウンターアニメーション
- マーキー流れるテキスト

## カスタマイズ手順

### 1. カラー変更（style.css 上部 `:root`）
```css
--bg: #0a0a0a;         /* 背景 */
--fg: #f2ede4;         /* 文字 */
--accent: #d4a574;     /* アクセント（ゴールド） */
```

業種別推奨例：
- **士業・コンサル**: bg=#0f1620, accent=#c9a46a（ネイビー+ゴールド）
- **美容・ヘアサロン**: bg=#faf6f2, fg=#2a2622, accent=#a8826b（白+モカ）
- **建築・不動産**: bg=#1a1a1a, accent=#c8b08a（ダークグレー+ベージュ）
- **レストラン**: bg=#0d0a08, accent=#b8925c（黒+ブロンズ）

### 2. テキスト差し替え（index.html 内 `[EDIT]` マーカー）
- タイトル・メタ情報
- ヒーローコピー
- Services項目（4項目、増減可）
- Works（4枠、増減可）
- Stats数字（data-counter属性）
- 連絡先

### 3. 画像差し替え（images/）
- `work1.jpg` 〜 `work4.jpg`: Worksグリッド用（4:3推奨、1600x1200px）
- `ogp.jpg`: OGP画像（1200x630px）

画像がない場合はCSSグラデーションプレースホルダーにフォールバック。

## 制作工数目安

- 既存バケーリーテンプレの置き換え: 12-16時間
- 新規業種向けカスタマイズ: 14-18時間
- フルスクラッチの動的サイト（gerbera-group級）: 20-30時間

## 注意

- **prefers-reduced-motion対応**: ユーザー設定を尊重、動きを抑制
- **モバイル**: カスタムカーソル・パララックスは無効化
- **SEO**: 構造化データ・OGP・canonical設定済み
- **Lighthouse**: Performance 85+, Accessibility 95+ を目標に設計

## ライセンス

内部使用。クライアント納品時は納品物として譲渡、ソース自体はSiteCraft資産として保持。
