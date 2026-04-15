// Google Maps API loader utility
let isGoogleMapsLoaded = false;
let loadPromise: Promise<void> | null = null;

export const loadGoogleMaps = (): Promise<void> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
    );
  }
  // If already loaded, return resolved promise
  if (isGoogleMapsLoaded && typeof google !== "undefined") {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (loadPromise) {
    return loadPromise;
  }

  // Create new loading promise
  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof google !== "undefined" && google.maps) {
      isGoogleMapsLoaded = true;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsReady = (): boolean => {
  return isGoogleMapsLoaded && typeof google !== "undefined";
};