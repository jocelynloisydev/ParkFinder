export function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).__googleMapsLoaded) {
      resolve()
      return
    }

    ;(window as any).__googleMapsCallback = () => {
      ;(window as any).__googleMapsLoaded = true
      resolve()
    }

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async&v=weekly&callback=__googleMapsCallback`
    script.async = true
    script.defer = true

    script.onerror = () => reject('Google Maps failed to load')

    document.head.appendChild(script)
  })
}
