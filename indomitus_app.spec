# -*- mode: python ; coding: utf-8 -*-

from pathlib import Path

from PyInstaller.utils.hooks import collect_data_files, collect_submodules


project_dir = Path.cwd()
icon_path = project_dir / "assets" / "app_launcher" / "app_icon.ico"

datas = []

for pattern in ("*.html", "*.js", "*.css"):
    for path in project_dir.glob(pattern):
        datas.append((str(path), "."))

assets_dir = project_dir / "assets"
if assets_dir.exists():
    for path in assets_dir.rglob("*"):
        if path.is_file():
            target_dir = Path("assets") / path.relative_to(assets_dir).parent
            datas.append((str(path), str(target_dir)))

hiddenimports = []
for package_name in ("webview", "bottle", "pythonnet", "clr_loader"):
    hiddenimports.extend(collect_submodules(package_name))
    datas.extend(collect_data_files(package_name))


a = Analysis(
    [str(project_dir / "indomitus_app.py")],
    pathex=[str(project_dir)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="Indomitus RPG Software",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=str(icon_path) if icon_path.exists() else None,
)
