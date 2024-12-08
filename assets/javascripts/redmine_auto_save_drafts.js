document.addEventListener('DOMContentLoaded', function () {
    const storageKeyPrefix = 'redmine-auto-save-drafts';
    const pageKey = location.pathname; // 現在のURLパスをキーに追加
    let lastSavedTime = null; // 最後に保存した時間を記録

    function initialize() {
        const context = detectContext();
        if (context && !context.textareas.some((textarea) => textarea.dataset.autoDraftHandled)) {
            setupAutoSaveDrafts (context.textareas, context.storageKey, context.messageTarget);
            context.textareas.forEach((textarea) => (textarea.dataset.autoDraftHandled = true));
        }
    }

    // ページのコンテキストを判定
    function detectContext() {
        const textareas = [];
        let storageKey = null;
        let messageTarget = null;

        if (document.querySelector('#issue_notes')) {
            // コメント編集ページ
            textareas.push(document.querySelector('#issue_notes'));
            storageKey = `${storageKeyPrefix}-notes-${pageKey}`;
            messageTarget = document.querySelector('#add_notes > legend'); // コメント用メッセージ表示位置
        } else if (document.querySelector('.box.tabular.filedroplistner')) {
            // 新規チケット作成ページ
            const description = document.querySelector('#issue_description');
            const subject = document.querySelector('#issue_subject');
            if (description) textareas.push(description);
            if (subject) textareas.push(subject);
            storageKey = `${storageKeyPrefix}-description-and-subject-${pageKey}`;

            // "連続作成"ボタンの直後にメッセージを挿入
            const continueButton = document.querySelector(
                '#issue-form > input[type="submit"][name="continue"]'
            );
            if (continueButton) {
                messageTarget = continueButton;
            }
        }

        return textareas.length > 0 ? { textareas, storageKey, messageTarget } : null;
    }

    // AutoSaveDrafts のセットアップ
    function setupAutoSaveDrafts(textareas, storageKey, messageTarget) {
        const parent = textareas[0].closest('form');

        // 保存された内容を自動復元
        const savedContent = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (savedContent && Object.values(savedContent).some((content) => content.trim() !== '')) {
            textareas.forEach((textarea) => {
                const fieldName = textarea.id.replace('issue_', '');
                textarea.value = savedContent[fieldName] || '';
            });
        }

        // 入力内容を即時保存
        textareas.forEach((textarea) => {
            textarea.addEventListener('input', () => {
                const draft = {};
                textareas.forEach((textarea) => {
                    const fieldName = textarea.id.replace('issue_', '');
                    draft[fieldName] = textarea.value;
                });
                localStorage.setItem(storageKey, JSON.stringify(draft));
                lastSavedTime = Date.now();
                updateSaveMessage(messageTarget);
            });
        });

        // チケット作成時に保存内容を削除
        parent.addEventListener('submit', () => {
            localStorage.removeItem(storageKey);
        });

        // 保存時間のカウント更新
        setInterval(() => {
            if (lastSavedTime) {
                updateSaveMessage(messageTarget);
            }
        }, 1000);
    }

    // 保存メッセージの更新
    function updateSaveMessage(messageTarget) {
        if (!messageTarget) return;

        const secondsAgo = Math.floor((Date.now() - lastSavedTime) / 1000);
        const saveMessage = `保存済み (${secondsAgo}秒前)`;

        if (messageTarget.tagName === 'LEGEND') {
            // コメント編集の場合
            messageTarget.innerHTML = `コメント ${saveMessage}`;
        } else {
            // 新規チケットの場合
            const sibling = messageTarget.nextSibling;
            if (sibling && sibling.id === 'save-message') {
                sibling.textContent = saveMessage;
            } else {
                const saveMessageElement = document.createElement('span');
                saveMessageElement.id = 'save-message';
                saveMessageElement.style.marginLeft = '10px';
                saveMessageElement.textContent = saveMessage;
                messageTarget.parentNode.insertBefore(saveMessageElement, messageTarget.nextSibling);
            }
        }
    }

    // DOMが完全にロードされた後に確認
    initialize();

    // テキストエリアが動的に生成される場合に対応
    const observer = new MutationObserver(() => initialize());
    observer.observe(document.body, { childList: true, subtree: true });
});
