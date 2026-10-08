# -*- coding: utf-8 -*-
"""Collecte de Prix — Herbier du Diois (boutique e-commerce PrestaShop publique).

Sortie : prix-herbier-du-diois.csv (terme;cate;titre;url;prix_eur_ht_kg;stock_kg;origine_fr)
Usage   : python recolte-prix-fournisseurs.py
"""
import csv
import re
import ssl
import time
import urllib.request

BASE = "https://boutique.herbier-du-diois.com/recherche?controller=search&s={term}&resultsPerPage=24"
HEADERS = {"User-Agent": "Mozilla/5.0 (comparatif-recolte-prix/1.0)"}
# Le certificat TLS du site est expiré (constaté le 08/10/2026) : lecture
# publique sans secret, on désactive la vérification en le signalant.
CTX = ssl._create_unverified_context()

# 20 références cœur de gamme (dérivées du BP §2-3 et de GAMME-TISANES-LANCEMENT)
TERMES = [
    "tilleul", "verveine", "camomille", "menthe", "melisse", "cynorrhodon",
    "hibiscus", "fenouil", "anis", "mauve", "coquelicot", "reine-des-pres",
    "reine des pres", "lavande", "thym", "romarin", "sauge", "sarriette",
    "oranger", "bigarade",
]

BLOCK = re.compile(
    r'<div class="js-product-miniature-wrapper.*?</article>\s*</div>', re.S)
CATE = re.compile(r'product-category-name text-muted">([^<]*)')
TITRE = re.compile(r'container_title.*?product-title \">\s*<a href="([^"]+)">\s*([^<]+)', re.S)
PRIX = re.compile(r'product-price" content="([0-9.]+)"')
STOCK = re.compile(r'jauge \w+[^<]*<i[^>]*>[^<]*</i>(?:\s|</?i>|\s)*([0-9]+) ?kg')
ORIGINE = re.compile(r'ico-originefr')


def fetch(term: str) -> str:
    url = BASE.format(term=urllib.parse.quote(term))
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30, context=CTX) as resp:
        return resp.read().decode("utf-8", "replace")


def main() -> None:
    rows = []
    n_err = 0
    for term in TERMES:
        try:
            html = fetch(term)
        except Exception as exc:  # réseau/timeout : on note et on continue
            n_err += 1
            print(f"ERREUR {term!r}: {exc}", flush=True)
            time.sleep(1)
            continue
        blocks = BLOCK.findall(html)
        tt = " ".join(html.split())
        if not blocks:  # fallback : découpage grossier sur article
            blocks = re.findall(r"<article.*?</article>", tt, re.S)
        for b in "\n".join(blocks).split("\n\n") if False else blocks:
            b2 = " ".join(b.split())
            m_t = TITRE.search(b2)
            m_p = PRIX.search(b2)
            if not (m_t and m_p):
                continue
            cate = (CATE.search(b2) or [None, ""])[1].strip()
            stock = (STOCK.search(b2) or [None, ""])[1].strip()
            origine = "FR" if ORIGINE.search(b2) else ""
            rows.append({
                "terme": term,
                "cate": cate,
                "titre": m_t.group(2).strip(),
                "url": m_t.group(1).strip(),
                "prix_eur_ht_kg": m_p.group(1),
                "stock_kg": stock,
                "origine_fr": origine,
            })
        time.sleep(1.2)

    with open("prix-herbier-du-diois.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["terme", "cate", "titre", "url",
                                          "prix_eur_ht_kg", "stock_kg",
                                          "origine_fr"])
        w.writeheader()
        w.writerows(rows)
    print(f"LIGNES={len(rows)} ERREURS={n_err}")


if __name__ == "__main__":
    import urllib.parse
    main()
