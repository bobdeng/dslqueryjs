import {describe,it,expect} from "vitest";
import {asc, desc} from "@/DslQueryBuilder";

describe('order builder', function () {
    it('should be desc', function () {
        expect(desc("name").build()).toEqual("name desc")
    });
    it('should be asc', function () {
        expect(asc("name").build()).toEqual("name asc")
    });
    it('multiple order', function () {
        expect(asc("name").desc("age").build()).toEqual("name asc,age desc")
    });
});