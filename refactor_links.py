import os
import glob

print("Starting file organization...")
d = r"c:\Users\mauri\OneDrive\Rpg e Livro\RPG SOFTWARE"
os.chdir(d)

dels = [
    "Criador de personagem-DESKTOP-E54ASE3.html",
    "Menu-DESKTOP-E54ASE3.html",
    "tradutor Anão - Copia.html",
    "tradutor eladre-DESKTOP-E54ASE3.html",
    "tradutor eladre.html",
    "tradutor elfico-DESKTOP-E54ASE3.html"
]

for f in dels:
    if os.path.exists(f):
        os.remove(f)
        print("Deleted:", f)

rens = {
    "Calculadora rpg.html": "calculadora_rpg.html",
    "Criador de personagem.html": "criador_personagem.html",
    "criador pessoal.html": "criador_pessoal.html",
    "Menu.html": "menu.html",
    "Tradutores.html": "tradutores.html",
    "tradutor Alto Humano.html": "tradutor_alto_humano.html",
    "tradutor Anão.html": "tradutor_anao.html",
    "tradutor Desereth.html": "tradutor_desereth.html",
    "tradutor Draconico antigo.html": "tradutor_draconico_antigo.html",
    "tradutor Edelin.html": "tradutor_edelin.html",
    "tradutor Hespélrinë.html": "tradutor_hespelerine.html",
    "tradutor Snarilil.html": "tradutor_snarilil.html",
    "tradutor draconico.html": "tradutor_draconico.html",
    "tradutor eladre rework.html": "tradutor_eladre.html",
    "tradutor elfico.html": "tradutor_elfico.html",
    "tradutor elfico Florialis.html": "tradutor_elfico_florialis.html",
    "tradutor elfico antigo.html": "tradutor_elfico_antigo.html"
}

for old, new in rens.items():
    if os.path.exists(old) and old != new:
        os.rename(old, new)
        print("Renamed:", old, "->", new)

html_files = glob.glob("*.html")
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    for old, new in rens.items():
        content = content.replace(f'"{old}"', f'"{new}"')
        content = content.replace(f"'{old}'", f"'{new}'")
        
        # also handle URL encoded spaces
        old_encoded = old.replace(' ', '%20')
        if old_encoded != old:
            content = content.replace(f'"{old_encoded}"', f'"{new}"')
            content = content.replace(f"'{old_encoded}'", f"'{new}'")

    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print("Updated links in:", f)
