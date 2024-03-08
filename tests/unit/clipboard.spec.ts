
import * as clipboard from "clipboard-polyfill/text";

describe('clipboard-test', () => {


    it('Copy text to clipboard',() => {

        const input = '😜🇺🇸👍m̂';
        
        const copied = jest.fn();
        const error = jest.fn();

        return clipboard.writeText(input).then(
            copied,
            error
        ).then(() => {
            expect(copied).toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
        });

    });

});