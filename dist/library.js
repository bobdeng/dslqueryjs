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
    value = value.replace(/\(/g, "%28");
    value = value.replace(/\)/g, "%29");
    return value;
}

function equals(name, value) {
    return new SingleExpression("eq", name, encodeValue(value));
}

function notEquals(name, value) {
    return new SingleExpression("ne", name, encodeValue(value));
}

function greaterThan(name, value) {
    return new SingleExpression("gt", name, encodeValue(value));
}

function greaterThanOrEquals(name, value) {
    return new SingleExpression("ge", name, encodeValue(value));
}

function lessThan(name, value) {
    return new SingleExpression("lt", name, encodeValue(value));
}

function lessThanOrEquals(name, value) {
    return new SingleExpression("le", name, encodeValue(value));
}

function startsWith(name, value) {
    return new SingleExpression("sw", name, encodeValue(value));
}

function endsWith(name, value) {
    return new SingleExpression("ew", name, encodeValue(value));
}

function getArray(value) {
    let result = JSON.stringify(value.map(it => encodeValue(it)));
    result = result.replace('[', "%5B");
    result = result.replace(']', "%5D");
    return result;
}

function notIn(name, value) {
    return new SingleExpression("ni", name, getArray(value));
}

function isIn(name, value) {
    return new SingleExpression("in", name, getArray(value));
}

function between(name, valueStart, valueEnd) {
    return new SingleExpression("bt", name, `${encodeValue(valueStart)},${encodeValue(valueEnd)}`);
}

function contains(name, value) {
    return new SingleExpression("ct", name, encodeValue(value));
}

function notContains(name, value) {
    return new SingleExpression("nct", name, encodeValue(value));
}

function notStartsWith(name, value) {
    return new SingleExpression("nsw", name, encodeValue(value));
}

function notEndsWith(name, value) {
    return new SingleExpression("new", name, encodeValue(value));
}

function notBetween(name, valueStart, valueEnd) {
    return new SingleExpression("nbt", name, `${encodeValue(valueStart)},${encodeValue(valueEnd)}`);
}

function isnull(name) {
    return new SingleExpression("isn", name);
}

function notnull(name) {
    return new SingleExpression("inn", name);
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
        if (this._operator === "isn" || this._operator === "inn") {
            return `(${this._name} ${this._operator})`
        }
        return `(${this._name} ${this._operator} ${this._value})`
    }

    toJSON() {
        return and(this).build();
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

    toJSON() {
        return this.build();
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

function buildFilter(rules, form, ...extraConditions) {
  let expression = buildFilterExpression(rules, form, ...extraConditions);
  if (expression === undefined) {
    return "";
  }
  return expression.build();
}

function buildFilterExpression(rules, form, ...extraConditions) {
  function hasAnyValue(key) {
    if (typeof form[key] === "boolean") {
      return form[key] !== undefined;
    }
    if (typeof form[key] === "string") {
      return form[key] !== undefined && form[key] !== "" && form[key] !== null;
    }
    return (!Array.isArray(form[key]) && form[key]) || (Array.isArray(form[key]) && form[key].length > 0);
  }

  let conditions = Object.keys(form)
    .filter(key => hasAnyValue(key))
    .filter(key => rules[key])
    .map(key => {
      return rules[key](form[key], form);
    })
    .flat();

  if (rules.default) {
    const defaultCondition = rules.default(form);
    if (defaultCondition) {
      conditions.push(defaultCondition);
    }
  }

  if (!extraConditions) {
    extraConditions = [];
  }
  extraConditions = extraConditions.filter(condition => condition);
  if (conditions.length == 0) {
    if (extraConditions.length > 0) {
      return and(...extraConditions);
    }
    return undefined;
  }
  return and(...conditions, ...extraConditions);
}

export { Query, SingleExpression, and, asc, between, buildFilter, buildFilterExpression, contains, desc, endsWith, equals, greaterThan, greaterThanOrEquals, isIn, isnull, lessThan, lessThanOrEquals, notBetween, notContains, notEndsWith, notEquals, notIn, notStartsWith, notnull, or, startsWith };
