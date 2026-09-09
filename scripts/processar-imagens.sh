#!/usr/bin/env bash
# Processa as fotos originais para as versoes usadas no site.
# Gera, para cada foto: WebP + JPEG nas larguras 480 / 960 / 1600.
# Uso: bash processar-imagens.sh
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NOVAS="$RAIZ/img/novas"
ORIG="$RAIZ/img"
SAIDA="$RAIZ/img/site"

mkdir -p "$SAIDA"

# nome-final|arquivo-origem|recorte
# recorte: "capa" = corta para 16:9 ; "retrato" = corta 4:5 ; "livre" = so redimensiona
MAPA=(
  "gaiola-espacosa|$NOVAS/piiko-GfYT6hXBKuE-unsplash.jpg|capa"
  "voo-livre|$NOVAS/ilianna-brett-Frb-B5SYP2M-unsplash.jpg|capa"
  "alimentacao-dupla|$NOVAS/deva-prasanna-0THA4bzhhHw-unsplash.jpg|capa"
  "poleiro-galho|$NOVAS/dilip-poddar-gWfp0S3g4po-unsplash.jpg|capa"
  "brincar-corda|$NOVAS/luan-fonseca-yMXRvYsojUM-unsplash.jpg|retrato"
  "descanso-janela|$NOVAS/nathan-andress-kEpgHxPYHLU-unsplash.jpg|capa"
  "ambiente-amplo|$NOVAS/oleksandr-kuzmin-zthQxyWHb9M-unsplash.jpg|capa"
  "retrato-hero|$NOVAS/bruno-souza-vq4HW3Cy3sM-unsplash.jpg|retrato"
  "trio-cinzas|$NOVAS/david-clode-p_glx683R7w-unsplash.jpg|capa"
  "piano-canto|$NOVAS/david-vilches-8Pmhh0yiHW0-unsplash.jpg|retrato"
  "mutacao-lutino|$NOVAS/atilson-souza-p7WjYnGio8s-unsplash.jpg|capa"
  "sexagem-retrato|$NOVAS/katarzyna-zygnerska-ELdiAy05T7s-unsplash.jpg|retrato"
  "casal-ninho|$NOVAS/ravi-kumar-TmiUk5TB4t0-unsplash.jpg|retrato"
  "convivencia|$NOVAS/veronika-dee-aqYSr0ZiaAg-unsplash.jpg|capa"
  # fotos originais do projeto que tem resolucao suficiente
  "filhote|$ORIG/filhote.jpg|capa"
  "banho-original|$ORIG/calopsita5.jpg|capa"
  "gaiola-limpeza|$ORIG/calopsita6.jpg|capa"
)

recorte_args() {
  case "$1" in
    capa)    echo "16:9" ;;
    retrato) echo "4:5" ;;
    *)       echo "" ;;
  esac
}

total_antes=0
total_depois=0

for entrada in "${MAPA[@]}"; do
  IFS='|' read -r nome origem modo <<< "$entrada"

  if [[ ! -f "$origem" ]]; then
    echo "  ! nao encontrado, pulando: $origem"
    continue
  fi

  bytes_antes=$(stat -c%s "$origem")
  total_antes=$((total_antes + bytes_antes))
  echo "-> $nome"

  proporcao=$(recorte_args "$modo")

  for largura in 480 960 1600; do
    # nao amplia: se o original for menor que o alvo, usa a largura real
    larg_orig=$(identify -format '%w' "$origem")
    alvo=$largura
    if (( larg_orig < largura )); then
      alvo=$larg_orig
    fi

    if [[ -n "$proporcao" ]]; then
      w=${proporcao%%:*}; h=${proporcao##*:}
      altura=$(( alvo * h / w ))
      geom="${alvo}x${altura}^"
      extra=(-gravity center -extent "${alvo}x${altura}")
    else
      geom="${alvo}x"
      extra=()
    fi

    convert "$origem" \
      -auto-orient \
      -resize "$geom" \
      "${extra[@]}" \
      -strip \
      -quality 82 \
      -interlace Plane \
      -sampling-factor 4:2:0 \
      "$SAIDA/${nome}-${largura}.jpg"

    convert "$origem" \
      -auto-orient \
      -resize "$geom" \
      "${extra[@]}" \
      -strip \
      -quality 78 \
      -define webp:method=6 \
      "$SAIDA/${nome}-${largura}.webp"

    for ext in jpg webp; do
      f="$SAIDA/${nome}-${largura}.${ext}"
      [[ -f "$f" ]] && total_depois=$((total_depois + $(stat -c%s "$f")))
    done
  done
done

# Favicon circular, a partir da foto pessoal. O recorte 368x368+0+60 enquadra
# o rosto da ave; o PNG guarda a transparência fora do círculo, que o JPEG
# não suportaria.
FOTO_ICONE="$NOVAS/nick.jpg"
if [[ -f "$FOTO_ICONE" ]]; then
  for tam in 32 180 512; do
    meio=$(( tam / 2 - 1 ))
    convert "$FOTO_ICONE" \
      -auto-orient \
      -crop 368x368+0+60 +repage \
      -resize "${tam}x${tam}" \
      \( -size "${tam}x${tam}" xc:none -fill white \
         -draw "circle $meio,$meio $meio,0" \) \
      -alpha off -compose CopyOpacity -composite \
      -define png:color-type=6 \
      "$SAIDA/favicon-${tam}.png"
    echo "-> favicon-${tam}.png"
  done
fi

echo
printf 'originais : %s\n' "$(numfmt --to=iec $total_antes)"
printf 'gerados   : %s\n' "$(numfmt --to=iec $total_depois)"
echo "arquivos  : $(ls -1 "$SAIDA" | wc -l)"
