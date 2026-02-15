import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    items: { type: Array, default: [] },
    selected: { type: Array, default: [] },
    creatable: { type: Boolean, default: false },
    name: { type: String, default: "multi_combobox" },
    loading: { type: Boolean, default: false },
    selectedItemEllipsis: { type: Boolean, default: false }
  }

  static targets = [
    "input", "inputArea", "tags", "dropdown", "list",
    "hiddenInputs", "loader"
  ]

  connect() {
    this._activeIndex = -1
    this._open = false
    this._renderTags()
    this._renderHiddenInputs()
    this._updateLoaderVisibility()

    // Close dropdown on outside click
    this._onDocumentClick = (e) => {
      if (!this.element.contains(e.target)) this._close()
    }
    document.addEventListener("click", this._onDocumentClick)
  }

  disconnect() {
    document.removeEventListener("click", this._onDocumentClick)
  }

  // --- Public actions ---

  onInput() {
    this._filterAndRender(this.inputTarget.value)
    this._openDropdown()
  }

  onKeydown(e) {
    const items = this._visibleItems()

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this._activeIndex = Math.min(this._activeIndex + 1, items.length - 1)
        this._updateActiveDescendant(items)
        this._scrollActiveIntoView()
        break
      case "ArrowUp":
        e.preventDefault()
        this._activeIndex = Math.max(this._activeIndex - 1, 0)
        this._updateActiveDescendant(items)
        this._scrollActiveIntoView()
        break
      case "Enter":
        e.preventDefault()
        if (this._activeIndex >= 0 && items[this._activeIndex]) {
          this._selectItem(items[this._activeIndex])
        } else if (this.creatableValue && this.inputTarget.value.trim()) {
          this._addNewItem(this.inputTarget.value.trim())
        }
        break
      case "Backspace":
        if (!this.inputTarget.value && this.selectedValue.length > 0) {
          this._removeItem(this.selectedValue[this.selectedValue.length - 1])
        }
        break
      case "Escape":
        this._close()
        this.inputTarget.blur()
        break
    }
  }

  onFocus() {
    this._filterAndRender(this.inputTarget.value)
    this._openDropdown()
    this.inputAreaTarget.classList.add("multi-combobox__input-area--focused")
  }

  onBlur() {
    // Delay to allow click events on dropdown items
    setTimeout(() => {
      if (!this.element.contains(document.activeElement)) {
        this._close()
        this.inputAreaTarget.classList.remove("multi-combobox__input-area--focused")
      }
    }, 150)
  }

  selectItem(e) {
    const value = e.currentTarget.dataset.value
    const label = e.currentTarget.dataset.label
    if (value && label) {
      this._selectItem({ label, value })
    }
  }

  removeTag(e) {
    const value = e.currentTarget.dataset.value
    const item = this.selectedValue.find(i => String(i.value) === value)
    if (item) this._removeItem(item)
  }

  // --- Loading value callback ---

  loadingValueChanged() {
    this._updateLoaderVisibility()
  }

  // --- Private methods ---

  _selectItem(item) {
    const normalizedValue = String(item.value) // 値を文字列に正規化
    if (this.selectedValue.some(i => String(i.value) === normalizedValue)) return

    this.selectedValue = [...this.selectedValue, item]
    this.inputTarget.value = ""
    this._activeIndex = -1
    this._renderTags()
    this._renderHiddenInputs()
    this._filterAndRender("")
    this.inputTarget.focus()
  }

  _removeItem(item) {
    const normalizedValue = String(item.value) // 値を文字列に正規化
    this.selectedValue = this.selectedValue.filter(i => String(i.value) !== normalizedValue)
    this._renderTags()
    this._renderHiddenInputs()
    this._filterAndRender(this.inputTarget.value)
  }

  _addNewItem(text) {
    const newItem = { label: text, value: text }
    const normalizedValue = String(newItem.value) // 値を文字列に正規化

    // Add to items list if not already present
    if (!this.itemsValue.some(i => String(i.value) === normalizedValue)) {
      this.itemsValue = [...this.itemsValue, newItem]
    }
    this._selectItem(newItem)
  }

  _renderTags() {
    const container = this.tagsTarget
    container.innerHTML = ""

    this.selectedValue.forEach(item => {
      const tag = document.createElement("span")
      tag.className = "multi-combobox__tag"

      const label = document.createElement("span")
      label.className = "multi-combobox__tag-label"
      if (this.selectedItemEllipsisValue) {
        label.classList.add("multi-combobox__tag-label--ellipsis")
      }
      label.textContent = item.label

      const removeBtn = document.createElement("button")
      removeBtn.type = "button"
      removeBtn.className = "multi-combobox__tag-remove"
      removeBtn.dataset.action = "multi-combobox#removeTag"
      removeBtn.dataset.value = item.value
      removeBtn.setAttribute("aria-label", `${item.label}を削除`)
      removeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`

      tag.appendChild(label)
      tag.appendChild(removeBtn)
      container.appendChild(tag)
    })
  }

  _renderHiddenInputs() {
    const container = this.hiddenInputsTarget
    container.innerHTML = ""

    if (this.selectedValue.length === 0) {
      // Submit empty array
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = `${this.nameValue}[]`
      input.value = ""
      container.appendChild(input)
      return
    }

    this.selectedValue.forEach(item => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = `${this.nameValue}[]`
      input.value = item.value
      container.appendChild(input)
    })
  }

  _filterAndRender(query) {
    const rawQuery = (query || "")
    const q = rawQuery.toLowerCase()
    const selectedValues = new Set(this.selectedValue.map(i => String(i.value)))

    const filtered = this.itemsValue.filter(item =>
      !selectedValues.has(String(item.value)) &&
      item.label.toLowerCase().includes(q)
    )

    // リスト再描画前にアクティブインデックスをリセット
    this._activeIndex = -1
    this._renderList(filtered, rawQuery.trim())
  }

  _renderList(items, query) {
    const list = this.listTarget
    list.innerHTML = ""
    list.setAttribute("role", "listbox")
    list.id = list.id || `${this.nameValue}-listbox`

    this.inputTarget.removeAttribute("aria-activedescendant")

    if (this.loadingValue) {
      const li = document.createElement("li")
      li.className = "multi-combobox__list-message"
      li.setAttribute("role", "option")
      li.setAttribute("aria-disabled", "true")
      li.textContent = "読み込み中..."
      list.appendChild(li)
      return
    }

    items.forEach((item, index) => {
      const li = document.createElement("li")
      li.className = "multi-combobox__list-item"
      li.id = `${this.nameValue}-option-${index}`
      li.setAttribute("role", "option")
      li.setAttribute("aria-selected", "false")
      li.dataset.action = "click->multi-combobox#selectItem"
      li.dataset.value = item.value
      li.dataset.label = item.label
      li.textContent = item.label
      list.appendChild(li)
    })

    if (items.length === 0 && this.creatableValue && query) {
      const li = document.createElement("li")
      li.className = "multi-combobox__list-item multi-combobox__list-item--create"
      li.id = `${this.nameValue}-option-0`
      li.setAttribute("role", "option")
      li.setAttribute("aria-selected", "false")
      li.dataset.action = "click->multi-combobox#selectItem"
      li.dataset.value = query
      li.dataset.label = query
      li.textContent = `「${query}」を追加`
      list.appendChild(li)
    } else if (items.length === 0) {
      const li = document.createElement("li")
      li.className = "multi-combobox__list-message"
      li.setAttribute("role", "option")
      li.setAttribute("aria-disabled", "true")
      li.textContent = "一致する項目がありません"
      list.appendChild(li)
    }
  }

  _visibleItems() {
    return Array.from(this.listTarget.querySelectorAll(
      ".multi-combobox__list-item:not(.multi-combobox__list-message)"
    ))
  }

  _updateActiveDescendant(items) {
    // Clear all active states
    items.forEach(el => {
      el.classList.remove("multi-combobox__list-item--active")
      el.setAttribute("aria-selected", "false")
    })

    if (this._activeIndex >= 0 && items[this._activeIndex]) {
      const active = items[this._activeIndex]
      active.classList.add("multi-combobox__list-item--active")
      active.setAttribute("aria-selected", "true")

      // Set aria-activedescendant on the input
      this.inputTarget.setAttribute("aria-activedescendant", active.id)
    } else {
      this.inputTarget.removeAttribute("aria-activedescendant")
    }
  }

  _scrollActiveIntoView() {
    const items = this._visibleItems()
    if (this._activeIndex >= 0 && items[this._activeIndex]) {
      items[this._activeIndex].scrollIntoView({ block: "nearest" })
    }
  }

  _openDropdown() {
    if (this._open) return
    this._open = true
    this.dropdownTarget.classList.add("multi-combobox__dropdown--open")
    this.inputTarget.setAttribute("aria-expanded", "true")
  }

  _close() {
    this._open = false
    this._activeIndex = -1
    this.dropdownTarget.classList.remove("multi-combobox__dropdown--open")
    this.inputTarget.setAttribute("aria-expanded", "false")
    this.inputTarget.removeAttribute("aria-activedescendant")
  }

  _updateLoaderVisibility() {
    if (!this.hasLoaderTarget) return
    this.loaderTarget.style.display = this.loadingValue ? "flex" : "none"
  }
}
