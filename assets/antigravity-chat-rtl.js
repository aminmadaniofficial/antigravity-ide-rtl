/* === ANTIGRAVITY-IDE CHAT RTL ENGINE === */
(function() {
    const BTN_ID = 'antigravity-rtl-toggle-btn';
    const BODY_CLASS = 'antigravity-chat-rtl';
    const STORAGE_KEY = 'antigravity-chat-rtl-active';
    const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // Default to true (RTL enabled by default for Iranian/Farsi users)
    let isRtlActive = localStorage.getItem(STORAGE_KEY) !== 'false';

    if (isRtlActive) {
        document.body.classList.add(BODY_CLASS);
    }

    function processElement(el) {
        if (!el || el.nodeType !== 1) return;
        // Skip code blocks, editors, and tables
        if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.closest('pre') || el.closest('.interactive-result-code-block') || el.closest('.monaco-editor') || el.closest('table')) {
            return;
        }

        const text = el.textContent || '';
        if (isRtlActive && RTL_REGEX.test(text)) {
            el.classList.add('antigravity-is-rtl');
            el.setAttribute('dir', 'rtl');
        } else if (!isRtlActive) {
            el.classList.remove('antigravity-is-rtl');
            if (el.getAttribute('dir') === 'rtl') {
                el.removeAttribute('dir');
            }
        }
    }

    function updateRtlElements() {
        const selectors = [
            '.antigravity-agent-side-panel p',
            '.antigravity-agent-side-panel li',
            '.antigravity-agent-side-panel blockquote',
            '.antigravity-agent-side-panel h1',
            '.antigravity-agent-side-panel h2',
            '.antigravity-agent-side-panel h3',
            '.antigravity-agent-side-panel h4',
            '.antigravity-agent-side-panel .whitespace-pre-wrap',
            '.antigravity-agent-side-panel .leading-relaxed'
        ].join(', ');

        const elements = document.querySelectorAll(selectors);
        elements.forEach(processElement);

        // Process chat input areas dynamically
        const inputs = document.querySelectorAll('.antigravity-agent-side-panel textarea, .antigravity-agent-side-panel [contenteditable="true"]');
        inputs.forEach(input => {
            if (!input._rtlListenerAttached) {
                input._rtlListenerAttached = true;
                input.addEventListener('input', function() {
                    const val = this.value || this.textContent || '';
                    if (RTL_REGEX.test(val)) {
                        this.setAttribute('dir', 'rtl');
                    } else {
                        this.setAttribute('dir', 'ltr');
                    }
                });
            }
        });
    }

    let updateTimeout;
    function scheduleUpdate() {
        if (updateTimeout) return;
        updateTimeout = setTimeout(function() {
            updateTimeout = null;
            updateRtlElements();
        }, 120);
    }

    function tryInsertButton() {
        if (document.getElementById(BTN_ID)) return;

        // Try locating chat action header or new conversation button
        const newChatBtn = document.querySelector('a[data-tooltip-id="new-conversation-tooltip"]') || 
                           document.querySelector('.antigravity-agent-side-panel .actions-container');
        
        if (!newChatBtn) return;

        const btn = document.createElement('a');
        btn.id = BTN_ID;
        btn.href = '#';
        btn.innerHTML = '⇄ RTL';
        btn.title = 'Toggle Persian/Arabic RTL mode for Antigravity Chat';
        
        if (isRtlActive) {
            btn.classList.add('antigravity-rtl-active');
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            isRtlActive = !isRtlActive;
            localStorage.setItem(STORAGE_KEY, isRtlActive ? 'true' : 'false');
            document.body.classList.toggle(BODY_CLASS, isRtlActive);
            btn.classList.toggle('antigravity-rtl-active', isRtlActive);
            scheduleUpdate();
        });

        if (newChatBtn.parentElement) {
            newChatBtn.parentElement.insertBefore(btn, newChatBtn);
        }
    }

    // Observe DOM mutations
    const observer = new MutationObserver(function() {
        tryInsertButton();
        scheduleUpdate();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState !== 'loading') {
        tryInsertButton();
        scheduleUpdate();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            tryInsertButton();
            scheduleUpdate();
        });
    }
})();
