export function and(...expressions) {
    return ComplexExpression.and(expressions);
}

export function or(...expressions) {
    return ComplexExpression.or(expressions);
}

function encodeValue(value) {
    value = encodeURIComponent(value);
    value = value.replaceAll('(', "%28");
    value = value.replaceAll(')', "%29");
    return value;
}

export function equals(name, value) {
    return new SingleExpression("eq", name, encodeValue(value));
}

export function notEquals(name, value) {
    return new SingleExpression("ne", name, encodeValue(value));
}

export function greaterThan(name, value) {
    return new SingleExpression("gt", name, encodeValue(value));
}

export function greaterThanOrEquals(name, value) {
    return new SingleExpression("ge", name, encodeValue(value));
}

export function lessThan(name, value) {
    return new SingleExpression("lt", name, encodeValue(value));
}

export function lessThanOrEquals(name, value) {
    return new SingleExpression("le", name, encodeValue(value));
}

export function startsWith(name, value) {
    return new SingleExpression("sw", name, encodeValue(value));
}

export function endsWith(name, value) {
    return new SingleExpression("ew", name, encodeValue(value));
}

function getArray(value) {
    let result = JSON.stringify(value);
    result = result.replace('[', "%5B");
    result = result.replace(']', "%5D");
    return result;
}

export function notIn(name, value) {
    return new SingleExpression("ni", name, getArray(value));
}

export function isIn(name, value) {
    return new SingleExpression("in", name, getArray(value));
}

export function between(name, valueStart, valueEnd) {
    return new SingleExpression("bt", name, `${encodeValue(valueStart)},${encodeValue(valueEnd)}`);
}

export function contains(name, value) {
    return new SingleExpression("ct", name, encodeValue(value));
}

export function isnull(name) {
    return new SingleExpression("isn", name);
}

export function notnull(name) {
    return new SingleExpression("inn", name);
}

export function desc(name) {
    return new Sort().desc(name);
}

export function asc(name) {
    return new Sort().asc(name);
}

export class SingleExpression {
    _operator;
    _name;
    _value;

    constructor(operator, name, value: any = null) {
        this._operator = operator;
        this._name = name;
        this._value = value;
    }

    build() {
        if (this._operator === "isn" || this._operator === "inn") {
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
        this._fields.push(new SoftField(name, "desc"))
        return this;
    }

    asc(name) {
        this._fields.push(new SoftField(name, "asc"))
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