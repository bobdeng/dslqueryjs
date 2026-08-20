# DSL Query Builder

一个用于构建 DSL（Domain Specific Language）查询语句的 JavaScript 库，提供链式 API 来构建复杂的查询条件、排序和分页。

## 安装

```bash
npm install dslquery
```

## 功能特性

- 🔍 丰富的查询条件构建器（等于、大于、小于、包含等）
- 🔗 支持复杂的逻辑组合（AND/OR）
- 📊 排序功能（升序/降序）
- 📄 分页支持（limit/skip）
- 🎯 链式 API，易于使用
- 🔒 自动 URL 编码，防止特殊字符问题

## 快速开始

```javascript
import { Query, and, equals, greaterThan, asc } from 'dslquery';

// 创建一个查询
const query = new Query()
  .withLimit(20)
  .withSkip(0)
  .withFilter(and(
    equals("status", "active"),
    greaterThan("age", 18)
  ))
  .withSort(asc("name"));

// 获取查询参数
console.log(query.limit);   // 20
console.log(query.skip);    // 0
console.log(query.filter);  // (and(status eq active)(age gt 18))
console.log(query.sort);    // name asc
```

## API 文档

### Query 类

用于管理查询的主类，支持分页、过滤和排序。

#### 方法

- `withLimit(number)` - 设置每页数量（默认：10）
- `withSkip(number)` - 设置跳过的记录数
- `withFilter(expression)` - 设置过滤条件
- `withSort(sort)` - 设置排序规则
- `goto(pageNumber)` - 跳转到指定页码
- `gotoOffset(offset)` - 相对当前页偏移
- `onTotal(total)` - 设置总记录数
- `maxPage` - 获取最大页数

#### 属性

- `limit` - 获取每页数量
- `skip` - 获取跳过的记录数
- `filter` - 获取构建后的过滤条件字符串
- `sort` - 获取构建后的排序字符串

### 过滤条件构建器

#### 比较操作符

```javascript
import { equals, notEquals, greaterThan, greaterThanOrEquals,
         lessThan, lessThanOrEquals } from 'dslquery';

equals("name", "张三")              // (name eq 张三)
notEquals("status", "deleted")     // (status ne deleted)
greaterThan("age", 18)             // (age gt 18)
greaterThanOrEquals("score", 60)   // (score ge 60)
lessThan("price", 100)             // (price lt 100)
lessThanOrEquals("count", 10)      // (count le 10)
```

#### 字符串操作符

```javascript
import { startsWith, endsWith, contains } from 'dslquery';

startsWith("name", "张")    // (name sw 张)
endsWith("email", ".com")   // (email ew .com)
contains("title", "测试")   // (title ct 测试)
```

#### 集合操作符

```javascript
import { isIn, notIn, between } from 'dslquery';

isIn("status", ["active", "pending"])        // (name in %5B"active","pending"%5D)
notIn("role", ["admin", "super"])            // (role ni %5B"admin","super"%5D)
between("age", 18, 65)                       // (age bt 18,65)
```

#### 空值检查

```javascript
import { isnull, notnull, empty, notEmpty } from 'dslquery';

isnull("deletedAt")     // (deletedAt isn)
notnull("email")        // (email inn)
empty("name")           // (name emp) 等于空字符串
notEmpty("name")        // (name nem) 不等于空字符串
```

#### 逻辑组合

```javascript
import { and, or, equals, greaterThan } from 'dslquery';

// AND 组合
and(
  equals("status", "active"),
  greaterThan("age", 18)
)
// 输出: (and(status eq active)(age gt 18))

// OR 组合
or(
  equals("role", "admin"),
  equals("role", "moderator")
)
// 输出: (or(role eq admin)(role eq moderator))

// 嵌套组合
and(
  equals("status", "active"),
  or(
    equals("role", "admin"),
    equals("role", "moderator")
  )
)
// 输出: (and(status eq active)(or(role eq admin)(role eq moderator)))
```

### 排序构建器

```javascript
import { asc, desc } from 'dslquery';

// 单字段排序
asc("name")                    // name asc
desc("createdAt")              // createdAt desc

// 多字段排序
asc("name").desc("age")        // name asc,age desc
desc("priority").asc("name")   // priority desc,name asc
```

## 完整示例

### 基础查询

```javascript
import { Query, and, equals, greaterThan, asc } from 'dslquery';

const query = new Query()
  .withLimit(10)
  .withFilter(and(
    equals("status", "active"),
    greaterThan("age", 18)
  ))
  .withSort(asc("name"));

console.log(query.filter);  // (and(status eq active)(age gt 18))
console.log(query.sort);    // name asc
```

### 分页查询

```javascript
const query = new Query()
  .withLimit(20);

// 跳转到第 5 页
query.goto(5);
console.log(query.skip);  // 80

// 向前翻一页
query.gotoOffset(-1);
console.log(query.skip);  // 60

// 设置总记录数并获取最大页数
query.onTotal(219);
console.log(query.maxPage);  // 11
```

### 复杂查询

```javascript
import { Query, and, or, equals, greaterThan, lessThan,
         contains, isIn, desc } from 'dslquery';

const query = new Query()
  .withLimit(50)
  .withFilter(and(
    equals("status", "active"),
    or(
      and(
        greaterThan("age", 18),
        lessThan("age", 65)
      ),
      equals("vip", true)
    ),
    contains("name", "张"),
    isIn("city", ["北京", "上海", "深圳"])
  ))
  .withSort(desc("createdAt").asc("name"));

console.log(query.filter);
// (and(status eq active)(or(and(age gt 18)(age lt 65))(vip eq true))(name ct 张)(city in %5B"北京","上海","深圳"%5D))

console.log(query.sort);
// createdAt desc,name asc
```

