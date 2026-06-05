---
title: TypeScript 深入
---

# TypeScript 深入

TypeScript 是 JavaScript 的超集，添加了静态类型系统，在编译时捕获错误，提升代码质量和开发效率。

## 基础类型

```typescript
// 基本类型
let name: string = '张三';
let age: number = 25;
let isActive: boolean = true;
let empty: null = null;
let notDefined: undefined = undefined;

// 数组
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// 元组
let tuple: [string, number] = ['张三', 25];

// 枚举
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}
let color: Color = Color.Red;

// any - 任意类型（尽量避免）
let data: any = 'hello';
data = 42; // ✅ 但失去了类型保护

// unknown - 安全的 any
let input: unknown = 'hello';
// input.toFixed(); // ❌ 不能直接使用
if (typeof input === 'number') {
  input.toFixed(); // ✅ 类型缩小后使用
}

// void - 无返回值
function log(msg: string): void {
  console.log(msg);
}

// never - 永远不会有返回值
function throwError(msg: string): never {
  throw new Error(msg);
}
```

## 接口与类型别名

```typescript
// 接口
interface User {
  id: number;
  name: string;
  age?: number;           // 可选属性
  readonly email: string;  // 只读属性
  [key: string]: any;      // 索引签名
}

// 类型别名
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 函数类型
interface SearchFunc {
  (source: string, term: string): boolean;
}
const search: SearchFunc = (src, term) => src.includes(term);

// 接口继承
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// 接口 vs type
// interface：可声明合并、可继承
// type：更灵活（联合类型、交叉类型、条件类型）
```

## 泛型

```typescript
// 基本泛型
function identity<T>(value: T): T {
  return value;
}
identity<string>('hello');
identity(42); // 自动推断

// 多个泛型
function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}

// 泛型约束
interface HasLength {
  length: number;
}
function logLength<T extends HasLength>(value: T): T {
  console.log(value.length);
  return value;
}
logLength('hello');  // ✅
logLength([1, 2, 3]); // ✅
// logLength(123);    // ❌ number 没有 length

// 泛型接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
const userRes: ApiResponse<User> = {
  code: 200,
  message: 'success',
  data: { id: 1, name: '张三', email: 'zhang@example.com' },
};

// 泛型工具
class DataStore<T> {
  private items: T[] = [];
  add(item: T): void { this.items.push(item); }
  get(index: number): T | undefined { return this.items[index]; }
  getAll(): T[] { return [...this.items]; }
}
```

## 工具类型

```typescript
// Partial - 所有属性变为可选
type PartialUser = Partial<User>;

// Required - 所有属性变为必填
type RequiredUser = Required<User>;

// Readonly - 所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Pick - 选取部分属性
type UserBasic = Pick<User, 'id' | 'name'>;

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>;

// Record - 构造键值对类型
type UserMap = Record<string, User>;

// Exclude - 从联合类型中排除
type StatusWithoutPending = Exclude<Status, 'pending'>; // 'active' | 'inactive'

// Extract - 从联合类型中提取
type ActiveStatus = Extract<Status, 'active' | 'inactive'>;

// ReturnType - 获取函数返回值类型
function getUser() { return { id: 1, name: '张三' }; }
type UserType = ReturnType<typeof getUser>;

// Parameters - 获取函数参数类型
type UserParams = Parameters<typeof getUser>;

// NonNullable - 排除 null 和 undefined
type NonNullValue = NonNullable<string | null | undefined>;
```

## 条件类型

```typescript
// 基本条件类型
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// infer 关键字 - 在条件类型中推断类型
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnpackPromise<Promise<string>>; // string

// 递归条件类型
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};
```

## 类型守卫

```typescript
// typeof
function double(value: string | number) {
  if (typeof value === 'number') {
    return value * 2; // 这里 value 是 number
  }
  return value.repeat(2); // 这里 value 是 string
}

// instanceof
function processDate(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(value).toISOString();
}

// in 操作符
interface Fish { swim(): void }
interface Bird { fly(): void }
function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// 自定义类型守卫
interface Dog { bark(): void }
interface Cat { meow(): void }
function isDog(animal: Dog | Cat): animal is Dog {
  return 'bark' in animal;
}
```

## 声明文件

```typescript
// 为第三方库编写声明
// declarations/jquery.d.ts
declare module 'jquery' {
  function $(selector: string): HTMLElement;
  export default $;
}

// 全局声明
declare global {
  interface Window {
    myApp: {
      version: string;
      init(): void;
    };
  }
}

// 环境声明
declare const __DEV__: boolean;
declare const __VERSION__: string;
```

## 实用技巧

```typescript
// 1. 满足类型检查的 exhaustiveness check
type Shape = 'circle' | 'square';
function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle': return Math.PI;
    case 'square': return 1;
    default:
      const _exhaustive: never = shape; // 如果遗漏 case 会报错
      return _exhaustive;
  }
}

// 2. 品牌类型（防止类型混用）
type UserId = string & { __brand: 'UserId' };
type OrderId = string & { __brand: 'OrderId' };
function getUser(id: UserId) {}
const userId = '123' as UserId;
// getUser('123' as OrderId); // ❌ 类型不兼容

// 3. 严格函数类型
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
interface RequestOptions {
  method: Method;
  url: string;
  data?: unknown;
}
async function request<T>(options: RequestOptions): Promise<T> {
  const res = await fetch(options.url, {
    method: options.method,
    body: options.data ? JSON.stringify(options.data) : undefined,
  });
  return res.json() as Promise<T>;
}
```

## 下一步

- ⚡ [性能优化](/frontend/advanced/senior/performance) - 性能优化策略
- 🏗️ [设计模式](/frontend/advanced/senior/design-patterns) - 前端设计模式
- 🔒 [前端安全](/frontend/advanced/senior/security) - 安全防护实践
