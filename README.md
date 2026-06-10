# ポケモンアキネーター

AIがポケモンを1体思い浮かべ、プレイヤーがチャットで質問しながら当てるゲームです。

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 を開き、「プレイ」からゲームを始められます。

**APIキーなしでも動作します**（内蔵サンプルリスト + モックAI）。

## 環境変数

`.env.example` を `.env` にコピーして必要に応じて設定してください。

| 変数 | 説明 |
|---|---|
| `OPENAI_API_KEY` | OpenAI APIキー（未設定時はモックAI） |
| `OPENAI_MODEL` | 使用モデル（デフォルト: `gpt-4o-mini`） |
| `MICROCMS_SERVICE_DOMAIN` | microCMSのサービスドメイン |
| `MICROCMS_API_KEY` | microCMSのAPIキー |

## microCMS の設定手順

1. [microCMS](https://microcms.io/) でサービスを作成
2. `pokemons` エンドポイントを作成（API形式: リスト）
3. 以下のフィールドを登録:
   - `name_ja`（テキストフィールド）— 日本語名（例: ゲンガー）
   - `name_en`（テキストフィールド）— 英語名・小文字（例: gengar）
4. ポケモンを登録
5. `.env` に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を設定

PokeAPIは英語名・小文字でリクエストします（`gengar`, `pikachu` など）。

## 技術スタック

- Next.js (App Router)
- microCMS — 出題ポケモンリスト
- PokeAPI — タイプ・画像・伝説/幻の取得
- OpenAI API — Yes/No回答と正誤判定

## 設計メモ

- 答えのポケモン情報はサーバー側のセッションに保持（ブラウザからは見えない）
- タイトルページ `/`、ゲーム `/play`、出題一覧 `/pokemons`
- 質問は `/api/chat`（OpenAI）、答えの判定は `/api/guess`（サーバー側照合・トークン不要）
- ゲーム開始は `/api/game/start`

詳細は `pokemon-akinator-design.md` を参照してください。
