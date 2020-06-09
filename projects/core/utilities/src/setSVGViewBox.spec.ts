import { setSVGViewBox } from "./setSVGViewBox";

describe('setSVGViewBox', () => {
  it('should crop svg image', () => {
    const svg = getTestSvgElement();
    document.body.appendChild(svg);

    setSVGViewBox(svg);

    expect(svg.getAttribute('width')).toEqual('150');
    expect(svg.getAttribute('height')).toEqual('50');
    expect(svg.getAttribute('viewBox')).toEqual('50 50 150 50');
  });
});

function getTestSvgElement(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', "50, 50, 50, 100, 200, 100");
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '250');
  svg.appendChild(polygon);

  return svg;
}