interface HeaderControllerOptions {
  headerSelector: string
  toggleSelector: string
  dialogSelector: string
}

export class HeaderController {
  /* ---------------------------------- */
  /* Elements */
  /* ---------------------------------- */

  private header: HTMLElement
  private toggle: HTMLButtonElement
  private dialog: HTMLDialogElement

  /* ---------------------------------- */
  /* Responsive */
  /* ---------------------------------- */

  private mediaQuery = window.matchMedia('(width >= 40.5rem)')

  /* ---------------------------------- */
  /* Setup */
  /* ---------------------------------- */

  constructor(options: HeaderControllerOptions) {
    const header = document.querySelector<HTMLElement>(options.headerSelector)
    const toggle = document.querySelector<HTMLButtonElement>(options.toggleSelector)
    const dialog = document.querySelector<HTMLDialogElement>(options.dialogSelector)

    if (!header || !toggle || !dialog) {
      throw new Error('HeaderController: missing elements')
    }

    this.header = header
    this.toggle = toggle
    this.dialog = dialog

    this.init()
  }

  /* ---------------------------------- */
  /* Initialization */
  /* ---------------------------------- */

  private init(): void {
    this.bindEvents()

    this.mediaQuery.addEventListener('change', () => {
      this.reset()
    })
  }

  /* ---------------------------------- */
  /* Helpers */
  /* ---------------------------------- */

  private isDesktop(): boolean {
    return this.mediaQuery.matches
  }

  private isOpen(): boolean {
    return this.header.classList.contains('open')
  }

  /* ---------------------------------- */
  /* Desktop menu */
  /* ---------------------------------- */

  private open(): void {
    this.header.classList.add('open')
    this.toggle.setAttribute('aria-expanded', 'true')

    this.getFocusables()[0]?.focus()
  }

  private close(options: { restoreFocus?: boolean } = {}): void {
    const { restoreFocus = true } = options

    const headerLayout = this.header.querySelector<HTMLElement>('header-layout')

    this.header.classList.remove('open')
    this.toggle.setAttribute('aria-expanded', 'false')

    if (!restoreFocus || !headerLayout) return

    this.onNextTransitionEnd(headerLayout, () => {
      this.toggle.focus()
    })
  }

  private toggleMenu = (): void => {
    this.isOpen() ? this.close() : this.open()
  }

  private reset(): void {
    this.header.classList.remove('open')
    this.toggle.setAttribute('aria-expanded', 'false')

    if (this.dialog.open) {
      this.dialog.close()
    }
  }

  /* ---------------------------------- */
  /* Keyboard interactions */
  /* ---------------------------------- */

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.isDesktop()) return
    if (!this.isOpen()) return

    if (event.key === 'Escape') {
      this.close()
    }
  }

  /* ---------------------------------- */
  /* Scroll behaviour (desktop only) */
  /* ---------------------------------- */

  private onScroll = (): void => {
    if (!this.isDesktop()) return
    if (!this.isOpen()) return

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

  private onFocusIn = (event: FocusEvent): void => {
    if (!this.isDesktop()) return
    if (!this.isOpen()) return

    const target = event.target as Node

    // Als focus buiten header komt → sluiten
    if (!this.header.contains(target)) {
      this.close({ restoreFocus: false })
    }
  }

  /* ---------------------------------- */
  /* Transition helpers */
  /* ---------------------------------- */

  private onNextTransitionEnd(element: HTMLElement, callback: () => void): void {
    const handle = (event: TransitionEvent): void => {
      if (event.currentTarget !== element) return

      element.removeEventListener('transitionend', handle)

      callback()
    }

    element.addEventListener('transitionend', handle, {
      once: true,
    })
  }

  /* ---------------------------------- */
  /* Event binding */
  /* ---------------------------------- */

  private bindEvents(): void {
    this.toggle.addEventListener('click', this.toggleMenu)

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('focusin', this.onFocusIn)
  }
}
