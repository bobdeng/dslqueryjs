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
import { isnull, notnull } from 'dslquery';

isnull("deletedAt")     // (deletedAt isn)
notnull("email")        // (email inn)
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
