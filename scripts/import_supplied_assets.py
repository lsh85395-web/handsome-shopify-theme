"""Import the owner-supplied Lumasela concept artwork into theme assets.

The source ZIPs remain untouched. Images are converted to WebP for storefront use;
the inventory records the original entry and its SHA-256 for review and rollback.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path.home() / "Downloads"
ASSETS = ROOT / "assets"
INVENTORY = ROOT / "docs" / "supplied-asset-inventory.json"

PACKAGES = {
    "Lumasela_Homepage_Part1_H01-H06.zip": "home",
    "Lumasela_Homepage_Part2_H07-H12.zip": "home",
    "Lumasela_详情图库_P01-P06.zip": "product-gallery",
    "Lumasela_详情模块_P07-P15.zip": "product-section",
    "Lumasela_Navigation_Asset.zip": "navigation",
    "Lumasela_Support_Pages_Icons.zip": "support",
}


def asset_name(entry: str, group: str) -> str | None:
    base = Path(entry).name
    if group == "home" and re.fullmatch(r"H\d\d-.+\.png", base):
        return "lumasela-" + base.lower().replace(".png", ".webp")
    if group.startswith("product") and re.fullmatch(r"P\d\d-.+\.png", base):
        return "lumasela-" + base.lower().replace(".png", ".webp")
    if group == "navigation" and base == "N01-navigation-panel.png":
        return "lumasela-n01-navigation-panel.webp"
    if group == "support" and entry.startswith("support-assets/images/") and base.endswith(".png"):
        return "lumasela-" + base.replace(".png", ".webp")
    if group == "support" and entry.startswith("support-assets/images/") and base.endswith(".svg"):
        return "lumasela-" + base
    if group == "support" and entry.startswith("support-assets/icons/") and base.endswith(".svg"):
        return "lumasela-icon-" + base
    return None


def main() -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is needed to create optimized storefront images")
    ASSETS.mkdir(exist_ok=True)
    INVENTORY.parent.mkdir(exist_ok=True)
    entries = []
    with tempfile.TemporaryDirectory(dir=ROOT) as temp:
        for package, group in PACKAGES.items():
            source = SOURCE / package
            if not source.is_file():
                raise FileNotFoundError(source)
            with zipfile.ZipFile(source) as archive:
                for item in archive.infolist():
                    name = asset_name(item.filename, group)
                    if name is None:
                        continue
                    data = archive.read(item)
                    target = ASSETS / name
                    if name.endswith(".webp"):
                        original = Path(temp) / Path(item.filename).name
                        original.write_bytes(data)
                        subprocess.run(
                            [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(original),
                             "-frames:v", "1", "-quality", "82", str(target)],
                            check=True,
                        )
                    else:
                        target.write_bytes(data)
                    entries.append(
                        {
                            "package": package,
                            "source_entry": item.filename,
                            "source_sha256": hashlib.sha256(data).hexdigest(),
                            "theme_asset": name,
                            "theme_bytes": target.stat().st_size,
                            "status": "owner-supplied concept; product and claim accuracy pending review",
                        }
                    )
    INVENTORY.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(entries)} assets; inventory: {INVENTORY}")


if __name__ == "__main__":
    main()
