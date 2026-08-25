"""Génère les ressources Android à partir du glyphe Material Icons utilisé par BrandMark.

Le script ne redessine pas la marque : il réutilise le même glyphe `menu-book`
et les couleurs exactes du composant BrandMark.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "images"
FONT = ROOT / "node_modules" / "@expo" / "vector-icons" / "build" / "vendor" / "react-native-vector-icons" / "Fonts" / "MaterialIcons.ttf"
SIZE = 1024
PRIMARY = "#155EEF"
SURFACE = "#FFFFFF"
MENU_BOOK = chr(59929)


def draw_mark(image: Image.Image, size: int) -> None:
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(str(FONT), size=size)
    bbox = draw.textbbox((0, 0), MENU_BOOK, font=font)
    width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (SIZE - width) / 2 - bbox[0]
    y = (SIZE - height) / 2 - bbox[1]
    draw.text((x, y), MENU_BOOK, font=font, fill=SURFACE)


def main() -> None:
    if not FONT.exists():
        raise FileNotFoundError(f"Police Material Icons introuvable : {FONT}")

    # Icône Expo principale : fond bleu plein, livre blanc du BrandMark exact.
    icon = Image.new("RGB", (SIZE, SIZE), PRIMARY)
    draw_mark(icon, 520)
    icon.save(ASSETS / "icon.png", optimize=True)

    # Premier plan adaptatif : transparence complète hors du livre, placé dans la zone sûre centrale.
    foreground = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_mark(foreground, 420)
    foreground.save(ASSETS / "android-icon-foreground.png", optimize=True)

    # Arrière-plan adaptatif : bleu de la marque, séparé du symbole.
    background = Image.new("RGB", (SIZE, SIZE), PRIMARY)
    background.save(ASSETS / "android-icon-background.png", optimize=True)

    # Calque monochrome Android : même symbole, alpha transparente hors du glyphe.
    monochrome = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_mark(monochrome, 420)
    monochrome.save(ASSETS / "android-icon-monochrome.png", optimize=True)


if __name__ == "__main__":
    main()
