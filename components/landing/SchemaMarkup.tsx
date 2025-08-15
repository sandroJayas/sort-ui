export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Sort Storage",
    description: "On-demand storage service for NYC apartments",
    url: "https://sort.storage",
    logo: "https://sort.storage/logo.png",
    priceRange: "$55/month",
    areaServed: [
      {
        "@type": "City",
        name: "New York City",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    sameAs: [
      "https://twitter.com/sortstorage",
      "https://instagram.com/sortstorage",
    ],
    offers: {
      "@type": "Offer",
      description: "Storage boxes with pickup and delivery",
      price: "55.00",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
