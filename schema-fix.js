<script>
  function processSchemaWhenReady(retries = 10) {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const isCompanyPage = pathSegments.length === 2;

    const validCities = [
      "alpine", "anaheim", "antioch", "apple-valley", "atascadero", "auburn", "bakersfield", "beaumont", "benicia",
      "bethel-island", "beverly-hills", "brentwood", "buena-park", "burbank", "calabasas", "camarillo", "campbell",
      "canoga-park", "canyon-country", "carlsbad", "castroville", "cerritos", "chatsworth", "cherry-valley", "chico",
      "chula-vista", "clovis", "concord", "corona", "costa-mesa", "covina", "culver-city", "del-mar", "diamond-springs",
      "dixon", "downey", "dublin", "el-cajon", "el-centro", "el-dorado-hills", "encino", "escondido", "esparto",
      "eureka", "fairfield", "folsom", "foothill-ranch", "fowler", "fremont", "fresno", "garden-grove", "glendale",
      "glendora", "grass-valley", "grover-beach", "hanford", "hayward", "hemet", "indio", "ione", "irvine", "jamul",
      "la-jolla", "la-mesa", "la-verne", "laguna-niguel", "lancaster", "lathrop", "lincoln", "livermore", "lodi",
      "loomis", "los-alamitos", "los-angeles", "madera", "manteca", "marina", "menifee", "milpitas", "mission-hills",
      "modesto", "montrose", "mountain-view", "murrieta", "nevada-city", "newark", "norco", "north-hollywood",
      "northridge", "oakdale", "oakley", "oceanside", "ontario", "orange", "palm-desert", "palm-springs", "palmdale",
      "panorama-city", "paradise", "paramount", "pasadena", "petaluma", "pismo-beach", "placerville", "pomona",
      "prather", "rancho-cordova", "rancho-cucamonga", "redding", "redlands", "reedley", "richmond", "riverside",
      "rocklin", "roseville", "ross", "sacramento", "salida", "san-bernardino", "san-diego", "san-fernando",
      "san-francisco", "san-jose", "san-luis-obispo", "san-marcos", "san-mateo", "san-rafael", "san-ramon",
      "santa-ana", "santa-barbara", "santa-clarita", "santa-cruz", "santa-fe-springs", "santa-monica", "santa-rosa",
      "sebastopol", "sherman-oaks", "shingle-springs", "simi-valley", "smartsville", "soquel", "stevenson-ranch",
      "stockton", "sun-valley", "tarzana", "temecula", "torrance", "tulare", "turlock", "upland", "upper-lake",
      "vacaville", "valley-village", "van-nuys", "ventura", "victorville", "visalia", "vista", "walnut",
      "walnut-creek", "west-sacramento", "westlake-village", "westminster", "woodlake", "woodland", "woodland-hills",
      "yuba-city", "yucaipa"
    ];

    const isCityPage = pathSegments.length === 1 && validCities.includes(pathSegments[0].toLowerCase());

    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');

    if (schemaScripts.length === 0 && retries > 0) {
      return setTimeout(() => processSchemaWhenReady(retries - 1), 200);
    }

    schemaScripts.forEach(script => {
      const raw = script.textContent.trim();

      // ❌ Skip clearly malformed JSON (e.g., has ': ,' or empty values)
      if (raw.includes(': ,') || raw.includes('": "",') || raw.includes('"openingHours": ,')) {
        console.warn("⚠️ Skipping malformed JSON-LD block");
        script.remove();
        return;
      }

      try {
        const schemaData = JSON.parse(raw);

        if (schemaData['@type'] === 'LocalBusiness') {
          if (isCityPage) {
            script.remove();

            const citySchema = {
              "@context": "https://schema.org",
              "@type": "Place",
              "name": "{{ $city }}, {{ $state }}",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "{{ $city }}",
                "addressRegion": "{{ $state }}",
                "addressCountry": "US"
              },
              "description": "{{ $cityblurblong }}",
              "url": "{{ $page url }}"
            };

            const cityScript = document.createElement("script");
            cityScript.type = "application/ld+json";
            cityScript.textContent = JSON.stringify(citySchema);
            document.head.appendChild(cityScript);
          }

          if (isCompanyPage) {
            if (!schemaData.geo?.latitude || !schemaData.geo?.longitude) delete schemaData.geo;
            if (!schemaData.aggregateRating?.ratingValue || !schemaData.aggregateRating?.reviewCount) delete schemaData.aggregateRating;
            if (!schemaData.identifier?.value) delete schemaData.identifier;
            if (!schemaData.openingHours) delete schemaData.openingHours;
            if (!schemaData.image) schemaData.image = "https://www.solarinstallercalifornia.com/default-image.jpg";

            const newScript = document.createElement("script");
            newScript.type = "application/ld+json";
            newScript.textContent = JSON.stringify(schemaData);
            script.parentNode.replaceChild(newScript, script);
          }

          if (!isCityPage && !isCompanyPage) {
            script.remove();
          }
        }
      } catch (err) {
        console.warn("⛔ JSON-LD parse error — skipping:", err);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    processSchemaWhenReady();
  });
</script>
