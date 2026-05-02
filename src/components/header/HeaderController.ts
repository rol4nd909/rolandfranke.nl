type MenuState = 'closed' | 'open' | 'closing'
type ViewportMode = 'mobile' | 'desktop'

interface HeaderControllerOptions {
  headerSelector: string
  toggleSelector: string
  menuSelector: string
}

export class HeaderController {
  private header: HTMLElement
  private toggle: HTMLButtonElement
  private menu: HTMLElement

  private state: MenuState = 'closed'
  private mode: ViewportMode = 'desktop'

  private mediaQuery: MediaQueryList

  constructor(options: HeaderControllerOptions) {
    const header = document.querySelector(options.headerSelector)
    const toggle = document.querySelector(options.toggleSelector)
    const menu = document.querySelector(options.menuSelector)

    if (!header || !toggle || !menu) {
      throw new Error('HeaderController: missing elements')
    }

    this.header = header as HTMLElement
    this.toggle = toggle as HTMLButtonElement
    this.menu = menu as HTMLElement

    this.mediaQuery = window.matchMedia('(width >= 40.5rem)')

    this.init()
  }

  /* ---------------------------------- */
  /* Init */
  /* ---------------------------------- */

  private init(): void {
    this.updateMode()
    this.bindEvents()

    this.mediaQuery.addEventListener('change', () => {
      this.updateMode()
      this.forceClose()
    })
  }

  /* ---------------------------------- */
  /* Mode */
  /* ---------------------------------- */

  private updateMode(): void {
    this.mode = this.mediaQuery.matches ? 'desktop' : 'mobile'
  }

  private isMobile(): boolean {
    return this.mode === 'mobile'
  }

  private isDesktop(): boolean {
    return this.mode === 'desktop'
  }

  /* ---------------------------------- */
  /* State */
  /* ---------------------------------- */

  private open(): void {
    this.state = 'open'

    this.header.classList.add('open')
    this.header.classList.remove('closing')

    this.toggle.setAttribute('aria-expanded', 'true')

    if (this.isMobile()) {
      this.lock()
      this.toggle.focus()

      return
    }
  }

  private close(): void {
    if (this.state === 'closed') return

    this.state = 'closing'

    this.header.classList.remove('open')
    this.header.classList.add('closing')

    this.toggle.setAttribute('aria-expanded', 'false')

    if (this.isMobile()) {
      this.unlock()

      window.setTimeout(() => {
        this.header.classList.remove('closing')
        this.state = 'closed'
        this.toggle.focus()
      }, this.getAnimationDuration(this.menu))

      return
    }

    window.setTimeout(() => {
      this.header.classList.remove('closing')
      this.state = 'closed'
      this.toggle.focus()
    }, this.getAnimationDuration(this.menu))
  }

  private forceClose(): void {
    this.state = 'closed'

    this.header.classList.remove('open', 'closing')
    this.toggle.setAttribute('aria-expanded', 'false')

    if (this.isMobile()) {
      this.unlock()
    }
  }

  /* ---------------------------------- */
  /* Interaction */
  /* ---------------------------------- */

  private toggleMenu = (): void => {
    if (this.state === 'open') {
      this.close()
      return
    }

    this.open()
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.state !== 'open') return

    if (event.key === 'Escape') {
      this.close()
      return
    }

    if (this.isMobile() && event.key === 'Tab') {
      this.trapFocus(event)
    }
  }

  private onScroll = (): void => {
    if (this.isDesktop() && this.state === 'open') {
      this.close()
    }
  }

  /* ---------------------------------- */
  /* Focus */
  /* ---------------------------------- */

  private trapFocus(event: KeyboardEvent): void {
    const focusables = this.isMobile() ? this.getMobileFocusableElements() : this.getFocusables()

    if (!focusables.length) return

    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement)

    if (currentIndex === -1) return

    event.preventDefault()

    const direction = event.shiftKey ? -1 : 1

    let nextIndex = currentIndex + direction

    if (nextIndex < 0) {
      nextIndex = focusables.length - 1
    }

    if (nextIndex >= focusables.length) {
      nextIndex = 0
    }

    focusables[nextIndex].focus()
  }

  private getFocusables(): HTMLElement[] {
    return Array.from(
      this.menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
  }

  private getMobileFocusableElements(): HTMLElement[] {
    const homeLink = this.header.querySelector<HTMLElement>('.js_logo')
    const menuItems = Array.from(this.menu.querySelectorAll<HTMLElement>('a[href]'))
    const themeToggle = this.header.querySelector<HTMLElement>('#themeToggle')

    return [this.toggle, ...menuItems, themeToggle, homeLink].filter(
      (element): element is HTMLElement => Boolean(element)
    )
  }

  /* ---------------------------------- */
  /* A11y helpers */
  /* ---------------------------------- */

  private lock(): void {
    document.body.classList.add('scroll-lock')

    Array.from(document.body.children).forEach((element) => {
      if (element !== this.header) {
        element.setAttribute('inert', '')
      }
    })
  }

  private unlock(): void {
    document.body.classList.remove('scroll-lock')

    document.querySelectorAll('[inert]').forEach((el) => {
      el.removeAttribute('inert')
    })
  }

  /* ---------------------------------- */
  /* Utils */
  /* ---------------------------------- */

  private getAnimationDuration(element: HTMLElement): number {
    const style = getComputedStyle(element)

    const duration = parseFloat(style.transitionDuration) || 0.25
    const delay = parseFloat(style.transitionDelay) || 0

    return (duration + delay) * 1000
  }

  /* ---------------------------------- */
  /* Events */
  /* ---------------------------------- */

  private bindEvents(): void {
    this.toggle.addEventListener('click', this.toggleMenu)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }
}
