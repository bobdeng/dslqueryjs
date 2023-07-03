import {
    and, between, contains, endsWith,
    equals,
    greaterThan,
    greaterThanOrEquals, isIn, isnull,
    lessThan,
    lessThanOrEquals,
    notEquals, notIn, notnull,
    or, startsWith
} from "../src/DslQueryBuilder";

describe('dsl builder test', function () {
    it('should build empty with and', function () {
        expect(and().build()).toEqual("(and)")
    });

    it('should build empty with or', function () {
        expect(or().build()).toEqual("(or)")
    });
    it('should build with equals', function () {
        expect(and(equals("name", "123")).build()).toEqual("(and(name equals 123))")
    });
    it('should build with equals contains special char', function () {
        expect(and(equals("name", "123()")).build()).toEqual("(and(name equals 123%28%29))")
    });
    it('should build with 2 equals', function () {
        expect(and(equals("name", "123"), equals("age", 12)).build()).toEqual("(and(name equals 123)(age equals 12))")
    });
    it('should build with complex equals', function () {
        expect(and(equals("name", "123"), or(equals("age", 12))).build()).toEqual("(and(name equals 123)(or(age equals 12)))")
    });
    it('should return notequals', function () {
        expect(notEquals("name", "123").build()).toEqual("(name notequals 123)")
    });
    it('should return greaterthan', function () {
        expect(greaterThan("name", "123").build()).toEqual("(name greaterthan 123)")
    });
    it('should return greaterthanorequal', function () {
        expect(greaterThanOrEquals("name", "123").build()).toEqual("(name greaterthanorequals 123)")
    });
    it('should return lessthan', function () {
        expect(lessThan("name", "123").build()).toEqual("(name lessthan 123)")
    });
    it('should return lessthanorequals', function () {
        expect(lessThanOrEquals("name", "123").build()).toEqual("(name lessthanorequals 123)")
    });
    it('should return startswith', function () {
        expect(startsWith("name", "123").build()).toEqual("(name startswith 123)")
    });
    it('should return endswith', function () {
        expect(endsWith("name", "123").build()).toEqual("(name endswith 123)")
    });
    it('should return contains', function () {
        expect(contains("name", "123").build()).toEqual("(name contains 123)")
    });
    it('should return isnull', function () {
        expect(isnull("name").build()).toEqual("(name isnull)")
    });
    it('should return notnull', function () {
        expect(notnull("name").build()).toEqual("(name notnull)")
    });
    it('should return NotIn', function () {
        expect(notIn("name", ["1", "2"]).build()).toEqual("(name notin [\"1\",\"2\"])")
    });
    it('should return In', function () {
        expect(isIn("name", ["1", "2"]).build()).toEqual("(name in [\"1\",\"2\"])")
    });
    it('should return Between', function () {
        expect(between("name", "1", "2").build()).toEqual("(name between 1,2)")
    });

});