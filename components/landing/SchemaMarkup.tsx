export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Sort Storage",
    description:
      "On-demand storage service for NYC apartments with 2-hour delivery",
    url: "https://sort.storage",
    logo: "https://sort.storage/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    priceRange: "$55/month",
    areaServed: [
      {
        "@type": "City",
        name: "Manhattan",
      },
      {
        "@type": "City",
        name: "Brooklyn",
      },
      {
        "@type": "City",
        name: "Queens",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1247",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
