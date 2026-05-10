#!/bin/bash
# =============================================================
# SYNC-REPO.command
#
# Sincroniza a pasta "Site Pronto" (código novo) com o repo git
# sitepronto-repo, limpando artefatos antigos que bloqueiam o
# processamento do Tailwind CSS.
#
# Uso: duplo clique neste arquivo no Finder.
# =============================================================

set -e

SOURCE="/Users/fabioalves/Desktop/VibeCode/SitePronto/Site Pronto"
REPO="/Users/fabioalves/Desktop/VibeCode/SitePronto/sitepronto-repo"

echo ""
echo "========================================================="
echo "  SitePronto — Sync Repo"
echo "========================================================="
echo ""

if [ ! -d "$SOURCE" ]; then
  echo "ERRO: pasta de origem nao encontrada: $SOURCE"
  read -p "Pressione ENTER para fechar..."
  exit 1
fi

if [ ! -d "$REPO/.git" ]; then
  echo "ERRO: repo git nao encontrado em $REPO"
  echo ""
  echo "Clone primeiro rodando no terminal:"
  echo "  cd /Users/fabioalves/Desktop/VibeCode/SitePronto"
  echo "  git clone https://github.com/EdCryptoFi/sitepronto.git sitepronto-repo"
  read -p "Pressione ENTER para fechar..."
  exit 1
fi

cd "$REPO"

# 1. Mata qualquer servidor Next rodando
echo "[1/7] Parando servidores Next em execucao..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
sleep 1

# 2. Limpa TUDO do repo EXCETO .git
echo "[2/7] Limpando arquivos antigos (mantendo .git)..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} + 2>/dev/null || true

# 3. Copia TUDO da pasta "Site Pronto" (incluindo .gitignore)
echo "[3/7] Copiando codigo novo..."
cp -R "$SOURCE/." "$REPO/"

# 4. Remove arquivos que NAO devem existir no repo
echo "[4/7] Removendo duplicatas e caches..."
rm -f "$REPO/next.config.ts"          # Next 14 nao le .ts
rm -f "$REPO/SYNC-REPO.command"       # Este script nao vai pro repo
rm -rf "$REPO/.next"                  # Cache de build
rm -rf "$REPO/node_modules"           # Reinstalacao limpa
rm -f  "$REPO/package-lock.json"      # Regenera
rm -f  "$REPO/tsconfig.tsbuildinfo"   # Cache TS

# 5. Instala dependencias
echo "[5/7] Instalando dependencias (30-60s)..."
cd "$REPO"
npm install 2>&1 | tail -3

# 6. Verifica Tailwind presente
echo "[6/7] Verificando Tailwind..."
if [ ! -f "$REPO/node_modules/tailwindcss/package.json" ]; then
  echo "  -> Tailwind faltando, instalando explicitamente..."
  npm install --save-dev tailwindcss@^3.3.0 postcss@^8 autoprefixer@^10
fi
echo "  -> OK"

# 7. Commit + push
echo "[7/7] Commit + push para o GitHub..."
cd "$REPO"
git add -A
if git diff --cached --quiet; then
  echo "  -> Nada novo para commitar."
else
  git commit -m "feat: admin Craft.js editor, middleware auth, TemplateSelector quiz, SEGMENT_TO_TEMPLATE"
  git push
  echo "  -> Push concluido. A Vercel vai deployar em 1-2 min."
fi

echo ""
echo "========================================================="
echo "  Pronto!"
echo ""
echo "  Teste local:"
echo "    cd '$REPO' && npm run dev"
echo "    abra http://localhost:3000"
echo ""
echo "  Dashboard Vercel:"
echo "    https://vercel.com/dashboard"
echo "========================================================="
echo ""
read -p "Pressione ENTER para fechar esta janela..."
