const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "src", "diagnosis.html");
const html = fs.readFileSync(htmlPath, "utf8");
const srcIndexPath = path.join(root, "src", "index.html");
const srcIndex = fs.readFileSync(srcIndexPath, "utf8");
const gamePath = path.join(root, "src", "memory-game.html");
const gameHtml = fs.readFileSync(gamePath, "utf8");
const mergePath = path.join(root, "src", "merge-game.html");
const mergeHtml = fs.readFileSync(mergePath, "utf8");
const match3Path = path.join(root, "src", "match3-game.html");
const match3Html = fs.readFileSync(match3Path, "utf8");
const battlePath = path.join(root, "src", "battle-game.html");
const battleHtml = fs.readFileSync(battlePath, "utf8");
const omikujiPath = path.join(root, "src", "omikuji-game.html");
const omikujiHtml = fs.readFileSync(omikujiPath, "utf8");
const takopanCoverPath = path.join(root, "assets", "takopan-memory-card-final.png");
const publicIndexPath = path.join(root, "index.html");
const publicIndex = fs.readFileSync(publicIndexPath, "utf8");
const portalPath = path.join(root, "src", "portal.html");
const portalHtml = fs.readFileSync(portalPath, "utf8");

function includes(text, message) {
  assert.ok(html.includes(text), message || `Expected HTML to include ${text}`);
}

function excludes(text, message) {
  assert.ok(!html.includes(text), message || `Expected HTML not to include ${text}`);
}

const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(scriptMatches.length >= 1, "Expected at least one inline script");
const appScript = scriptMatches.at(-1)[1];
const tempScript = path.join(os.tmpdir(), "opanchu-inline-check.js");
fs.writeFileSync(tempScript, appScript, "utf8");
const syntax = spawnSync(process.execPath, ["--check", tempScript], {
  encoding: "utf8",
});
assert.equal(
  syntax.status,
  0,
  `Inline JavaScript syntax check failed:\n${syntax.stderr || syntax.stdout}`,
);

