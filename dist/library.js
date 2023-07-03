class Query {
    _limit = 10;
    _skip = 0;
    _filter
    _total = 0;
    _sort;

    get limit() {
        return this._limit;
    }

    withLimit(newValue) {
        this._limit = newValue;
        return this;
    }

    get skip() {
        return this._skip;
    }

    withSkip(number) {
        this._skip = number;
        return this;
    }

    withFilter(filter) {
        this._filter = filter;
        return this;
    }

    get filter() {
        return this._filter?.build();
    }

    goto(number) {
        this._skip = this._limit * (number - 1);
    }

    gotoOffset(number) {
        this._skip += this._limit * number;
    }

    onTotal(number) {
        this._total = number;
    }

    get maxPage() {
        return Math.floor((this._total - 1) / this._limit + 1);
    }

    get sort() {
        return this._sort?.build();
    }

    withSort(sort) {
        this._sort = sort;
        return this;
    }
}

function and(...expressions) {
    return ComplexExpression.and(expressions);
}

function or(...expressions) {
    return ComplexExpression.or(expressions);
}

function encodeValue(value) {
    value = encodeURIComponent(value);
    value = value.replaceAll('(', "%28");
    value = value.replaceAll(')', "%29");
    return value;
}

function equals(name, value) {
    return new SingleExpression("equals", name, encodeValue(value));
}

function notEquals(name, value) {
    return new SingleExpression("notequals", name, encodeValue(value));
}

function greaterThan(name, value) {
    return new SingleExpression("greaterthan", name, encodeValue(value));
}

function greaterThanOrEquals(name, value) {
    return new SingleExpression("greaterthanorequals", name, encodeValue(value));
}

function lessThan(name, value) {
    return new SingleExpression("lessthan", name, encodeValue(value));
}

function lessThanOrEquals(name, value) {
    return new SingleExpression("lessthanorequals", name, encodeValue(value));
}

function startsWith(name, value) {
    return new SingleExpression("startswith", name, encodeValue(value));
}

function endsWith(name, value) {
    return new SingleExpression("endswith", name, encodeValue(value));
}

function notIn(name, value) {
    return new SingleExpression("notin", name, JSON.stringify(value));
}

function isIn(name, value) {
    return new SingleExpression("in", name, JSON.stringify(value));
}

function between(name, valueStart, valueEnd) {
    return new SingleExpression("between", name, `${encodeValue(valueStart)},${encodeValue(valueEnd)}`);
}

function contains(name, value) {
    return new SingleExpression("contains", name, encodeValue(value));
}

function isnull(name) {
    return new SingleExpression("isnull", name);
}

function notnull(name) {
    return new SingleExpression("notnull", name);
}

function desc(name) {
    return new Sort().desc(name);
}

function asc(name) {
    return new Sort().asc(name);
}

class SingleExpression {
    _operator;
    _name;
    _value;

    constructor(operator, name, value) {
        this._operator = operator;
        this._name = name;
        this._value = value;
    }

    build() {
        if (this._operator === "isnull" || this._operator === "notnull") {
            return `(${this._name} ${this._operator})`
        }
        return `(${this._name} ${this._operator} ${this._value})`
    }
}

class ComplexExpression {
    _condition;
    _expressions;

    constructor(condition, expressions) {
        this._condition = condition;
        this._expressions = expressions;
    }


    static and(expressions) {
        return new ComplexExpression("and", expressions);
    }

    build() {
        return `(${this._condition}${(this._expressions?.map(it => it.build()).join(""))})`
    }

    static or(expressions) {
        return new ComplexExpression("or", expressions);
    }
}

class Sort {
    _fields = []

    desc(name) {
        this._fields.push(new SoftField(name, "desc"));
        return this;
    }

    asc(name) {
        this._fields.push(new SoftField(name, "asc"));
        return this;
    }

    build() {
        return this._fields.map(it => it.build()).join(",")
    }
}

class SoftField {
    _name;
    _direction;

    constructor(name, direction) {
        this._name = name;
        this._direction = direction;
    }

    build() {
        return `${this._name} ${this._direction}`
    }
}

export { Query, and, asc, between, contains, desc, endsWith, equals, greaterThan, greaterThanOrEquals, isIn, isnull, lessThan, lessThanOrEquals, notEquals, notIn, notnull, or, startsWith };
