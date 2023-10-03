declare class Query {
    _limit: number;
    _skip: number;
    _filter: any;
    _total: number;
    _sort: any;
    get limit(): number;
    withLimit(newValue: any): this;
    get skip(): number;
    withSkip(number: any): this;
    withFilter(filter: any): this;
    get filter(): any;
    goto(number: any): void;
    gotoOffset(number: any): void;
    onTotal(number: any): void;
    get maxPage(): number;
    get sort(): any;
    withSort(sort: any): this;
}

declare function and(...expressions: any[]): ComplexExpression;
declare function or(...expressions: any[]): ComplexExpression;
declare function equals(name: any, value: any): SingleExpression;
declare function notEquals(name: any, value: any): SingleExpression;
declare function greaterThan(name: any, value: any): SingleExpression;
declare function greaterThanOrEquals(name: any, value: any): SingleExpression;
declare function lessThan(name: any, value: any): SingleExpression;
declare function lessThanOrEquals(name: any, value: any): SingleExpression;
declare function startsWith(name: any, value: any): SingleExpression;
declare function endsWith(name: any, value: any): SingleExpression;
declare function notIn(name: any, value: any): SingleExpression;
declare function isIn(name: any, value: any): SingleExpression;
declare function between(name: any, valueStart: any, valueEnd: any): SingleExpression;
declare function contains(name: any, value: any): SingleExpression;
declare function isnull(name: any): SingleExpression;
declare function notnull(name: any): SingleExpression;
declare function desc(name: any): Sort;
declare function asc(name: any): Sort;
declare class SingleExpression {
    _operator: any;
    _name: any;
    _value: any;
    constructor(operator: any, name: any, value?: any);
    build(): string;
}
declare class ComplexExpression {
    _condition: any;
    _expressions: any;
    constructor(condition: any, expressions: any);
    static and(expressions: any): ComplexExpression;
    build(): string;
    static or(expressions: any): ComplexExpression;
}
declare class Sort {
    _fields: any[];
    desc(name: any): this;
    asc(name: any): this;
    build(): string;
}

export { Query, SingleExpression, and, asc, between, contains, desc, endsWith, equals, greaterThan, greaterThanOrEquals, isIn, isnull, lessThan, lessThanOrEquals, notEquals, notIn, notnull, or, startsWith };
