// Function to calculate the diagonal angle
function diagonalAngle(width: number, height: number): number {
  // Calculate the arctangent of the height/width ratio
  const radians = Math.atan(height / width)
  // Convert from radians to degrees
  const degrees = radians * (180 / Math.PI)
  // Return the CSS-compatible angle
  return 180 - degrees
}

// Function to observe elements by class name and update their CSS variable
export function setDiagonalAngle(className: string): void {
  const elements = document.getElementsByClassName(className)

  // If no elements are found, exit the function
  if (elements.length === 0) {
    console.error(`No elements with class "${className}" found.`)
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
      target.style.setProperty('--angle', `${angle}`)
    }
  })

  // Loop through all elements with the provided class name and observe each
  Array.from(elements).forEach((element) => {
    ro.observe(element as HTMLElement)
  })
}
