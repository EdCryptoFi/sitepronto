#!/bin/bash
# ─── EXPORTAR SITEPRONTO ────────────────────────────────────────────
# Duplo-clique para gerar um ZIP completo do projeto (sem node_modules)
# O ZIP inclui .env.local e tudo que precisa para rodar em outro HD.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="SitePronto-$(date +%Y-%m-%d)"
DESKTOP="$HOME/Desktop"
OUTPUT="$DESKTOP/$PROJECT_NAME.zip"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📦  Exportando projeto SitePronto"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Origem: $SCRIPT_DIR"
echo "Destino: $OUTPUT"
echo ""

cd "$SCRIPT_DIR/.."

zip -r "$OUTPUT" "Site Pronto" \
  --exclude "Site Pronto/node_modules/*" \
  --exclude "Site Pronto/.next/*" \
  --exclude "Site Pronto/.git/*" \
  --exclude "Site Pronto/.DS_Store" \
  --exclude "Site Pronto/**/.DS_Store"

SIZE=$(du -sh "$OUTPUT" | cut -f1)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  ZIP gerado com sucesso!"
echo "  📁  $OUTPUT"
echo "  📏  Tamanho: $SIZE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para restaurar no HD novo:"
echo "  1. Copie o ZIP para o HD novo"
echo "  2. Extraia a pasta"
echo "  3. Abra o terminal dentro da pasta e rode:"
echo "     npm install"
echo "     npm run dev"
echo ""

# Abre a pasta do Desktop para o user ver o arquivo
open "$DESKTOP"

read -p "Pressione Enter para fechar..."
