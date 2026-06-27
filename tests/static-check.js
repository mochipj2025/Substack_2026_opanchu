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
const takopanCoverPath = path.join(root, "assets", "takopan-memory-card-final.png");
const publicIndexPath = path.join(root, "index.html");
const publicIndex = fs.readFileSync(publicIndexPath, "utf8");

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
  "紐パンタイプ",
  "Tバックタイプ",
  "サニタリーショーツタイプ",
  "ヨレヨレ・ネズミ色タイプ",
  "シームレスタイプ",
].forEach((resultName) => includes(resultName, `Missing result ${resultName}`));

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
  publicIndex.includes("src/diagnosis.html"),
  "Root index.html should link to src/diagnosis.html",
);
assert.ok(
  publicIndex.includes("src/memory-game.html"),
  "Root index.html should link to the memory game",
);
assert.ok(
  publicIndex.includes("src/merge-game.html"),
  "Root index.html should link to the merge game",
);
["おぱんちゅラボ", "assets/takopan-memory-card-final.png", "JKパンツ生存戦略診断"].forEach((needle) => {
  assert.ok(publicIndex.includes(needle), `Root index should include ${needle}`);
});
["girl-normal.png", "girl-tie.png", "girl-tback.png", "girl-sanitary.png", "girl-gray.png", "girl-seamless.png"].forEach((fileName) => {
  assert.ok(publicIndex.includes(`asset/generated-types/${fileName}`), `Root index should reference ${fileName}`);
});
assert.ok(srcIndex.includes("../index.html"), "src/index.html should redirect to the portal");
["このURLは", "診断を直接開く", "memory-game.html", "merge-game.html"].forEach((needle) => {
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

console.log("Static checks passed.");
