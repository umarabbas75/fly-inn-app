// --- REVISED AND VERIFIED HELPER FUNCTION ---
const getBase64ClusterIcon = (
  width: number,
  height: number,
  iconColor: string = "#000000",
  textColor: string = "#000000"
) => {
  // Positioning Constants
  const globeSize = 18;
  const globeX = 8;
  const globeY = 8;
  const textX = 40; // X position for the text to ensure alignment right of the icon
  const textY = 22; // Aligned text baseline (This is the critical adjustment point)

  const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" rx="${height / 2}" ry="${
    height / 2
  }" width="${width}" height="${height}" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1.5"/>
        
        <g transform="translate(${globeX}, ${globeY}) scale(${globeSize / 22})">
          <path fill="${iconColor}" d="M11 0C4.935 0 0 4.935 0 11C0 17.065 4.935 22 11 22C17.065 22 22 17.065 22 11C22 4.935 17.065 0 11 0ZM11 1.833C15.938 1.833 20 5.895 20 11H2C2 5.895 6.062 1.833 11 1.833ZM11 20.167C6.062 20.167 2 16.105 2 11H20C20 16.105 15.938 20.167 11 20.167ZM11 1.833C15.938 1.833 20 5.895 20 11H2C2 5.895 6.062 1.833 11 1.833Z"/>
        </g>
        
        <text x="${textX}" y="${textY}" text-anchor="middle" fill="${textColor}" font-size="16" font-weight="600"></text>
      </svg>
    `;

  // Use encodeURIComponent for reliable Base64 conversion
  const base64SVG = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64SVG}`;
};
