
import Graphemer from "graphemer";

describe('graphemer-test', () => {

    let splitter: Graphemer;

    beforeAll(() => {
        splitter = new Graphemer();
    });

    it('Split string into graphemes',() => {

        const input = 'ππΊπΈπmΜ';
        
        const graphemes = splitter.splitGraphemes(input);

        expect(graphemes.length).toEqual(4);
    });

});