const gameScriptMatches = [...gameHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(gameScriptMatches.length >= 1, "Expected game page to include inline script");
const gameScript = gameScriptMatches.at(-1)[1];
const tempGameScript = path.join(os.tmpdir(), "opanchu-memory-game-check.js");
fs.writeFileSync(tempGameScript, gameScript, "utf8");
const gameSyntax = spawnSync(process.execPath, ["--check", tempGameScript], {
  encoding: "utf8",
});
assert.equal(
  gameSyntax.status,
  0,
  `Game JavaScript syntax check failed:\n${gameSyntax.stderr || gameSyntax.stdout}`,
);

const mergeScriptMatches = [...mergeHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(mergeScriptMatches.length >= 1, "Expected merge page to include inline script");
const mergeScript = mergeScriptMatches.at(-1)[1];
const tempMergeScript = path.join(os.tmpdir(), "opanchu-merge-game-check.js");
fs.writeFileSync(tempMergeScript, mergeScript, "utf8");
const mergeSyntax = spawnSync(process.execPath, ["--check", tempMergeScript], {
  encoding: "utf8",
});
assert.equal(
  mergeSyntax.status,
  0,
  `Merge JavaScript syntax check failed:\n${mergeSyntax.stderr || mergeSyntax.stdout}`,
);

const match3ScriptMatches = [...match3Html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(match3ScriptMatches.length >= 1, "Expected match3 page to include inline script");
const match3Script = match3ScriptMatches.at(-1)[1];
const tempMatch3Script = path.join(os.tmpdir(), "opanchu-match3-game-check.js");
fs.writeFileSync(tempMatch3Script, match3Script, "utf8");
const match3Syntax = spawnSync(process.execPath, ["--check", tempMatch3Script], {
  encoding: "utf8",
});
assert.equal(
  match3Syntax.status,
  0,
  `Match3 JavaScript syntax check failed:\n${match3Syntax.stderr || match3Syntax.stdout}`,
);

const battleScriptMatches = [...battleHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(battleScriptMatches.length >= 1, "Expected battle page to include inline script");
const battleScript = battleScriptMatches.at(-1)[1];
const tempBattleScript = path.join(os.tmpdir(), "opanchu-battle-game-check.js");
fs.writeFileSync(tempBattleScript, battleScript, "utf8");
const battleSyntax = spawnSync(process.execPath, ["--check", tempBattleScript], {
  encoding: "utf8",
});
assert.equal(
  battleSyntax.status,
  0,
  `Battle JavaScript syntax check failed:\n${battleSyntax.stderr || battleSyntax.stdout}`,
);

const omikujiScriptMatches = [...omikujiHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(omikujiScriptMatches.length >= 1, "Expected omikuji page to include inline script");
const omikujiScript = omikujiScriptMatches.at(-1)[1];
const tempOmikujiScript = path.join(os.tmpdir(), "opanchu-omikuji-game-check.js");
fs.writeFileSync(tempOmikujiScript, omikujiScript, "utf8");
const omikujiSyntax = spawnSync(process.execPath, ["--check", tempOmikujiScript], {
  encoding: "utf8",
});
assert.equal(
  omikujiSyntax.status,
  0,
  `Omikuji JavaScript syntax check failed:\n${omikujiSyntax.stderr || omikujiSyntax.stdout}`,
);

["welcome", "quiz", "loading", "result"].forEach((id) => {
  includes(`id="${id}"`, `Missing screen #${id}`);
});

[
  "guideAsset",
  "resultGirl",
  "resultGear",
  "loadingMainOcto",
  "loadingRail",
  "jk_survival_board",
  "screenshot-mode",
].forEach((needle) => includes(needle));

[
  "girl_normal",
  "girl_tie",
  "girl_tback",
  "girl_sanitary",
  "girl_gray",
  "girl_seamless",
].forEach((assetKey) => includes(`"${assetKey}"`, `Missing asset key ${assetKey}`));

[
  "普通パンツタイプ",
  "紐パンタイプ",
  "Tバックタイプ",
  "サニタリーショーツタイプ",
  "ヨレヨレ・ネズミ色タイプ",
  "シームレスタイプ",
].forEach((resultName) => includes(resultName, `Missing result ${resultName}`));

includes("normal: 0", "Normal score bucket is missing");
includes("scores: { normal:", "No choice can produce the normal result");

[
  "朝起きて、前髪",
  "学校に行くモチベーション",
  "インスタのDMグループ",
  "体育は男女合同",
  "今からBeReal",
].forEach((question) => includes(question, `Missing question text: ${question}`));

// Takopan should be a just-in-time loading gimmick, not a persistent guide.
includes("タコパン鑑定中", "Takopan loading gimmick is missing");
includes("タコパンが鑑定札をめくっています", "Takopan loading copy is missing");
includes("無断複製、転載、コピーはおやめください", "Copy/repost notice is missing");
excludes("タコパン診断班", "Takopan should not be framed as a persistent diagnosis crew");
excludes("welcomeOctos", "Takopan should not appear on the welcome screen");
excludes("quizOctos", "Takopan should not appear throughout the quiz");
excludes("judgeOctos", "Takopan should not appear in the result panel");

const qCount = (appScript.match(/\btext: '/g) || []).length;
assert.ok(qCount >= 5, `Expected question/result text data, found only ${qCount} text entries`);

assert.ok(
  publicIndex.includes("src/portal.html"),
  "Root index.html should link to the portal page",
);
assert.ok(
  !publicIndex.includes("src/diagnosis.html"),
  "Root index.html should keep diagnosis/game links on the portal page",
);
[
  "assets/opanchu-hero-logo.png",
  "assets/opanchu-enter-sign.png",
  "ゲームページへ",
].forEach((needle) => {
  assert.ok(publicIndex.includes(needle), `Root index should include ${needle}`);
});
assert.ok(
  portalHtml.includes("diagnosis.html"),
  "Portal page should link to diagnosis.html",
);
assert.ok(
  portalHtml.includes("memory-game.html"),
  "Portal page should link to the memory game",
);
assert.ok(
  portalHtml.includes("merge-game.html"),
  "Portal page should link to the merge game",
);
assert.ok(
  portalHtml.includes("match3-game.html"),
  "Portal page should link to the match3 game",
);
assert.ok(
  portalHtml.includes("battle-game.html"),
  "Portal page should link to the battle game",
);
assert.ok(
  portalHtml.includes("omikuji-game.html"),
  "Portal page should link to the omikuji game",
);
["おぱんちゅラボ", "../assets/opanchu-hero-logo.png", "../assets/takopan-memory-card-final.png", "JKパンツ生存戦略診断"].forEach((needle) => {
  assert.ok(portalHtml.includes(needle), `Portal should include ${needle}`);
});
["girl-normal.png", "girl-tie.png", "girl-tback.png", "girl-sanitary.png", "girl-gray.png", "girl-seamless.png"].forEach((fileName) => {
  assert.ok(portalHtml.includes(`../asset/generated-types/${fileName}`), `Portal should reference ${fileName}`);
});
assert.ok(srcIndex.includes("../index.html"), "src/index.html should redirect to the portal");
["このURLは", "portal.html", "診断を直接開く", "memory-game.html", "merge-game.html", "match3-game.html", "battle-game.html", "omikuji-game.html"].forEach((needle) => {
  assert.ok(srcIndex.includes(needle), `src/index.html should explain the moved URL: ${needle}`);
});
["おぱんちゅ神経衰弱", "pairs", "moves", "opanchu_memory_best"].forEach((needle) => {
  assert.ok(gameHtml.includes(needle), `Missing game text or control: ${needle}`);
});
assert.ok(gameHtml.includes("../assets/takopan-memory-card-final.png"), "Game should use the final Takopan card image");
assert.ok(fs.existsSync(takopanCoverPath), "Takopan cover image is missing");
for (let i = 1; i <= 12; i += 1) {
  const fileName = `p${String(i).padStart(2, "0")}.png`;
  const shortsPath = path.join(root, "assets", "shorts", fileName);
  assert.ok(gameHtml.includes(`../assets/shorts/${fileName}`), `Game should reference ${fileName}`);
  assert.ok(fs.existsSync(shortsPath), `Missing shorts image ${fileName}`);
}
["level", "nextLevelBtn", "opanchu_memory_best_level_"].forEach((needle) => {
  assert.ok(gameHtml.includes(needle), `Missing level feature: ${needle}`);
});
["おぱんちゅマージ", "opanchu_merge_closet_best", "同じ札を2枚", "drawBtn", "hintBtn"].forEach((needle) => {
  assert.ok(mergeHtml.includes(needle), `Missing merge game feature: ${needle}`);
});
for (let i = 1; i <= 12; i += 1) {
  const fileName = `p${String(i).padStart(2, "0")}.png`;
  assert.ok(mergeHtml.includes(`../assets/shorts/${fileName}`), `Merge game should reference ${fileName}`);
}
["おぱんちゅお片づけパズル", "opanchu_match3_best_stage_", "findPossibleMove", "refillBoard", "preferTargets", "rows: 5", "cols: 5", "types: 8", "stage: 10"].forEach((needle) => {
  assert.ok(match3Html.includes(needle), `Missing match3 feature: ${needle}`);
});
for (let i = 1; i <= 8; i += 1) {
  const fileName = `p${String(i).padStart(2, "0")}.png`;
  assert.ok(match3Html.includes(`../assets/shorts/${fileName}`), `Match3 game should reference ${fileName}`);
}
["おぱんちゅ盤上バトル", "movesFor", "PLAYER 1", "PLAYER 2", "王札"].forEach((needle) => {
  assert.ok(battleHtml.includes(needle), `Missing battle feature: ${needle}`);
});
for (let i = 1; i <= 6; i += 1) {
  const fileName = `p${String(i).padStart(2, "0")}.png`;
  assert.ok(battleHtml.includes(`../assets/shorts/${fileName}`), `Battle game should reference ${fileName}`);
}
["おぱんちゅみくじ", "今日のみくじ", "opanchu_omikuji_history", "seededPick", "resultText"].forEach((needle) => {
  assert.ok(omikujiHtml.includes(needle), `Missing omikuji feature: ${needle}`);
});
assert.ok(omikujiHtml.includes("Array.from({ length: 12 }"), "Omikuji game should build the 12 shorts image list");
assert.ok(omikujiHtml.includes("../assets/shorts/p01.png"), "Omikuji page should have an initial shorts image");

console.log("Static checks passed.");
