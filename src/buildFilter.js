import {and} from "./DslQueryBuilder";

export function buildFilter(rules, form, ...extraConditions) {
  let expression = buildFilterExpression(rules, form, ...extraConditions);
  if (expression === undefined) {
    return "";
  }
  return expression.build();
}

export function buildFilterExpression(rules, form, ...extraConditions) {
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
    .flat()
    .filter(condition => condition !== undefined);

  if (rules.default) {
    const defaultCondition = rules.default(form);
    if (defaultCondition) {
      conditions.push(defaultCondition);
    }
  }

  if (!extraConditions) {
    extraConditions = [];
  }
  extraConditions = extraConditions.filter(condition => condition)
  if (conditions.length == 0) {
    if (extraConditions.length > 0) {
      return and(...extraConditions);
    }
    return undefined;
  }
  return and(...conditions, ...extraConditions);
}
