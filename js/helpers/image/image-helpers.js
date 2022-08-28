export const getImageFromSVGString = (svgString) => {
  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      resolve(img);
    };
  });
};
