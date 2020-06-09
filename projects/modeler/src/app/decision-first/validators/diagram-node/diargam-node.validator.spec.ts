import { isValidDiagramNodeText } from "./diagram-node.validator";

describe(`isValidDiagramNodeText`, () => {
    it(`should return true for not-null not empty string`, () => {
        const input = 'SampleText';

        const result = isValidDiagramNodeText(input);

        expect(result).toBeTruthy();
    });

    it(`should return false for empty string`, () => {
        const input = '';

        const result = isValidDiagramNodeText(input);

        expect(result).toBeFalsy();
    });

    it(`should return false for null`, () => {
        const input = null;

        const result = isValidDiagramNodeText(input);

        expect(result).toBeFalsy();
    });
});