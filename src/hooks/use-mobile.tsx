
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value once
    handleResize()
    
    // Add event listener with debounce for performance
    let resizeTimer: NodeJS.Timeout
    
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    // Clean up
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isMobile
}
