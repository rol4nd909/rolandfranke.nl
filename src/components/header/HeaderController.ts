type ViewportMode = 'mobile' | 'desktop'

interface HeaderControllerOptions {
  headerSelector: string
  toggleSelector: string
  closeSelector: string
  openSelector: string
  dialogSelector: string
}

export class HeaderController {
  /* ---------------------------------- */
  /* Elements */
  /* ---------------------------------- */

  private header: HTMLElement
  private toggle: HTMLButtonElement
  private closeButton: HTMLButtonElement
  private openButton: HTMLButtonElement
  private dialog: HTMLDialogElement

  /* ---------------------------------- */
  /* State */
  /* ---------------------------------- */

  private mode: ViewportMode = 'desktop'
  private mediaQuery: MediaQueryList

  /* ---------------------------------- */
  /* Setup */
  /* ---------------------------------- */

  constructor(options: HeaderControllerOptions) {
    const header = document.querySelector(options.headerSelector)
    const toggle = document.querySelector(options.toggleSelector)
    const closeButton = document.querySelector(options.closeSelector)
    const openButton = document.querySelector(options.openSelector)
    const dialog = document.querySelector(options.dialogSelector)

    if (!header || !toggle || !closeButton || !openButton || !dialog) {
      throw new Error('HeaderController: missing elements')
    }

    this.header = header as HTMLElement
    this.toggle = toggle as HTMLButtonElement
    this.closeButton = closeButton as HTMLButtonElement
    this.openButton = openButton as HTMLButtonElement
    this.dialog = dialog as HTMLDialogElement

    this.mediaQuery = window.matchMedia('(width >= 40.5rem)')

    this.init()
  }

  /* ---------------------------------- */
  /* Initialization */
  /* ---------------------------------- */

  private init(): void {
    this.updateMode()
    this.bindEvents()

    this.mediaQuery.addEventListener('change', () => {
      this.updateMode()
      this.reset()
    })
  }

  /* ---------------------------------- */
  /* Viewport mode */
  /* ---------------------------------- */

  private updateMode(): void {
    this.mode = this.mediaQuery.matches ? 'desktop' : 'mobile'
  }

  private isDesktop(): boolean {
    return this.mode === 'desktop'
  }

  /* ---------------------------------- */
  /* Public interactions */
  /* ---------------------------------- */

  private open(): void {
    this.setExpanded(true)

    // Desktop behaviour: CSS-driven menu
    if (this.isDesktop()) {
      this.header.classList.add('open')
      this.getFocusables()[0]?.focus()
      return
    }

    // Mobile behaviour: native dialog
    this.dialog.showModal()
    this.lock()
  }

  private close(options: { restoreFocus?: boolean } = {}): void {
    const { restoreFocus = true } = options

    this.setExpanded(false)

    // Desktop behaviour
    if (this.isDesktop()) {
      const headerLayout = this.header.querySelector<HTMLElement>('header-layout')
      if (!headerLayout) return

      this.header.classList.remove('open')

      if (!restoreFocus) return

      this.onNextTransitionEnd(headerLayout, () => {
        this.toggle.focus()
      })

      return
    }

    // Mobile behaviour
    this.closeDialogIfNeeded()
    this.unlock()
  }

  private toggleMenu = (): void => {
    if (this.isDesktop()) {
      const isOpen = this.header.classList.contains('open')
      isOpen ? this.close() : this.open()
      return
    }

    this.dialog.open ? this.close() : this.open()
  }

  private reset(): void {
    this.header.classList.remove('open')
    this.setExpanded(false)

    this.closeDialogIfNeeded()
    this.unlock()
  }

  /* ---------------------------------- */
  /* Dialog helpers */
  /* ---------------------------------- */

  private closeDialogIfNeeded(): void {
    if (this.dialog.open) {
      this.dialog.close()
    }
  }

  /* ---------------------------------- */
  /* Accessibility state */
  /* ---------------------------------- */

  private setExpanded(value: boolean): void {
    this.toggle.setAttribute('aria-expanded', String(value))
    this.openButton.setAttribute('aria-expanded', String(value))
  }

  /* ---------------------------------- */
  /* Keyboard interactions */
  /* ---------------------------------- */

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.isDesktop()) return

    if (event.key === 'Escape') {
      this.close()
    }
  }

  /* ---------------------------------- */
  /* Scroll behaviour (desktop only) */
  /* ---------------------------------- */

  private onScroll = (): void => {
    if (!this.isDesktop()) return

    const isOpen = this.header.classList.contains('open')
    if (!isOpen) return

    this.close()
  }

  /* ---------------------------------- */
  /* Focus management */
  /* ---------------------------------- */

  private getFocusables(): HTMLElement[] {
    return Array.from(
      this.header.querySelectorAll<HTMLElement>(
        `
        a[href],
        button:not([disabled]),
        [tabindex]:not([tabindex="-1"])
        `
      )
    ).filter((el) => {
      const style = getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }

  private onNextTransitionEnd(element: HTMLElement, callback: () => void): void {
    const handle = (event: TransitionEvent): void => {
      if (event.currentTarget !== element) return

      element.removeEventListener('transitionend', handle)
      callback()
    }

    element.addEventListener('transitionend', handle)
  }

  private onFocusIn = (event: FocusEvent): void => {
    if (!this.isDesktop()) return

    const isOpen = this.header.classList.contains('open')
    if (!isOpen) return

    const target = event.target as Node

    // Als focus buiten header komt → sluiten
    if (!this.header.contains(target)) {
      this.close({ restoreFocus: false })
    }
  }

  /* ---------------------------------- */
  /* Scroll locking */
  /* ---------------------------------- */

  private lock(): void {
    document.documentElement.style.overflow = 'hidden'
  }

  private unlock(): void {
    document.documentElement.style.overflow = ''
  }

  /* ---------------------------------- */
  /* Event binding */
  /* ---------------------------------- */

  private bindEvents(): void {
    this.toggle.addEventListener('click', this.toggleMenu)
    this.closeButton.addEventListener('click', this.toggleMenu)
    this.openButton.addEventListener('click', this.toggleMenu)

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('focusin', this.onFocusIn)

    // Sync dialog state (native close)
    this.dialog.addEventListener('close', () => {
      this.setExpanded(false)
      this.unlock()
    })

    this.dialog.addEventListener('cancel', (event) => {
      event.preventDefault()
      this.close()
    })
  }
}
