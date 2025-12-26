export const COLORS = {
  background: '#050505',
  gold: '#FCD34D',
  champagne: '#FDE68A',
  warmWhite: '#FFFBEB',
  darkGold: '#B45309',
};

// Detect mobile device
const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const CONFIG = {
  particleCount: isMobile ? 800 : 2500, // Reduced for mobile
  treeHeight: 8,
  treeRadius: 3.5,
  explosionForce: 0.15, // Speed of particles after click
  cameraPosition: [0, 0, 12] as [number, number, number],
  isMobile, // Export for other components
};

export const TEXT = {
  khmer: "", // Pisces Zodiac
  main: "Oun Chhan",
  sub: "May all your dreams come true, you truly deserve them.",
};