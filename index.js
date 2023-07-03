import {Query} from "./src/Query";
import {
    and, asc, between, contains, desc, endsWith,
    equals,
    greaterThan,
    greaterThanOrEquals, isIn, isnull,
    lessThan,
    lessThanOrEquals,
    notEquals, notIn, notnull,
    or, startsWith
} from "./src/DslQueryBuilder";

module.exports = {
    Query,
    and, or, equals, notEquals, greaterThan, greaterThanOrEquals, lessThan, lessThanOrEquals,
    startsWith,
    endsWith, notIn,
    isIn, between, contains,
    isnull, notnull,
    desc, asc
}