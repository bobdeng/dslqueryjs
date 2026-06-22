import {describe, it, expect} from "vitest";
import {buildFilter, buildFilterExpression} from "@/buildFilter";
import {equals, contains, greaterThan, isIn} from "@/DslQueryBuilder";

describe('buildFilter test', function () {
    it('should return empty string when form is empty', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {};
        expect(buildFilter(rules, form)).toEqual("");
    });

    it('should build filter with single field', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test))");
    });

    it('should build filter with multiple fields', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => greaterThan("age", value)
        };
        const form = {name: "test", age: "18"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test)(age gt 18))");
    });

    it('should ignore empty string values', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => greaterThan("age", value)
        };
        const form = {name: "", age: "18"};
        expect(buildFilter(rules, form)).toEqual("(and(age gt 18))");
    });

    it('should ignore null values', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => greaterThan("age", value)
        };
        const form = {name: null, age: "18"};
        expect(buildFilter(rules, form)).toEqual("(and(age gt 18))");
    });

    it('should ignore undefined values', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => greaterThan("age", value)
        };
        const form = {name: undefined, age: "18"};
        expect(buildFilter(rules, form)).toEqual("(and(age gt 18))");
    });

    it('should handle boolean false value', function () {
        const rules = {
            active: (value) => equals("active", value)
        };
        const form = {active: false};
        expect(buildFilter(rules, form)).toEqual("(and(active eq false))");
    });

    it('should handle boolean true value', function () {
        const rules = {
            active: (value) => equals("active", value)
        };
        const form = {active: true};
        expect(buildFilter(rules, form)).toEqual("(and(active eq true))");
    });

    it('should ignore empty array', function () {
        const rules = {
            tags: (value) => isIn("tags", value)
        };
        const form = {tags: []};
        expect(buildFilter(rules, form)).toEqual("");
    });

    it('should handle non-empty array', function () {
        const rules = {
            tags: (value) => isIn("tags", value)
        };
        const form = {tags: ["tag1", "tag2"]};
        expect(buildFilter(rules, form)).toEqual("(and(tags in %5B\"tag1\",\"tag2\"%5D))");
    });

    it('should ignore fields not in fields definition', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test", unknownField: "value"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test))");
    });

    it('should support default field', function () {
        const rules = {
            name: (value) => equals("name", value),
            default: (form) => equals("status", "active")
        };
        const form = {name: "test"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test)(status eq active))");
    });

    it('should support default field when form is empty', function () {
        const rules = {
            name: (value) => equals("name", value),
            default: (form) => equals("status", "active")
        };
        const form = {};
        expect(buildFilter(rules, form)).toEqual("(and(status eq active))");
    });

    it('should support extra conditions', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test"};
        const extraCondition = equals("type", "user");
        expect(buildFilter(rules, form, extraCondition)).toEqual("(and(name eq test)(type eq user))");
    });

    it('should support multiple extra conditions', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test"};
        const extra1 = equals("type", "user");
        const extra2 = equals("status", "active");
        expect(buildFilter(rules, form, extra1, extra2)).toEqual("(and(name eq test)(type eq user)(status eq active))");
    });

    it('should filter out falsy extra conditions', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test"};
        const extra1 = equals("type", "user");
        const extra2 = null;
        expect(buildFilter(rules, form, extra1, extra2)).toEqual("(and(name eq test)(type eq user))");
    });

    it('should return extra conditions when form is empty', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {};
        const extraCondition = equals("type", "user");
        expect(buildFilter(rules, form, extraCondition)).toEqual("(and(type eq user))");
    });

    it('should support field function returning array', function () {
        const rules = {
            search: (value) => [
                contains("name", value),
                contains("email", value)
            ]
        };
        const form = {search: "test"};
        expect(buildFilter(rules, form)).toEqual("(and(name ct test)(email ct test))");
    });

    it('should pass form as second parameter to field function', function () {
        const rules = {
            name: (value, form) => {
                if (form.exactMatch) {
                    return equals("name", value);
                }
                return contains("name", value);
            }
        };
        const form = {name: "test", exactMatch: true};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test))");
    });

    it('should filter out undefined returned by rule function', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => {
                if (value > 18) {
                    return greaterThan("age", value);
                }
                return undefined;
            }
        };
        const form = {name: "test", age: "16"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test))");
    });

    it('should still include rule result when rule does not return undefined', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => {
                if (value > 18) {
                    return greaterThan("age", value);
                }
                return undefined;
            }
        };
        const form = {name: "test", age: "20"};
        expect(buildFilter(rules, form)).toEqual("(and(name eq test)(age gt 20))");
    });
});

describe('buildFilterExpression test', function () {
    it('should return undefined when form is empty', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {};
        expect(buildFilterExpression(rules, form)).toBeUndefined();
    });

    it('should return expression object', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {name: "test"};
        const expression = buildFilterExpression(rules, form);
        expect(expression).toBeDefined();
        expect(expression.build()).toEqual("(and(name eq test))");
    });

    it('should return expression with extra conditions when form is empty', function () {
        const rules = {
            name: (value) => equals("name", value)
        };
        const form = {};
        const extraCondition = equals("type", "user");
        const expression = buildFilterExpression(rules, form, extraCondition);
        expect(expression).toBeDefined();
        expect(expression.build()).toEqual("(and(type eq user))");
    });

    it('should filter out undefined returned by rule in expression', function () {
        const rules = {
            name: (value) => equals("name", value),
            age: (value) => {
                if (value > 18) {
                    return greaterThan("age", value);
                }
                return undefined;
            }
        };
        const form = {name: "test", age: "16"};
        const expression = buildFilterExpression(rules, form);
        expect(expression).toBeDefined();
        expect(expression.build()).toEqual("(and(name eq test))");
    });

    it('should return undefined when all rules return undefined', function () {
        const rules = {
            age: (value) => {
                if (value > 18) {
                    return greaterThan("age", value);
                }
                return undefined;
            }
        };
        const form = {age: "16"};
        expect(buildFilterExpression(rules, form)).toBeUndefined();
    });
});