### 特殊字符处理

库会自动对特殊字符进行 URL 编码：

```javascript
import { equals, isIn } from 'dslquery';

equals("name", "test()")           // (name eq test%28%29)
isIn("tags", ["a+b", "c&d"])       // (tags in %5B"a%2Bb","c%26d"%5D)
```

### 表单过滤器构建（buildFilter）

`buildFilter` 是一个实用工具函数，用于根据表单数据和规则自动构建过滤条件，特别适合处理搜索表单。

#### 基本用法

```javascript
import { buildFilter, equals, contains, greaterThan } from 'dslquery';

// 定义过滤规则
// 规则函数接收两个参数：(当前字段值, 整个表单对象)
const rules = {
  name: (value, form) => contains("name", value),
  age: (value, form) => greaterThan("age", value),
  status: (value, form) => equals("status", value)
};

// 表单数据
const form = {
  name: "张三",
  age: "18",
  status: "active"
};

// 构建过滤条件
const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(name ct 张三)(age gt 18)(status eq active))
```

#### 自动过滤空值

`buildFilter` 会自动忽略空值、空字符串、null、undefined 和空数组：

```javascript
const rules = {
  name: (value, form) => equals("name", value),
  age: (value, form) => greaterThan("age", value)
};

const form = {
  name: "",        // 空字符串，会被忽略
  age: "18",
  email: null      // null，会被忽略
};

const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(age gt 18))
```

#### 布尔值处理

布尔值会被正确处理，包括 `false`：

```javascript
const rules = {
  active: (value, form) => equals("active", value)
};

const form = {
  active: false  // false 会被保留
};

const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(active eq false))
```

#### 默认条件

使用 `default` 字段可以添加始终存在的条件：

```javascript
const rules = {
  name: (value) => contains("name", value),
  default: (form) => equals("deletedAt", null)  // 始终添加此条件
};

const form = {
  name: "张三"
};

const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(name ct 张三)(deletedAt eq null))
```

#### 额外条件

可以传入额外的条件表达式：

```javascript
const rules = {
  name: (value, form) => contains("name", value)
};

const form = {
  name: "张三"
};

const extraCondition = equals("tenantId", "123");

const filter = buildFilter(rules, form, extraCondition);
console.log(filter);
// 输出: (and(name ct 张三)(tenantId eq 123))
```

#### 多条件规则

规则函数可以返回数组，用于一个字段生成多个条件：

```javascript
const rules = {
  search: (value, form) => [
    contains("name", value),
    contains("email", value),
    contains("phone", value)
  ]
};

const form = {
  search: "test"
};

const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(name ct test)(email ct test)(phone ct test))
```

#### 访问完整表单数据

规则函数的第二个参数是完整的表单对象，可用于条件判断：

```javascript
const rules = {
  name: (value, form) => {
    // 根据 exactMatch 字段决定使用精确匹配还是模糊匹配
    if (form.exactMatch) {
      return equals("name", value);
    }
    return contains("name", value);
  }
};

const form = {
  name: "张三",
  exactMatch: true
};

const filter = buildFilter(rules, form);
console.log(filter);
// 输出: (and(name eq 张三))
```

#### buildFilterExpression

如果需要获取表达式对象而不是字符串，可以使用 `buildFilterExpression`：

```javascript
import { buildFilterExpression, equals } from 'dslquery';

const rules = {
  name: (value, form) => equals("name", value)
};

const form = {
  name: "test"
};

const expression = buildFilterExpression(rules, form);
console.log(expression.build());  // (and(name eq test))

// 可以与 Query 一起使用
const query = new Query()
  .withFilter(expression)
  .withLimit(10);
```

#### 完整示例：搜索表单

```javascript
import { Query, buildFilter, equals, contains, greaterThan,
         lessThan, isIn, desc } from 'dslquery';

// 定义搜索规则
const searchRules = {
  keyword: (value, form) => [
    contains("name", value),
    contains("description", value)
  ],
  minPrice: (value, form) => greaterThan("price", value),
  maxPrice: (value, form) => lessThan("price", value),
  category: (value, form) => equals("category", value),
  tags: (value, form) => isIn("tags", value),
  default: (form) => equals("status", "active")  // 只显示激活的商品
};

// 用户提交的表单数据
const searchForm = {
  keyword: "手机",
  minPrice: "1000",
  maxPrice: "",      // 空值会被忽略
  category: "电子产品",
  tags: []           // 空数组会被忽略
};

// 额外的租户隔离条件
const tenantCondition = equals("tenantId", "tenant-123");

// 构建查询
const query = new Query()
  .withLimit(20)
  .withFilter(buildFilterExpression(searchRules, searchForm, tenantCondition))
  .withSort(desc("createdAt"));

console.log(query.filter);
// (and(name ct 手机)(description ct 手机)(price gt 1000)(category eq 电子产品)(status eq active)(tenantId eq tenant-123))
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建
npm run build
```

## 测试

项目使用 Vitest 进行测试，测试覆盖了所有主要功能：

- 查询条件构建
- 逻辑组合
- 排序功能
- 分页功能

运行测试：

```bash
npm test
```

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！

## 仓库

[https://github.com/bobdeng/dslqueryjs](https://github.com/bobdeng/dslqueryjs)
