// Expression types
export interface Expression {
    build(): string;
}

export interface SortBuilder {
    desc(name: string): SortBuilder;
    asc(name: string): SortBuilder;
    build(): string;
}

// Query class
export class Query {
    _limit: number;
    _skip: number;
    _filter?: Expression;
    _total: number;
    _sort?: SortBuilder;

    get limit(): number;
    withLimit(newValue: number): Query;

    get skip(): number;
    withSkip(number: number): Query;

    withFilter(filter: Expression): Query;
    get filter(): string | undefined;

    goto(number: number): void;
    gotoOffset(number: number): void;
    onTotal(number: number): void;
    get maxPage(): number;

    get sort(): string | undefined;
    withSort(sort: SortBuilder): Query;
}

// Logical operators
export function and(...expressions: Expression[]): Expression;
export function or(...expressions: Expression[]): Expression;

// Comparison operators
export function equals(name: string, value: any): Expression;
export function notEquals(name: string, value: any): Expression;
export function greaterThan(name: string, value: any): Expression;
export function greaterThanOrEquals(name: string, value: any): Expression;
export function lessThan(name: string, value: any): Expression;
export function lessThanOrEquals(name: string, value: any): Expression;

// String operators
export function startsWith(name: string, value: any): Expression;
export function endsWith(name: string, value: any): Expression;
export function contains(name: string, value: any): Expression;
export function notStartsWith(name: string, value: any): Expression;
export function notEndsWith(name: string, value: any): Expression;
export function notContains(name: string, value: any): Expression;

// Collection operators
export function isIn(name: string, value: any[]): Expression;
export function notIn(name: string, value: any[]): Expression;
export function between(name: string, valueStart: any, valueEnd: any): Expression;
export function notBetween(name: string, valueStart: any, valueEnd: any): Expression;

// Null check operators
export function isnull(name: string): Expression;
export function notnull(name: string): Expression;
export function empty(name: string): Expression;
export function notEmpty(name: string): Expression;

// Sort operators
export function desc(name: string): SortBuilder;
export function asc(name: string): SortBuilder;

// Filter builder types
export type FilterRule<T = any> = (value: T, form: any) => Expression | Expression[];

export interface FilterRules {
    [key: string]: FilterRule;
    default?: (form: any) => Expression | undefined;
}

// Filter builder functions
export function buildFilter(rules: FilterRules, form: any, ...extraConditions: (Expression | null | undefined)[]): string;
export function buildFilterExpression(rules: FilterRules, form: any, ...extraConditions: (Expression | null | undefined)[]): Expression | undefined;