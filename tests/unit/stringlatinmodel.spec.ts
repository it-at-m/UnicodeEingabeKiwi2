

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

import { getModel } from "../../src/api/StringLatinModelService";

describe('StringLatinModelService-test', () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it.skip('Get model properties',() => {

        fetchMock.mockResponse(
            `<?xml version="1.0" encoding="UTF-8"?>
            <stringlatin name="DIN SPEC 91379:2019-03" dataversion="DINSpec-202110" xmlns="http://muenchen.de/stringlatin/">

                <char name="A" normative="true" case="capital">
                    <profile ref="id0" />
                    <basechar type="real" name="A" name-ci="a" />
                </char>

                <char name="A̋" normative="true" case="capital">
                    <profile ref="id0" />
                    <basechar type="real" name="A" name-ci="a" />
                </char>

                <char name="a" normative="true" case="small">
                    <profile ref="id0" />
                    <basechar type="real" name="a" name-ci="a" />
                </char>
        
                <char name="a̋" normative="true" case="small">
                    <profile ref="id0" />
                    <basechar type="real" name="a" name-ci="a" />
                </char>

                <profile id="__all">
                    <name lang="de">alle</name>
                    <name lang="en">all</name>
                    <description lang="de">Alle Zeichen inkl. Buchstaben, Ziffern, etc.</description>
                    <description lang="en">All characters incl. letters, digits, etc.</description>
                </profile>
            
                <profile id="id0">
                    <name lang="de">Zeichen + Buchstaben</name>
                    <name lang="en">Characters + letters</name>
                    <description lang="de">Verpflichtende/normative Zeichen, Ziffern und Buchstaben</description>
                    <description lang="en">Mandatory/normative characters, numbers and letters</description>
                </profile>
            </stringlatin>`
        );

        return getModel().getModelProperties().then((props) => {

            expect(props.name).toEqual("DIN SPEC 91379:2019-03");

            expect(props.dataversion).toEqual("DINSpec-202110");
        });

    });
});
