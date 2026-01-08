#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log("🚀 Copilot Agent: Generate Project Structure");

// 讀 repo 根目錄
const repoRoot = process.cwd();
const outputFile = path.join(repoRoot, "project-structure.json");

// 遞迴生成樹狀結構
function scanDir(dir) {
  const stats = fs.statSync(dir);
  if (stats.isFile()) return null;

  const files = fs.readdirSync(dir).map((file) => {
    const fullPath = path.join(dir, file);
    const subTree = scanDir(fullPath);
    return subTree ? { [file]: subTree } : file;
  });

  return files;
}

// 建樹
const projectTree = { [path.basename(repoRoot)]: scanDir(repoRoot) };

// 寫入 JSON
fs.writeFileSync(outputFile, JSON.stringify(projectTree, null, 2));

console.log(`✅ Project structure saved to ${outputFile}`);
