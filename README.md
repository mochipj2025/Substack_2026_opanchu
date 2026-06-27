# JKパンツ生存戦略診断

女子高生の日常テンション、SNS耐性、朝のメンタルを「パンツ=サバイバルギア」として偏見100%で診断する、エロさゼロのギャグ診断SPAです。

## 現在の成果物

- `src/diagnosis.html`: 1ファイル完結の診断アプリ本体
- `src/memory-game.html`: おぱんちゅ神経衰弱ミニゲーム
- `src/merge-game.html`: おぱんちゅマージミニゲーム
- `docs/01_企画書.md`: 企画の目的、世界観、ユーザー体験
- `docs/02_実装計画書.md`: フェーズ、作業順、検証観点
- `docs/03_設計書.md`: 画面設計、データ設計、状態管理
- `docs/04_アセット台帳.md`: 既存素材の役割分担
- `asset/README.md`: 素材フォルダ内の確認メモ

## 起動方法

`index.html` は入口メニューです。診断は `src/diagnosis.html`、神経衰弱は `src/memory-game.html`、マージは `src/merge-game.html` から直接開けます。`src/index.html` は入口へ戻す案内ページです。

ローカルサーバーで確認する場合:

```powershell
cd "D:\00000\M.O.C.H.I. LABO_Vault\おぱんちゅPJ\src"
python -m http.server 8124 --bind 127.0.0.1
```

## 共有方法

他の人に共有する場合は、GitHub Pagesで公開するのが簡単です。

1. GitHubのリポジトリ設定を開く
2. `Settings` -> `Pages`
3. `Build and deployment` の `Source` を `Deploy from a branch` にする
4. `Branch` を `main`、フォルダを `/ (root)` にする
5. 保存後、表示されるPages URLを共有する

リポジトリ直下の `index.html` は公開用の入口で、実体の `src/index.html` に自動で移動します。

## テスト

外部依存なしで、HTML構成とインラインJavaScript構文を確認します。

```powershell
npm test
```

## 重要な方針

- 下着テーマはギャグ・記号・診断ロジックとして扱う。
- 性的な演出、露骨な表現、リアル寄りの見せ方は避ける。
- ガイドキャラとパンツタイプ別の女の子を前面に出し、SNSでツッコミやすい体験にする。
- タコパンは常駐させず、回答後から結果前の「鑑定中」ギミックに限定して登場させる。
- 1ファイルSPA要件を守るため、画像は軽量化してHTML内に埋め込む。
- 画像・文章・診断結果の無断複製、転載、コピーは控えてもらう注意事項を明示する。
