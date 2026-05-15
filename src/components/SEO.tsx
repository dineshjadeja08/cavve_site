import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export function SEO({ 
  title, 
  description = "CAVVE | WEAR DISCIPLINE. Premium minimalist menswear. Quiet luxury. Built for ambition.", 
  image = "https://cavve.com/og-image.jpg", 
  url = "https://cavve.com",
  type = "website"
}: SEOProps) {
  useEffect(() => {
    document.title = `${title} | CAVVE`
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute('content', description)

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) ogImage.setAttribute('content', image)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', url)

    const ogType = document.querySelector('meta[property="og:type"]')
    if (ogType) ogType.setAttribute('content', type)

    // Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) twitterTitle.setAttribute('content', title)

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) twitterDescription.setAttribute('content', description)

    const twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (twitterImage) twitterImage.setAttribute('content', image)

  }, [title, description, image, url, type])

  return null
}
