import { Controller } from "@hotwired/stimulus"
import { marked } from "marked"

export default class extends Controller {
  static targets = [
    "editor", "previewContent",
    "editorPane", "previewPane",
    "editTab", "previewTab", "splitTab"
  ]

  connect() {
    this.mode = "split"
    this.updateLayout()
    this.updatePreview()
  }

  // View mode switching
  switchToEdit() {
    this.mode = "edit"
    this.updateLayout()
  }

  switchToPreview() {
    this.mode = "preview"
    this.updateLayout()
    this.updatePreview()
  }

  switchToSplit() {
    this.mode = "split"
    this.updateLayout()
    this.updatePreview()
  }

  updateLayout() {
    const editor = this.editorPaneTarget
    const preview = this.previewPaneTarget
    const tabs = [this.editTabTarget, this.previewTabTarget, this.splitTabTarget]

    tabs.forEach(tab => {
      tab.classList.remove("bg-gray-200", "text-gray-800", "font-medium")
      tab.classList.add("text-gray-500")
    })

    const activeTab = { edit: this.editTabTarget, preview: this.previewTabTarget, split: this.splitTabTarget }[this.mode]
    activeTab.classList.add("bg-gray-200", "text-gray-800", "font-medium")
    activeTab.classList.remove("text-gray-500")

    switch (this.mode) {
      case "edit":
        editor.classList.remove("hidden", "w-1/2")
        editor.classList.add("w-full")
        preview.classList.add("hidden")
        preview.classList.remove("w-full", "w-1/2")
        break
      case "preview":
        editor.classList.add("hidden")
        editor.classList.remove("w-full", "w-1/2")
        preview.classList.remove("hidden", "w-1/2")
        preview.classList.add("w-full")
        break
      case "split":
        editor.classList.remove("hidden", "w-full")
        editor.classList.add("w-1/2")
        preview.classList.remove("hidden", "w-full")
        preview.classList.add("w-1/2")
        break
    }
  }

  updatePreview() {
    if (this.hasPreviewContentTarget && this.hasEditorTarget) {
      this.previewContentTarget.innerHTML = marked.parse(this.editorTarget.value || "")
    }
  }

  onInput() {
    this.updatePreview()
  }

  // Toolbar actions
  bold() { this.wrapSelection("**", "**", "太字テキスト") }
  italic() { this.wrapSelection("*", "*", "斜体テキスト") }
  strikethrough() { this.wrapSelection("~~", "~~", "取り消し線") }

  heading() {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    const value = textarea.value
    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    const lineEnd = value.indexOf("\n", start)
    const end = lineEnd === -1 ? value.length : lineEnd
    const line = value.substring(lineStart, end)

    const match = line.match(/^(#{1,6})\s/)
    let newLine
    if (match) {
      if (match[1].length >= 6) {
        newLine = line.replace(/^#{1,6}\s/, "")
      } else {
        newLine = "#" + line
      }
    } else {
      newLine = "## " + line
    }

    textarea.setRangeText(newLine, lineStart, end, "end")
    textarea.focus()
    this.onInput()
  }

  link() {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end)

    if (selected) {
      textarea.setRangeText(`[${selected}](url)`, start, end, "end")
    } else {
      textarea.setRangeText("[リンクテキスト](url)", start, end, "end")
    }
    textarea.focus()
    this.onInput()
  }

  image() { this.insertText("\n![代替テキスト](画像URL)\n") }
  code() { this.wrapSelection("`", "`", "コード") }

  codeBlock() {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end)
    const code = selected || "コード"
    textarea.setRangeText(`\n\`\`\`\n${code}\n\`\`\`\n`, start, end, "end")
    textarea.focus()
    this.onInput()
  }

  quote() { this.prefixLines("> ") }
  bulletList() { this.prefixLines("- ") }
  orderedList() { this.prefixLines("1. ") }

  table() {
    this.insertText("\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n|  |  |  |\n")
  }

  horizontalRule() { this.insertText("\n---\n") }

  // Helpers
  wrapSelection(before, after, placeholder) {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end) || placeholder

    textarea.setRangeText(`${before}${selected}${after}`, start, end, "select")
    textarea.focus()

    if (start === end) {
      textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length)
    }
    this.onInput()
  }

  insertText(text) {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    textarea.setRangeText(text, start, textarea.selectionEnd, "end")
    textarea.focus()
    this.onInput()
  }

  prefixLines(prefix) {
    const textarea = this.editorTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value

    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    const lineEnd = value.indexOf("\n", end)
    const actualEnd = lineEnd === -1 ? value.length : lineEnd

    const lines = value.substring(lineStart, actualEnd)
    const prefixed = lines.split("\n").map(line => prefix + line).join("\n")

    textarea.setRangeText(prefixed, lineStart, actualEnd, "end")
    textarea.focus()
    this.onInput()
  }
}
