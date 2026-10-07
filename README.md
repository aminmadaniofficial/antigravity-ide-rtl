<div align="center">

# ✨ Antigravity IDE RTL & Vazirmatn

**Native Right-to-Left (RTL) alignment and elegant Persian/Arabic Vazirmatn typography for Google Antigravity IDE.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Arch%20%7C%20Ubuntu%20%7C%20Fedora%20%7C%20Linux%20%7C%20macOS-blueviolet.svg)](#supported-operating-systems)
[![GitHub Stars](https://img.shields.io/github/stars/aminmadaniofficial/antigravity-ide-rtl?style=social)](https://github.com/aminmadaniofficial/antigravity-ide-rtl)

<p align="center">
  <a href="#english">English</a> •
  <a href="#فارسی-persian">فارسی (Persian)</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#uninstall--restore">Uninstall</a>
</p>

---

</div>

<a name="english"></a>
## 🚀 Overview

Google **Antigravity IDE** is built on the VS Code engine. Out of the box, the built-in AI chat panel and agent sidebars lack proper support for Right-to-Left (RTL) scripts such as Persian, Arabic, and Hebrew. Text often appears misaligned, punctuation jumps to the wrong ends, list markers collide with Persian text, and default fonts fail to render Persian characters gracefully.

`antigravity-ide-rtl` is a universal, non-destructive CLI utility that patches your Antigravity IDE with:
- **Auto Bi-directional Detection**: Automatically aligns Persian/Arabic paragraphs to the right while keeping English text left-aligned.
- **Official Vazirmatn Variable Font**: Injects the renowned [Vazirmatn](https://github.com/rastikerdar/vazirmatn) variable font scoped strictly to Persian/Arabic Unicode ranges.
- **Strict LTR Protection**: Preserves Left-to-Right orientation for code blocks, Monaco editors, diff viewers, and terminal panes.
- **Chat Header Toggle Button**: Adds a native `⇄ RTL` button in the chat panel header for instant toggling.
- **Dynamic Input Switcher**: Automatically switches the input box direction based on the language you are currently typing.

---

## 💻 Installation & Usage

You do **not** need to clone the repository to use it. Simply run:

### Option 1: Via NPX (Recommended)

```bash
npx antigravity-ide-rtl
```

> **Note:** If your Antigravity IDE is installed in a system directory (e.g. `/opt/antigravity-ide` owned by `root`), prefix the command with `sudo`:
> ```bash
> sudo npx antigravity-ide-rtl
> ```

### Option 2: Global Install

```bash
npm install -g antigravity-ide-rtl
antigravity-ide-rtl
```

### Option 3: Standalone Shell Script (No Node.js required)

```bash
curl -fsSL https://raw.githubusercontent.com/aminmadaniofficial/antigravity-ide-rtl/main/install.sh | bash
```

---

## ⚡ CLI Options

```bash
npx antigravity-ide-rtl [options]

Options:
  -p, --path <path>    Specify a custom path to Antigravity IDE resources/app directory
  -r, --restore        Restore original files and uninstall the RTL patch
  -s, --status         Check whether Antigravity IDE is currently patched
  -h, --help           Show CLI help
  -v, --version        Show version number
```

### Checking Status
```bash
npx antigravity-ide-rtl --status
```

### Uninstalling / Restoring Original State
```bash
npx antigravity-ide-rtl --restore
```

---

## 🐧 Supported Operating Systems & Environments

| Distro / OS | Default Discovery Path | Tested & Supported |
| :--- | :--- | :---: |
| **Arch Linux / Omarchy / Manjaro** | `/opt/antigravity-ide/resources/app` | ✅ |
| **Ubuntu / Debian / Linux Mint** | `/opt/antigravity-ide/resources/app` or `/usr/lib/antigravity-ide` | ✅ |
| **Fedora / RHEL** | `/opt/antigravity-ide/resources/app` | ✅ |
| **Custom / Flatpak** | `~/.local/share/antigravity-ide` or specify `--path` | ✅ |
| **macOS** | `/Applications/Antigravity IDE.app/Contents/Resources/app` | ✅ |
| **Windows** | `%LOCALAPPDATA%\Programs\Antigravity IDE\resources\app` | ✅ |

---

<a name="فارسی-persian"></a>
## 🇮🇷 راهنمای فارسی (Persian Guide)

پچ هوشمند جهت فعال‌سازی کامل **راست‌چین (RTL)** و قلم استاندارد **وزیرمتن (Vazirmatn)** در پنل چت و دستیار هوش مصنوعی محیط توسعه **Antigravity IDE**.

### امکانات:
1. **راست‌چین خودکار و هوشمند:** متن‌های فارسی به صورت خودکار راست‌چین شده و متن‌های انگلیسی چپ‌چین باقی می‌مانند.
2. **فونت متغیر وزیرمتن:** استفاده از فونت استاندارد Vazirmatn Variable برای حروف فارسی و حفظ فونت اصلی سیستم برای حروف انگلیسی.
3. **عدم تداخل با کدها:** کلیه بلاک‌های کد، ادیتور Monaco، دیف‌ها و ترمینال کاملاً چپ‌چین (`LTR`) باقی می‌مانند.
4. **دکمه سوییچ `⇄ RTL`:** دکمه‌ی تغییر وضعیت راست‌چین در بالای پنل چت اضافه می‌شود تا هر زمان مایل بودید آن را غیرفعال یا فعال کنید.
5. **تغییر جهت هوشمند اینپوت:** هنگام تایپ پیام، اگر متن فارسی بنویسید اینپوت فوراً راست‌چین و اگر انگلیسی بنویسید چپ‌چین می‌شود.

### نحوه اجرا:
کافیست دستور زیر را در ترمینال خود اجرا کنید:

```bash
npx antigravity-ide-rtl
```

> **نکته:** در صورتی که فایل‌های Antigravity IDE شما در مسیر سیستمی قرار دارد و نیاز به دسترسی ادمین دارد:
> ```bash
> sudo npx antigravity-ide-rtl
> ```

پس از اتمام، در Antigravity IDE کلیدهای `Ctrl + Shift + P` را زده و گزینه‌ی **`Developer: Reload Window`** را انتخاب کنید (یا یک بار برنامه را ببندید و باز کنید).

### بازگردانی به حالت اولیه (حذف پچ):
```bash
npx antigravity-ide-rtl --restore
```

---

## 🛠 How It Works

1. Automatically searches standard installation directories to locate Antigravity IDE.
2. Safely backs up `workbench.html` and `workbench.desktop.main.css` to `.bak` files.
3. Injects `Vazirmatn-Variable.woff2`, `antigravity-chat-rtl.css`, and `antigravity-chat-rtl.js` into the IDE's core workbench.
4. Leverages modern standard CSS `unicode-bidi: plaintext` and a lightweight DOM observer to handle live chat streams without performance drops.

---

## 📄 License

Distributed under the [MIT License](LICENSE).  
Created with ❤️ by **[Amin Madani](https://aminmadani.xyz)**.


<!-- Security scan triggered at 2026-10-07 11:40:32 -->