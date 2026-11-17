#!/usr/bin/env bash
# rebuild_dashboard.sh
#
# Rebuilds dashboard.html from the trait tables in this repository.
# Run it from anywhere; it works out where it lives.
#
#   bash build/rebuild_dashboard.sh            rebuild only
#   bash build/rebuild_dashboard.sh --open     rebuild, then open a preview
#
# Everything the dashboard needs is here. The one file that comes from the
# zooplankton key project is data/zooplankton_feeding.csv, exported there with
# export_feeding_traits.py and committed here. So a dashboard change touches this
# repository only.

set -euo pipefail

OPEN=0
PORT=8000
for arg in "$@"; do
  case "$arg" in
    --open) OPEN=1 ;;
    --port=*) PORT="${arg#*=}" ;;
    *) echo "Unknown option: $arg  (use --open or --port=8001)"; exit 1 ;;
  esac
done

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PY="$(command -v python3 || command -v python)"

need() {
  if [ ! -f "$HERE/$1" ]; then
    echo "ERROR: missing $1"
    [ -n "${2:-}" ] && echo "   $2"
    exit 1
  fi
}
need "data/zooplankton_feeding.csv" \
     "Export it from the key: python Code/export_feeding_traits.py --workbook data/cfbkey_workbook.xlsx --out $HERE/data/zooplankton_feeding.csv"
need "data/phyto_traits.xlsx" \
     "Build it first: python build/build_phyto_traits.py --rimet ... --phycokey ... --out data/phyto_traits.xlsx"

# These three are optional: the build says so if they are absent.
EXTRA=()
[ -f "$HERE/data/foodweb_rules.csv" ]  && EXTRA+=(--rules   "$HERE/data/foodweb_rules.csv")
[ -f "$HERE/data/phyco_aliases.csv" ]  && EXTRA+=(--aliases "$HERE/data/phyco_aliases.csv")
[ -f "$HERE/data/local_extras.csv" ]   && EXTRA+=(--extras  "$HERE/data/local_extras.csv")

echo "Rebuilding the dashboard..."
"$PY" "$HERE/build/build_dashboard.py" \
  --zooplankton   "$HERE/data/zooplankton_feeding.csv" \
  --phytoplankton "$HERE/data/phyto_traits.xlsx" \
  "${EXTRA[@]}" \
  --out           "$HERE/dashboard.html"

echo
echo "Written to: $HERE/dashboard.html"

if [ "$OPEN" -eq 1 ]; then
  # A local server, not the file itself: the counter hands its count to the dashboard
  # through browser storage, which only works when both pages come from one address.
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo
    echo "Something is already serving port $PORT. Either use it, or run again with"
    echo "   bash build/rebuild_dashboard.sh --open --port=8001"
    exit 1
  fi
  echo
  echo "Serving the site at http://localhost:$PORT"
  echo "Press Control+C when you are finished."
  echo
  ( sleep 1.2
    if command -v open >/dev/null 2>&1; then open "http://localhost:$PORT/"
    elif command -v xdg-open >/dev/null 2>&1; then xdg-open "http://localhost:$PORT/"
    fi ) &
  cd "$HERE"
  exec "$PY" -m http.server "$PORT"
fi

echo
echo "To see it:"
echo "   bash build/rebuild_dashboard.sh --open"
echo
echo "To publish:"
echo "   cd \"$HERE\" && git add -A && git commit -m \"Update the dashboard\" && git push"
