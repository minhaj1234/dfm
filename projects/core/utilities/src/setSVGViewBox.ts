export function setSVGViewBox(image: SVGElement): void {
  const svg = image as SVGSVGElement;
  if(svg) {
    const boundingBox = svg.getBBox();
    const viewBox = [boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height].join(" ");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", boundingBox.width.toString());
    svg.setAttribute("height", boundingBox.height.toString());
  }
}