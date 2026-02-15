// Markdown のコードブロックに
// - ファイル名表示（```ruby:foo.rb）
// - Copy ボタン
// を付与するクライアントサイドスクリプト

function getFilename(codeEl: Element): string {
	const infoClass = Array.from(codeEl.classList).find((cls) => cls.startsWith("language-"));
	if (!infoClass) return "";

	const [, name] = infoClass.replace("language-", "").split(":");
	return name || "";
}

function wrapCodeBlock(codeEl: HTMLElement) {
	const preEl = codeEl.parentElement as HTMLElement | null;
	const parent = preEl?.parentElement as HTMLElement | null;
	if (!preEl || !parent || parent.classList.contains("code-block")) return;

	const wrapper = document.createElement("div");
	wrapper.className = "code-block";

	const header = document.createElement("div");
	header.className = "code-block-header";

	const filename = getFilename(codeEl);
	if (filename) {
		const filenameEl = document.createElement("span");
		filenameEl.className = "code-block-filename";
		filenameEl.textContent = filename;
		header.appendChild(filenameEl);
	}

	const copyButton = document.createElement("button");
	copyButton.type = "button";
	copyButton.className = "code-block-copy";
	copyButton.textContent = "Copy";
	copyButton.addEventListener("click", async () => {
		const original = copyButton.textContent;
		try {
			await navigator.clipboard.writeText(codeEl.textContent || "");
			copyButton.textContent = "Copied";
		} catch {
			copyButton.textContent = "Copy failed";
		} finally {
			setTimeout(() => {
				copyButton.textContent = original;
			}, 1500);
		}
	});

	header.appendChild(copyButton);

	const inner = document.createElement("div");
	inner.className = "code-block-inner";

	parent.replaceChild(wrapper, preEl);
	wrapper.appendChild(header);
	wrapper.appendChild(inner);
	inner.appendChild(preEl);
}

function enhance() {
	const selector = ".markdown-body pre > code.hljs";
	document.querySelectorAll<HTMLElement>(selector).forEach((codeEl) => {
		if (codeEl.classList.contains("language-math")) return;
		wrapCodeBlock(codeEl);
	});
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", enhance);
	} else {
		enhance();
	}
}

export {};
