import {
    and, between, contains, endsWith,
    equals,
    greaterThan,
    greaterThanOrEquals, isIn, isnull,
    lessThan,
    lessThanOrEquals,
    notEquals, notIn, notnull,
    or, startsWith
} from "@/DslQueryBuilder";
import {describe,it,expect} from "vitest";
describe('dsl builder test', function () {
    it('should build empty with and', function () {
        expect(and().build()).toEqual("(and)")
    });

    it('should build empty with or', function () {
        expect(or().build()).toEqual("(or)")
    });
    it('should build with equals', function () {
        expect(and(equals("name", "123")).build()).toEqual("(and(name eq 123))")
    });
    it('should build with equals contains special char', function () {
        expect(and(equals("name", "123()")).build()).toEqual("(and(name eq 123%28%29))")
    });
    it('should build with 2 equals', function () {
        expect(and(equals("name", "123"), equals("age", 12)).build()).toEqual("(and(name eq 123)(age eq 12))")
    });
    it('should build with complex equals', function () {
        expect(and(equals("name", "123"), or(equals("age", 12))).build()).toEqual("(and(name eq 123)(or(age eq 12)))")
    });
    it('should return notequals', function () {
        expect(notEquals("name", "123").build()).toEqual("(name ne 123)")
    });
    it('should return greaterthan', function () {
        expect(greaterThan("name", "123").build()).toEqual("(name gt 123)")
    });
    it('should return greaterthanorequal', function () {
        expect(greaterThanOrEquals("name", "123").build()).toEqual("(name ge 123)")
    });
    it('should return lessthan', function () {
        expect(lessThan("name", "123").build()).toEqual("(name lt 123)")
    });
    it('should return lessthanorequals', function () {
        expect(lessThanOrEquals("name", "123").build()).toEqual("(name le 123)")
    });
    it('should return startswith', function () {
        expect(startsWith("name", "123").build()).toEqual("(name sw 123)")
    });
    it('should return endswith', function () {
        expect(endsWith("name", "123").build()).toEqual("(name ew 123)")
    });
    it('should return contains', function () {
        expect(contains("name", "123").build()).toEqual("(name ct 123)")
    });
    it('should return isnull', function () {
        expect(isnull("name").build()).toEqual("(name isn)")
    });
    it('should return notnull', function () {
        expect(notnull("name").build()).toEqual("(name inn)")
    });
    it('should return NotIn', function () {
        expect(notIn("name", ["1", "2"]).build()).toEqual("(name ni %5B\"1\",\"2\"%5D)")
    });
    it('should return In', function () {
        expect(isIn("name", ["1", "2"]).build()).toEqual("(name in %5B\"1\",\"2\"%5D)")
    });
    it('should return Between', function () {
        expect(between("name", "1", "2").build()).toEqual("(name bt 1,2)")
    });

});