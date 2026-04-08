from __future__ import annotations

import os
import socket
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import webview


APP_TITLE = "Indomitus RPG Software"
WINDOW_WIDTH = 1500
WINDOW_HEIGHT = 960
WINDOW_MIN_SIZE = (1024, 700)
SPLASH_DURATION_MS = 1400


def get_bundle_root() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


def get_storage_path() -> Path:
    local_app_data = Path(os.getenv("LOCALAPPDATA") or (Path.home() / "AppData" / "Local"))
    storage_dir = local_app_data / "IndomitusRPGSoftware" / "webview_storage"
    storage_dir.mkdir(parents=True, exist_ok=True)
    return storage_dir


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


class QuietFileHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def start_local_server(root_dir: Path) -> tuple[ThreadingHTTPServer, int]:
    port = find_free_port()
    handler = partial(QuietFileHandler, directory=str(root_dir))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, port


def stop_server(server: ThreadingHTTPServer) -> None:
    server.shutdown()
    server.server_close()


def show_splash(root_dir: Path) -> None:
    try:
        import tkinter as tk
        from PIL import Image, ImageTk
    except Exception:
        return

    splash_path = root_dir / "assets" / "app_launcher" / "app_photo.jpg"
    if not splash_path.exists():
        return

    window = tk.Tk()
    window.overrideredirect(True)
    window.configure(bg="#0f172a")

    image = Image.open(splash_path).convert("RGB")
    image.thumbnail((380, 380))
    tk_image = ImageTk.PhotoImage(image)

    container = tk.Frame(window, bg="#0f172a", bd=0, highlightthickness=0)
    container.pack(padx=18, pady=18)

    image_label = tk.Label(container, image=tk_image, bg="#0f172a", bd=0)
    image_label.image = tk_image
    image_label.pack()

    title_label = tk.Label(
        container,
        text=APP_TITLE,
        bg="#0f172a",
        fg="#f8fafc",
        font=("Segoe UI", 16, "bold"),
        pady=8,
    )
    title_label.pack()

    subtitle_label = tk.Label(
        container,
        text="Carregando o menu principal...",
        bg="#0f172a",
        fg="#cbd5e1",
        font=("Segoe UI", 10),
    )
    subtitle_label.pack()

    window.update_idletasks()
    width = window.winfo_width()
    height = window.winfo_height()
    screen_w = window.winfo_screenwidth()
    screen_h = window.winfo_screenheight()
    pos_x = int((screen_w - width) / 2)
    pos_y = int((screen_h - height) / 2)
    window.geometry(f"{width}x{height}+{pos_x}+{pos_y}")
    window.after(SPLASH_DURATION_MS, window.destroy)
    window.mainloop()


def build_start_url(root_dir: Path, port: int) -> str:
    menu_path = root_dir / "menu.html"
    if not menu_path.exists():
        raise FileNotFoundError(f"Arquivo inicial nao encontrado: {menu_path}")
    return f"http://127.0.0.1:{port}/menu.html"


def run_self_test(root_dir: Path, server: ThreadingHTTPServer, port: int) -> None:
    print(f"bundle_root={root_dir}")
    print(f"storage_path={get_storage_path()}")
    print(f"start_url={build_start_url(root_dir, port)}")
    stop_server(server)


def main() -> None:
    root_dir = get_bundle_root()
    icon_path = root_dir / "assets" / "app_launcher" / "app_icon.ico"
    server, port = start_local_server(root_dir)

    if "--self-test" in sys.argv:
        run_self_test(root_dir, server, port)
        return

    try:
        show_splash(root_dir)
        webview.create_window(
            APP_TITLE,
            build_start_url(root_dir, port),
            width=WINDOW_WIDTH,
            height=WINDOW_HEIGHT,
            min_size=WINDOW_MIN_SIZE,
            resizable=True,
            maximized=False,
            text_select=True,
            background_color="#0f172a",
        )
        webview.start(
            private_mode=False,
            storage_path=str(get_storage_path()),
            icon=str(icon_path) if icon_path.exists() else None,
        )
    finally:
        stop_server(server)


if __name__ == "__main__":
    main()
