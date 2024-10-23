/* eslint-disable no-restricted-syntax */
export default function lazyLoadImages(element?: HTMLElement, lazyAttribute = 'data-src') {
  if (!element) return

  const imagesToLazy = Array.from(element.querySelectorAll(`img[${lazyAttribute}]`))
  if (!imagesToLazy.length) return

  const load = (img: Element) => {
    const src = img.getAttribute(lazyAttribute)
    const onload = () => {
      img.removeAttribute(lazyAttribute)
      img.removeEventListener('load', onload)
    }
    img.addEventListener('load', onload)
    img.setAttribute('src', src!)
  }

  const observeHandler = (entries: IntersectionObserverEntry[], self: IntersectionObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        load(entry.target)

        if (self) {
          self.unobserve(entry.target)
        }
      }
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new window.IntersectionObserver(observeHandler)

    for (const img of imagesToLazy) {
      observer.observe(img)
    }
  } else {
    // if browser does not support observers - load images
    for (const img of imagesToLazy) {
      load(img)
    }
  }
}
