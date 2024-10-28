// Function to calculate the diagonal angle
function diagonalAngle(width: number, height: number): number {
  // Calculate the arctangent of the height/width ratio
  const radians = Math.atan(height / width)
  // Convert from radians to degrees
  const degrees = radians * (180 / Math.PI)
  // Return the CSS-compatible angle
  return 180 - degrees
}

// Function to observe an element by its ID and update the CSS variable
export function observeElementById(id: string): void {
  const element = document.getElementById(id)

  // If the element doesn't exist, exit the function
  if (!element) {
    console.error(`Element with id "${id}" not found.`)
    return
  }

  const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      const target = entry.target as HTMLElement
      const height = target.offsetHeight
      const width = target.offsetWidth

      // Calculate diagonal angle based on the element's width and height
      const angle: number = diagonalAngle(width, height)

      // Set the CSS variable for the diagonal angle
      element.style.setProperty('--angle', `${angle}`)
    }
  })

  // Observe the element with the provided ID
  ro.observe(element)
}
