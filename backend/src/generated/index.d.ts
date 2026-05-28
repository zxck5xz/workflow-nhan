
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Member
 * 
 */
export type Member = $Result.DefaultSelection<Prisma.$MemberPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model StatusConfig
 * 
 */
export type StatusConfig = $Result.DefaultSelection<Prisma.$StatusConfigPayload>
/**
 * Model PriorityConfig
 * 
 */
export type PriorityConfig = $Result.DefaultSelection<Prisma.$PriorityConfigPayload>
/**
 * Model GameScorecard
 * 
 */
export type GameScorecard = $Result.DefaultSelection<Prisma.$GameScorecardPayload>
/**
 * Model WeeklyInsight
 * 
 */
export type WeeklyInsight = $Result.DefaultSelection<Prisma.$WeeklyInsightPayload>
/**
 * Model Snapshot
 * 
 */
export type Snapshot = $Result.DefaultSelection<Prisma.$SnapshotPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TaskStatus: {
  backlog: 'backlog',
  in_testing: 'in_testing',
  evaluating: 'evaluating',
  reporting: 'reporting',
  done: 'done'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const Role: {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TESTER: 'TESTER',
  VIEWER: 'VIEWER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Priority: {
  P0: 'P0',
  P1: 'P1',
  P2: 'P2'
};

export type Priority = (typeof Priority)[keyof typeof Priority]

}

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Priority = $Enums.Priority

export const Priority: typeof $Enums.Priority

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Projects
 * const projects = await prisma.project.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.member`: Exposes CRUD operations for the **Member** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Members
    * const members = await prisma.member.findMany()
    * ```
    */
  get member(): Prisma.MemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.statusConfig`: Exposes CRUD operations for the **StatusConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StatusConfigs
    * const statusConfigs = await prisma.statusConfig.findMany()
    * ```
    */
  get statusConfig(): Prisma.StatusConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priorityConfig`: Exposes CRUD operations for the **PriorityConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriorityConfigs
    * const priorityConfigs = await prisma.priorityConfig.findMany()
    * ```
    */
  get priorityConfig(): Prisma.PriorityConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameScorecard`: Exposes CRUD operations for the **GameScorecard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameScorecards
    * const gameScorecards = await prisma.gameScorecard.findMany()
    * ```
    */
  get gameScorecard(): Prisma.GameScorecardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weeklyInsight`: Exposes CRUD operations for the **WeeklyInsight** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeeklyInsights
    * const weeklyInsights = await prisma.weeklyInsight.findMany()
    * ```
    */
  get weeklyInsight(): Prisma.WeeklyInsightDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snapshot`: Exposes CRUD operations for the **Snapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Snapshots
    * const snapshots = await prisma.snapshot.findMany()
    * ```
    */
  get snapshot(): Prisma.SnapshotDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Project: 'Project',
    Member: 'Member',
    Task: 'Task',
    StatusConfig: 'StatusConfig',
    PriorityConfig: 'PriorityConfig',
    GameScorecard: 'GameScorecard',
    WeeklyInsight: 'WeeklyInsight',
    Snapshot: 'Snapshot'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "project" | "member" | "task" | "statusConfig" | "priorityConfig" | "gameScorecard" | "weeklyInsight" | "snapshot"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Member: {
        payload: Prisma.$MemberPayload<ExtArgs>
        fields: Prisma.MemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findFirst: {
            args: Prisma.MemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findMany: {
            args: Prisma.MemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          create: {
            args: Prisma.MemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          createMany: {
            args: Prisma.MemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          delete: {
            args: Prisma.MemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          update: {
            args: Prisma.MemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          deleteMany: {
            args: Prisma.MemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          upsert: {
            args: Prisma.MemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          aggregate: {
            args: Prisma.MemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMember>
          }
          groupBy: {
            args: Prisma.MemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemberCountArgs<ExtArgs>
            result: $Utils.Optional<MemberCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      StatusConfig: {
        payload: Prisma.$StatusConfigPayload<ExtArgs>
        fields: Prisma.StatusConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StatusConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StatusConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          findFirst: {
            args: Prisma.StatusConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StatusConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          findMany: {
            args: Prisma.StatusConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>[]
          }
          create: {
            args: Prisma.StatusConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          createMany: {
            args: Prisma.StatusConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StatusConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>[]
          }
          delete: {
            args: Prisma.StatusConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          update: {
            args: Prisma.StatusConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          deleteMany: {
            args: Prisma.StatusConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StatusConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StatusConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>[]
          }
          upsert: {
            args: Prisma.StatusConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusConfigPayload>
          }
          aggregate: {
            args: Prisma.StatusConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStatusConfig>
          }
          groupBy: {
            args: Prisma.StatusConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<StatusConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.StatusConfigCountArgs<ExtArgs>
            result: $Utils.Optional<StatusConfigCountAggregateOutputType> | number
          }
        }
      }
      PriorityConfig: {
        payload: Prisma.$PriorityConfigPayload<ExtArgs>
        fields: Prisma.PriorityConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriorityConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriorityConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          findFirst: {
            args: Prisma.PriorityConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriorityConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          findMany: {
            args: Prisma.PriorityConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>[]
          }
          create: {
            args: Prisma.PriorityConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          createMany: {
            args: Prisma.PriorityConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriorityConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>[]
          }
          delete: {
            args: Prisma.PriorityConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          update: {
            args: Prisma.PriorityConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          deleteMany: {
            args: Prisma.PriorityConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriorityConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriorityConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>[]
          }
          upsert: {
            args: Prisma.PriorityConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorityConfigPayload>
          }
          aggregate: {
            args: Prisma.PriorityConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriorityConfig>
          }
          groupBy: {
            args: Prisma.PriorityConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriorityConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriorityConfigCountArgs<ExtArgs>
            result: $Utils.Optional<PriorityConfigCountAggregateOutputType> | number
          }
        }
      }
      GameScorecard: {
        payload: Prisma.$GameScorecardPayload<ExtArgs>
        fields: Prisma.GameScorecardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameScorecardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameScorecardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          findFirst: {
            args: Prisma.GameScorecardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameScorecardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          findMany: {
            args: Prisma.GameScorecardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>[]
          }
          create: {
            args: Prisma.GameScorecardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          createMany: {
            args: Prisma.GameScorecardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameScorecardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>[]
          }
          delete: {
            args: Prisma.GameScorecardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          update: {
            args: Prisma.GameScorecardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          deleteMany: {
            args: Prisma.GameScorecardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameScorecardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameScorecardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>[]
          }
          upsert: {
            args: Prisma.GameScorecardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorecardPayload>
          }
          aggregate: {
            args: Prisma.GameScorecardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameScorecard>
          }
          groupBy: {
            args: Prisma.GameScorecardGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameScorecardGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameScorecardCountArgs<ExtArgs>
            result: $Utils.Optional<GameScorecardCountAggregateOutputType> | number
          }
        }
      }
      WeeklyInsight: {
        payload: Prisma.$WeeklyInsightPayload<ExtArgs>
        fields: Prisma.WeeklyInsightFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeeklyInsightFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeeklyInsightFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          findFirst: {
            args: Prisma.WeeklyInsightFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeeklyInsightFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          findMany: {
            args: Prisma.WeeklyInsightFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>[]
          }
          create: {
            args: Prisma.WeeklyInsightCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          createMany: {
            args: Prisma.WeeklyInsightCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeeklyInsightCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>[]
          }
          delete: {
            args: Prisma.WeeklyInsightDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          update: {
            args: Prisma.WeeklyInsightUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          deleteMany: {
            args: Prisma.WeeklyInsightDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeeklyInsightUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeeklyInsightUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>[]
          }
          upsert: {
            args: Prisma.WeeklyInsightUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeeklyInsightPayload>
          }
          aggregate: {
            args: Prisma.WeeklyInsightAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeeklyInsight>
          }
          groupBy: {
            args: Prisma.WeeklyInsightGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeeklyInsightGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeeklyInsightCountArgs<ExtArgs>
            result: $Utils.Optional<WeeklyInsightCountAggregateOutputType> | number
          }
        }
      }
      Snapshot: {
        payload: Prisma.$SnapshotPayload<ExtArgs>
        fields: Prisma.SnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findFirst: {
            args: Prisma.SnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findMany: {
            args: Prisma.SnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          create: {
            args: Prisma.SnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          createMany: {
            args: Prisma.SnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          delete: {
            args: Prisma.SnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          update: {
            args: Prisma.SnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          upsert: {
            args: Prisma.SnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          aggregate: {
            args: Prisma.SnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapshot>
          }
          groupBy: {
            args: Prisma.SnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SnapshotCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    project?: ProjectOmit
    member?: MemberOmit
    task?: TaskOmit
    statusConfig?: StatusConfigOmit
    priorityConfig?: PriorityConfigOmit
    gameScorecard?: GameScorecardOmit
    weeklyInsight?: WeeklyInsightOmit
    snapshot?: SnapshotOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    tasks: number
    scorecards: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | ProjectCountOutputTypeCountTasksArgs
    scorecards?: boolean | ProjectCountOutputTypeCountScorecardsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountScorecardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScorecardWhereInput
  }


  /**
   * Count Type MemberCountOutputType
   */

  export type MemberCountOutputType = {
    tasks: number
    scorecards: number
    insights: number
  }

  export type MemberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | MemberCountOutputTypeCountTasksArgs
    scorecards?: boolean | MemberCountOutputTypeCountScorecardsArgs
    insights?: boolean | MemberCountOutputTypeCountInsightsArgs
  }

  // Custom InputTypes
  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberCountOutputType
     */
    select?: MemberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountScorecardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScorecardWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountInsightsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeeklyInsightWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    platform: string | null
    genre: string | null
    status: string | null
    color: string | null
    createdAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    platform: string | null
    genre: string | null
    status: string | null
    color: string | null
    createdAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    platform: number
    genre: number
    status: number
    color: number
    createdAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    platform?: true
    genre?: true
    status?: true
    color?: true
    createdAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    platform?: true
    genre?: true
    status?: true
    color?: true
    createdAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    platform?: true
    genre?: true
    status?: true
    color?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    platform?: boolean
    genre?: boolean
    status?: boolean
    color?: boolean
    createdAt?: boolean
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    scorecards?: boolean | Project$scorecardsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    platform?: boolean
    genre?: boolean
    status?: boolean
    color?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    platform?: boolean
    genre?: boolean
    status?: boolean
    color?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    platform?: boolean
    genre?: boolean
    status?: boolean
    color?: boolean
    createdAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "platform" | "genre" | "status" | "color" | "createdAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    scorecards?: boolean | Project$scorecardsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      scorecards: Prisma.$GameScorecardPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      platform: string
      genre: string
      status: string
      color: string
      createdAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends Project$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Project$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scorecards<T extends Project$scorecardsArgs<ExtArgs> = {}>(args?: Subset<T, Project$scorecardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly platform: FieldRef<"Project", 'String'>
    readonly genre: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'String'>
    readonly color: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.tasks
   */
  export type Project$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Project.scorecards
   */
  export type Project$scorecardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    where?: GameScorecardWhereInput
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    cursor?: GameScorecardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScorecardScalarFieldEnum | GameScorecardScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Member
   */

  export type AggregateMember = {
    _count: MemberCountAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  export type MemberMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    avatarColor: string | null
    initials: string | null
    joinedAt: Date | null
    password: string | null
  }

  export type MemberMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    avatarColor: string | null
    initials: string | null
    joinedAt: Date | null
    password: string | null
  }

  export type MemberCountAggregateOutputType = {
    id: number
    name: number
    email: number
    role: number
    avatarColor: number
    initials: number
    joinedAt: number
    password: number
    _all: number
  }


  export type MemberMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    avatarColor?: true
    initials?: true
    joinedAt?: true
    password?: true
  }

  export type MemberMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    avatarColor?: true
    initials?: true
    joinedAt?: true
    password?: true
  }

  export type MemberCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    avatarColor?: true
    initials?: true
    joinedAt?: true
    password?: true
    _all?: true
  }

  export type MemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Member to aggregate.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Members
    **/
    _count?: true | MemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemberMaxAggregateInputType
  }

  export type GetMemberAggregateType<T extends MemberAggregateArgs> = {
        [P in keyof T & keyof AggregateMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMember[P]>
      : GetScalarType<T[P], AggregateMember[P]>
  }




  export type MemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithAggregationInput | MemberOrderByWithAggregationInput[]
    by: MemberScalarFieldEnum[] | MemberScalarFieldEnum
    having?: MemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemberCountAggregateInputType | true
    _min?: MemberMinAggregateInputType
    _max?: MemberMaxAggregateInputType
  }

  export type MemberGroupByOutputType = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date
    password: string
    _count: MemberCountAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  type GetMemberGroupByPayload<T extends MemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemberGroupByOutputType[P]>
            : GetScalarType<T[P], MemberGroupByOutputType[P]>
        }
      >
    >


  export type MemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    avatarColor?: boolean
    initials?: boolean
    joinedAt?: boolean
    password?: boolean
    tasks?: boolean | Member$tasksArgs<ExtArgs>
    scorecards?: boolean | Member$scorecardsArgs<ExtArgs>
    insights?: boolean | Member$insightsArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["member"]>

  export type MemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    avatarColor?: boolean
    initials?: boolean
    joinedAt?: boolean
    password?: boolean
  }, ExtArgs["result"]["member"]>

  export type MemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    avatarColor?: boolean
    initials?: boolean
    joinedAt?: boolean
    password?: boolean
  }, ExtArgs["result"]["member"]>

  export type MemberSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    avatarColor?: boolean
    initials?: boolean
    joinedAt?: boolean
    password?: boolean
  }

  export type MemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "role" | "avatarColor" | "initials" | "joinedAt" | "password", ExtArgs["result"]["member"]>
  export type MemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | Member$tasksArgs<ExtArgs>
    scorecards?: boolean | Member$scorecardsArgs<ExtArgs>
    insights?: boolean | Member$insightsArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Member"
    objects: {
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      scorecards: Prisma.$GameScorecardPayload<ExtArgs>[]
      insights: Prisma.$WeeklyInsightPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      role: string
      avatarColor: string
      initials: string
      joinedAt: Date
      password: string
    }, ExtArgs["result"]["member"]>
    composites: {}
  }

  type MemberGetPayload<S extends boolean | null | undefined | MemberDefaultArgs> = $Result.GetResult<Prisma.$MemberPayload, S>

  type MemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemberCountAggregateInputType | true
    }

  export interface MemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Member'], meta: { name: 'Member' } }
    /**
     * Find zero or one Member that matches the filter.
     * @param {MemberFindUniqueArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemberFindUniqueArgs>(args: SelectSubset<T, MemberFindUniqueArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Member that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemberFindUniqueOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemberFindUniqueOrThrowArgs>(args: SelectSubset<T, MemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemberFindFirstArgs>(args?: SelectSubset<T, MemberFindFirstArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemberFindFirstOrThrowArgs>(args?: SelectSubset<T, MemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Members
     * const members = await prisma.member.findMany()
     * 
     * // Get first 10 Members
     * const members = await prisma.member.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memberWithIdOnly = await prisma.member.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemberFindManyArgs>(args?: SelectSubset<T, MemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Member.
     * @param {MemberCreateArgs} args - Arguments to create a Member.
     * @example
     * // Create one Member
     * const Member = await prisma.member.create({
     *   data: {
     *     // ... data to create a Member
     *   }
     * })
     * 
     */
    create<T extends MemberCreateArgs>(args: SelectSubset<T, MemberCreateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Members.
     * @param {MemberCreateManyArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemberCreateManyArgs>(args?: SelectSubset<T, MemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Members and returns the data saved in the database.
     * @param {MemberCreateManyAndReturnArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemberCreateManyAndReturnArgs>(args?: SelectSubset<T, MemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Member.
     * @param {MemberDeleteArgs} args - Arguments to delete one Member.
     * @example
     * // Delete one Member
     * const Member = await prisma.member.delete({
     *   where: {
     *     // ... filter to delete one Member
     *   }
     * })
     * 
     */
    delete<T extends MemberDeleteArgs>(args: SelectSubset<T, MemberDeleteArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Member.
     * @param {MemberUpdateArgs} args - Arguments to update one Member.
     * @example
     * // Update one Member
     * const member = await prisma.member.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemberUpdateArgs>(args: SelectSubset<T, MemberUpdateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Members.
     * @param {MemberDeleteManyArgs} args - Arguments to filter Members to delete.
     * @example
     * // Delete a few Members
     * const { count } = await prisma.member.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemberDeleteManyArgs>(args?: SelectSubset<T, MemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemberUpdateManyArgs>(args: SelectSubset<T, MemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members and returns the data updated in the database.
     * @param {MemberUpdateManyAndReturnArgs} args - Arguments to update many Members.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemberUpdateManyAndReturnArgs>(args: SelectSubset<T, MemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Member.
     * @param {MemberUpsertArgs} args - Arguments to update or create a Member.
     * @example
     * // Update or create a Member
     * const member = await prisma.member.upsert({
     *   create: {
     *     // ... data to create a Member
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Member we want to update
     *   }
     * })
     */
    upsert<T extends MemberUpsertArgs>(args: SelectSubset<T, MemberUpsertArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberCountArgs} args - Arguments to filter Members to count.
     * @example
     * // Count the number of Members
     * const count = await prisma.member.count({
     *   where: {
     *     // ... the filter for the Members we want to count
     *   }
     * })
    **/
    count<T extends MemberCountArgs>(
      args?: Subset<T, MemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemberAggregateArgs>(args: Subset<T, MemberAggregateArgs>): Prisma.PrismaPromise<GetMemberAggregateType<T>>

    /**
     * Group by Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemberGroupByArgs['orderBy'] }
        : { orderBy?: MemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Member model
   */
  readonly fields: MemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Member.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends Member$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Member$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scorecards<T extends Member$scorecardsArgs<ExtArgs> = {}>(args?: Subset<T, Member$scorecardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    insights<T extends Member$insightsArgs<ExtArgs> = {}>(args?: Subset<T, Member$insightsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Member model
   */
  interface MemberFieldRefs {
    readonly id: FieldRef<"Member", 'String'>
    readonly name: FieldRef<"Member", 'String'>
    readonly email: FieldRef<"Member", 'String'>
    readonly role: FieldRef<"Member", 'String'>
    readonly avatarColor: FieldRef<"Member", 'String'>
    readonly initials: FieldRef<"Member", 'String'>
    readonly joinedAt: FieldRef<"Member", 'DateTime'>
    readonly password: FieldRef<"Member", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Member findUnique
   */
  export type MemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findUniqueOrThrow
   */
  export type MemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findFirst
   */
  export type MemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findFirstOrThrow
   */
  export type MemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findMany
   */
  export type MemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member create
   */
  export type MemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to create a Member.
     */
    data: XOR<MemberCreateInput, MemberUncheckedCreateInput>
  }

  /**
   * Member createMany
   */
  export type MemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Member createManyAndReturn
   */
  export type MemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Member update
   */
  export type MemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to update a Member.
     */
    data: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
    /**
     * Choose, which Member to update.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member updateMany
   */
  export type MemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Member updateManyAndReturn
   */
  export type MemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Member upsert
   */
  export type MemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The filter to search for the Member to update in case it exists.
     */
    where: MemberWhereUniqueInput
    /**
     * In case the Member found by the `where` argument doesn't exist, create a new Member with this data.
     */
    create: XOR<MemberCreateInput, MemberUncheckedCreateInput>
    /**
     * In case the Member was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
  }

  /**
   * Member delete
   */
  export type MemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter which Member to delete.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member deleteMany
   */
  export type MemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Members to delete
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to delete.
     */
    limit?: number
  }

  /**
   * Member.tasks
   */
  export type Member$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Member.scorecards
   */
  export type Member$scorecardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    where?: GameScorecardWhereInput
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    cursor?: GameScorecardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScorecardScalarFieldEnum | GameScorecardScalarFieldEnum[]
  }

  /**
   * Member.insights
   */
  export type Member$insightsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    where?: WeeklyInsightWhereInput
    orderBy?: WeeklyInsightOrderByWithRelationInput | WeeklyInsightOrderByWithRelationInput[]
    cursor?: WeeklyInsightWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeeklyInsightScalarFieldEnum | WeeklyInsightScalarFieldEnum[]
  }

  /**
   * Member without action
   */
  export type MemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    weight: number | null
  }

  export type TaskSumAggregateOutputType = {
    weight: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    projectId: string | null
    assigneeId: string | null
    status: $Enums.TaskStatus | null
    priority: $Enums.Priority | null
    weight: number | null
    deadline: Date | null
    createdAt: Date | null
    completedAt: Date | null
    eisenhowerUrgent: boolean | null
    eisenhowerImportant: boolean | null
    eisenhowerAutoClassified: boolean | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    projectId: string | null
    assigneeId: string | null
    status: $Enums.TaskStatus | null
    priority: $Enums.Priority | null
    weight: number | null
    deadline: Date | null
    createdAt: Date | null
    completedAt: Date | null
    eisenhowerUrgent: boolean | null
    eisenhowerImportant: boolean | null
    eisenhowerAutoClassified: boolean | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    projectId: number
    assigneeId: number
    status: number
    priority: number
    weight: number
    deadline: number
    createdAt: number
    completedAt: number
    eisenhowerUrgent: number
    eisenhowerImportant: number
    eisenhowerAutoClassified: number
    tags: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    weight?: true
  }

  export type TaskSumAggregateInputType = {
    weight?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    projectId?: true
    assigneeId?: true
    status?: true
    priority?: true
    weight?: true
    deadline?: true
    createdAt?: true
    completedAt?: true
    eisenhowerUrgent?: true
    eisenhowerImportant?: true
    eisenhowerAutoClassified?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    projectId?: true
    assigneeId?: true
    status?: true
    priority?: true
    weight?: true
    deadline?: true
    createdAt?: true
    completedAt?: true
    eisenhowerUrgent?: true
    eisenhowerImportant?: true
    eisenhowerAutoClassified?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    projectId?: true
    assigneeId?: true
    status?: true
    priority?: true
    weight?: true
    deadline?: true
    createdAt?: true
    completedAt?: true
    eisenhowerUrgent?: true
    eisenhowerImportant?: true
    eisenhowerAutoClassified?: true
    tags?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string
    projectId: string
    assigneeId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline: Date | null
    createdAt: Date
    completedAt: Date | null
    eisenhowerUrgent: boolean
    eisenhowerImportant: boolean
    eisenhowerAutoClassified: boolean
    tags: JsonValue | null
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    projectId?: boolean
    assigneeId?: boolean
    status?: boolean
    priority?: boolean
    weight?: boolean
    deadline?: boolean
    createdAt?: boolean
    completedAt?: boolean
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    projectId?: boolean
    assigneeId?: boolean
    status?: boolean
    priority?: boolean
    weight?: boolean
    deadline?: boolean
    createdAt?: boolean
    completedAt?: boolean
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    projectId?: boolean
    assigneeId?: boolean
    status?: boolean
    priority?: boolean
    weight?: boolean
    deadline?: boolean
    createdAt?: boolean
    completedAt?: boolean
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    projectId?: boolean
    assigneeId?: boolean
    status?: boolean
    priority?: boolean
    weight?: boolean
    deadline?: boolean
    createdAt?: boolean
    completedAt?: boolean
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "projectId" | "assigneeId" | "status" | "priority" | "weight" | "deadline" | "createdAt" | "completedAt" | "eisenhowerUrgent" | "eisenhowerImportant" | "eisenhowerAutoClassified" | "tags", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    assignee?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      assignee: Prisma.$MemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      projectId: string
      assigneeId: string
      status: $Enums.TaskStatus
      priority: $Enums.Priority
      weight: number
      deadline: Date | null
      createdAt: Date
      completedAt: Date | null
      eisenhowerUrgent: boolean
      eisenhowerImportant: boolean
      eisenhowerAutoClassified: boolean
      tags: Prisma.JsonValue | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignee<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly projectId: FieldRef<"Task", 'String'>
    readonly assigneeId: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly priority: FieldRef<"Task", 'Priority'>
    readonly weight: FieldRef<"Task", 'Int'>
    readonly deadline: FieldRef<"Task", 'DateTime'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly completedAt: FieldRef<"Task", 'DateTime'>
    readonly eisenhowerUrgent: FieldRef<"Task", 'Boolean'>
    readonly eisenhowerImportant: FieldRef<"Task", 'Boolean'>
    readonly eisenhowerAutoClassified: FieldRef<"Task", 'Boolean'>
    readonly tags: FieldRef<"Task", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model StatusConfig
   */

  export type AggregateStatusConfig = {
    _count: StatusConfigCountAggregateOutputType | null
    _avg: StatusConfigAvgAggregateOutputType | null
    _sum: StatusConfigSumAggregateOutputType | null
    _min: StatusConfigMinAggregateOutputType | null
    _max: StatusConfigMaxAggregateOutputType | null
  }

  export type StatusConfigAvgAggregateOutputType = {
    order: number | null
  }

  export type StatusConfigSumAggregateOutputType = {
    order: number | null
  }

  export type StatusConfigMinAggregateOutputType = {
    id: $Enums.TaskStatus | null
    label: string | null
    color: string | null
    order: number | null
  }

  export type StatusConfigMaxAggregateOutputType = {
    id: $Enums.TaskStatus | null
    label: string | null
    color: string | null
    order: number | null
  }

  export type StatusConfigCountAggregateOutputType = {
    id: number
    label: number
    color: number
    order: number
    _all: number
  }


  export type StatusConfigAvgAggregateInputType = {
    order?: true
  }

  export type StatusConfigSumAggregateInputType = {
    order?: true
  }

  export type StatusConfigMinAggregateInputType = {
    id?: true
    label?: true
    color?: true
    order?: true
  }

  export type StatusConfigMaxAggregateInputType = {
    id?: true
    label?: true
    color?: true
    order?: true
  }

  export type StatusConfigCountAggregateInputType = {
    id?: true
    label?: true
    color?: true
    order?: true
    _all?: true
  }

  export type StatusConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusConfig to aggregate.
     */
    where?: StatusConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusConfigs to fetch.
     */
    orderBy?: StatusConfigOrderByWithRelationInput | StatusConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StatusConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StatusConfigs
    **/
    _count?: true | StatusConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StatusConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StatusConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StatusConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StatusConfigMaxAggregateInputType
  }

  export type GetStatusConfigAggregateType<T extends StatusConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateStatusConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStatusConfig[P]>
      : GetScalarType<T[P], AggregateStatusConfig[P]>
  }




  export type StatusConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatusConfigWhereInput
    orderBy?: StatusConfigOrderByWithAggregationInput | StatusConfigOrderByWithAggregationInput[]
    by: StatusConfigScalarFieldEnum[] | StatusConfigScalarFieldEnum
    having?: StatusConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StatusConfigCountAggregateInputType | true
    _avg?: StatusConfigAvgAggregateInputType
    _sum?: StatusConfigSumAggregateInputType
    _min?: StatusConfigMinAggregateInputType
    _max?: StatusConfigMaxAggregateInputType
  }

  export type StatusConfigGroupByOutputType = {
    id: $Enums.TaskStatus
    label: string
    color: string
    order: number
    _count: StatusConfigCountAggregateOutputType | null
    _avg: StatusConfigAvgAggregateOutputType | null
    _sum: StatusConfigSumAggregateOutputType | null
    _min: StatusConfigMinAggregateOutputType | null
    _max: StatusConfigMaxAggregateOutputType | null
  }

  type GetStatusConfigGroupByPayload<T extends StatusConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StatusConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StatusConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StatusConfigGroupByOutputType[P]>
            : GetScalarType<T[P], StatusConfigGroupByOutputType[P]>
        }
      >
    >


  export type StatusConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    order?: boolean
  }, ExtArgs["result"]["statusConfig"]>

  export type StatusConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    order?: boolean
  }, ExtArgs["result"]["statusConfig"]>

  export type StatusConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    order?: boolean
  }, ExtArgs["result"]["statusConfig"]>

  export type StatusConfigSelectScalar = {
    id?: boolean
    label?: boolean
    color?: boolean
    order?: boolean
  }

  export type StatusConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "color" | "order", ExtArgs["result"]["statusConfig"]>

  export type $StatusConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StatusConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: $Enums.TaskStatus
      label: string
      color: string
      order: number
    }, ExtArgs["result"]["statusConfig"]>
    composites: {}
  }

  type StatusConfigGetPayload<S extends boolean | null | undefined | StatusConfigDefaultArgs> = $Result.GetResult<Prisma.$StatusConfigPayload, S>

  type StatusConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StatusConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StatusConfigCountAggregateInputType | true
    }

  export interface StatusConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StatusConfig'], meta: { name: 'StatusConfig' } }
    /**
     * Find zero or one StatusConfig that matches the filter.
     * @param {StatusConfigFindUniqueArgs} args - Arguments to find a StatusConfig
     * @example
     * // Get one StatusConfig
     * const statusConfig = await prisma.statusConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StatusConfigFindUniqueArgs>(args: SelectSubset<T, StatusConfigFindUniqueArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StatusConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StatusConfigFindUniqueOrThrowArgs} args - Arguments to find a StatusConfig
     * @example
     * // Get one StatusConfig
     * const statusConfig = await prisma.statusConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StatusConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, StatusConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatusConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigFindFirstArgs} args - Arguments to find a StatusConfig
     * @example
     * // Get one StatusConfig
     * const statusConfig = await prisma.statusConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StatusConfigFindFirstArgs>(args?: SelectSubset<T, StatusConfigFindFirstArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatusConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigFindFirstOrThrowArgs} args - Arguments to find a StatusConfig
     * @example
     * // Get one StatusConfig
     * const statusConfig = await prisma.statusConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StatusConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, StatusConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StatusConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StatusConfigs
     * const statusConfigs = await prisma.statusConfig.findMany()
     * 
     * // Get first 10 StatusConfigs
     * const statusConfigs = await prisma.statusConfig.findMany({ take: 10 })
     * 
     * // Only select the `label`
     * const statusConfigWithLabelOnly = await prisma.statusConfig.findMany({ select: { label: true } })
     * 
     */
    findMany<T extends StatusConfigFindManyArgs>(args?: SelectSubset<T, StatusConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StatusConfig.
     * @param {StatusConfigCreateArgs} args - Arguments to create a StatusConfig.
     * @example
     * // Create one StatusConfig
     * const StatusConfig = await prisma.statusConfig.create({
     *   data: {
     *     // ... data to create a StatusConfig
     *   }
     * })
     * 
     */
    create<T extends StatusConfigCreateArgs>(args: SelectSubset<T, StatusConfigCreateArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StatusConfigs.
     * @param {StatusConfigCreateManyArgs} args - Arguments to create many StatusConfigs.
     * @example
     * // Create many StatusConfigs
     * const statusConfig = await prisma.statusConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StatusConfigCreateManyArgs>(args?: SelectSubset<T, StatusConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StatusConfigs and returns the data saved in the database.
     * @param {StatusConfigCreateManyAndReturnArgs} args - Arguments to create many StatusConfigs.
     * @example
     * // Create many StatusConfigs
     * const statusConfig = await prisma.statusConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StatusConfigs and only return the `label`
     * const statusConfigWithLabelOnly = await prisma.statusConfig.createManyAndReturn({
     *   select: { label: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StatusConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, StatusConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StatusConfig.
     * @param {StatusConfigDeleteArgs} args - Arguments to delete one StatusConfig.
     * @example
     * // Delete one StatusConfig
     * const StatusConfig = await prisma.statusConfig.delete({
     *   where: {
     *     // ... filter to delete one StatusConfig
     *   }
     * })
     * 
     */
    delete<T extends StatusConfigDeleteArgs>(args: SelectSubset<T, StatusConfigDeleteArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StatusConfig.
     * @param {StatusConfigUpdateArgs} args - Arguments to update one StatusConfig.
     * @example
     * // Update one StatusConfig
     * const statusConfig = await prisma.statusConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StatusConfigUpdateArgs>(args: SelectSubset<T, StatusConfigUpdateArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StatusConfigs.
     * @param {StatusConfigDeleteManyArgs} args - Arguments to filter StatusConfigs to delete.
     * @example
     * // Delete a few StatusConfigs
     * const { count } = await prisma.statusConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StatusConfigDeleteManyArgs>(args?: SelectSubset<T, StatusConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatusConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StatusConfigs
     * const statusConfig = await prisma.statusConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StatusConfigUpdateManyArgs>(args: SelectSubset<T, StatusConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatusConfigs and returns the data updated in the database.
     * @param {StatusConfigUpdateManyAndReturnArgs} args - Arguments to update many StatusConfigs.
     * @example
     * // Update many StatusConfigs
     * const statusConfig = await prisma.statusConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StatusConfigs and only return the `label`
     * const statusConfigWithLabelOnly = await prisma.statusConfig.updateManyAndReturn({
     *   select: { label: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StatusConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, StatusConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StatusConfig.
     * @param {StatusConfigUpsertArgs} args - Arguments to update or create a StatusConfig.
     * @example
     * // Update or create a StatusConfig
     * const statusConfig = await prisma.statusConfig.upsert({
     *   create: {
     *     // ... data to create a StatusConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StatusConfig we want to update
     *   }
     * })
     */
    upsert<T extends StatusConfigUpsertArgs>(args: SelectSubset<T, StatusConfigUpsertArgs<ExtArgs>>): Prisma__StatusConfigClient<$Result.GetResult<Prisma.$StatusConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StatusConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigCountArgs} args - Arguments to filter StatusConfigs to count.
     * @example
     * // Count the number of StatusConfigs
     * const count = await prisma.statusConfig.count({
     *   where: {
     *     // ... the filter for the StatusConfigs we want to count
     *   }
     * })
    **/
    count<T extends StatusConfigCountArgs>(
      args?: Subset<T, StatusConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StatusConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StatusConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StatusConfigAggregateArgs>(args: Subset<T, StatusConfigAggregateArgs>): Prisma.PrismaPromise<GetStatusConfigAggregateType<T>>

    /**
     * Group by StatusConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StatusConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StatusConfigGroupByArgs['orderBy'] }
        : { orderBy?: StatusConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StatusConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StatusConfig model
   */
  readonly fields: StatusConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StatusConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StatusConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StatusConfig model
   */
  interface StatusConfigFieldRefs {
    readonly id: FieldRef<"StatusConfig", 'TaskStatus'>
    readonly label: FieldRef<"StatusConfig", 'String'>
    readonly color: FieldRef<"StatusConfig", 'String'>
    readonly order: FieldRef<"StatusConfig", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StatusConfig findUnique
   */
  export type StatusConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter, which StatusConfig to fetch.
     */
    where: StatusConfigWhereUniqueInput
  }

  /**
   * StatusConfig findUniqueOrThrow
   */
  export type StatusConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter, which StatusConfig to fetch.
     */
    where: StatusConfigWhereUniqueInput
  }

  /**
   * StatusConfig findFirst
   */
  export type StatusConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter, which StatusConfig to fetch.
     */
    where?: StatusConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusConfigs to fetch.
     */
    orderBy?: StatusConfigOrderByWithRelationInput | StatusConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusConfigs.
     */
    cursor?: StatusConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusConfigs.
     */
    distinct?: StatusConfigScalarFieldEnum | StatusConfigScalarFieldEnum[]
  }

  /**
   * StatusConfig findFirstOrThrow
   */
  export type StatusConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter, which StatusConfig to fetch.
     */
    where?: StatusConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusConfigs to fetch.
     */
    orderBy?: StatusConfigOrderByWithRelationInput | StatusConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusConfigs.
     */
    cursor?: StatusConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusConfigs.
     */
    distinct?: StatusConfigScalarFieldEnum | StatusConfigScalarFieldEnum[]
  }

  /**
   * StatusConfig findMany
   */
  export type StatusConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter, which StatusConfigs to fetch.
     */
    where?: StatusConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusConfigs to fetch.
     */
    orderBy?: StatusConfigOrderByWithRelationInput | StatusConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StatusConfigs.
     */
    cursor?: StatusConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusConfigs.
     */
    distinct?: StatusConfigScalarFieldEnum | StatusConfigScalarFieldEnum[]
  }

  /**
   * StatusConfig create
   */
  export type StatusConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a StatusConfig.
     */
    data: XOR<StatusConfigCreateInput, StatusConfigUncheckedCreateInput>
  }

  /**
   * StatusConfig createMany
   */
  export type StatusConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StatusConfigs.
     */
    data: StatusConfigCreateManyInput | StatusConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatusConfig createManyAndReturn
   */
  export type StatusConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * The data used to create many StatusConfigs.
     */
    data: StatusConfigCreateManyInput | StatusConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatusConfig update
   */
  export type StatusConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a StatusConfig.
     */
    data: XOR<StatusConfigUpdateInput, StatusConfigUncheckedUpdateInput>
    /**
     * Choose, which StatusConfig to update.
     */
    where: StatusConfigWhereUniqueInput
  }

  /**
   * StatusConfig updateMany
   */
  export type StatusConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StatusConfigs.
     */
    data: XOR<StatusConfigUpdateManyMutationInput, StatusConfigUncheckedUpdateManyInput>
    /**
     * Filter which StatusConfigs to update
     */
    where?: StatusConfigWhereInput
    /**
     * Limit how many StatusConfigs to update.
     */
    limit?: number
  }

  /**
   * StatusConfig updateManyAndReturn
   */
  export type StatusConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * The data used to update StatusConfigs.
     */
    data: XOR<StatusConfigUpdateManyMutationInput, StatusConfigUncheckedUpdateManyInput>
    /**
     * Filter which StatusConfigs to update
     */
    where?: StatusConfigWhereInput
    /**
     * Limit how many StatusConfigs to update.
     */
    limit?: number
  }

  /**
   * StatusConfig upsert
   */
  export type StatusConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the StatusConfig to update in case it exists.
     */
    where: StatusConfigWhereUniqueInput
    /**
     * In case the StatusConfig found by the `where` argument doesn't exist, create a new StatusConfig with this data.
     */
    create: XOR<StatusConfigCreateInput, StatusConfigUncheckedCreateInput>
    /**
     * In case the StatusConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StatusConfigUpdateInput, StatusConfigUncheckedUpdateInput>
  }

  /**
   * StatusConfig delete
   */
  export type StatusConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
    /**
     * Filter which StatusConfig to delete.
     */
    where: StatusConfigWhereUniqueInput
  }

  /**
   * StatusConfig deleteMany
   */
  export type StatusConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusConfigs to delete
     */
    where?: StatusConfigWhereInput
    /**
     * Limit how many StatusConfigs to delete.
     */
    limit?: number
  }

  /**
   * StatusConfig without action
   */
  export type StatusConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusConfig
     */
    select?: StatusConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusConfig
     */
    omit?: StatusConfigOmit<ExtArgs> | null
  }


  /**
   * Model PriorityConfig
   */

  export type AggregatePriorityConfig = {
    _count: PriorityConfigCountAggregateOutputType | null
    _avg: PriorityConfigAvgAggregateOutputType | null
    _sum: PriorityConfigSumAggregateOutputType | null
    _min: PriorityConfigMinAggregateOutputType | null
    _max: PriorityConfigMaxAggregateOutputType | null
  }

  export type PriorityConfigAvgAggregateOutputType = {
    defaultWeight: number | null
  }

  export type PriorityConfigSumAggregateOutputType = {
    defaultWeight: number | null
  }

  export type PriorityConfigMinAggregateOutputType = {
    id: $Enums.Priority | null
    label: string | null
    color: string | null
    defaultWeight: number | null
  }

  export type PriorityConfigMaxAggregateOutputType = {
    id: $Enums.Priority | null
    label: string | null
    color: string | null
    defaultWeight: number | null
  }

  export type PriorityConfigCountAggregateOutputType = {
    id: number
    label: number
    color: number
    defaultWeight: number
    _all: number
  }


  export type PriorityConfigAvgAggregateInputType = {
    defaultWeight?: true
  }

  export type PriorityConfigSumAggregateInputType = {
    defaultWeight?: true
  }

  export type PriorityConfigMinAggregateInputType = {
    id?: true
    label?: true
    color?: true
    defaultWeight?: true
  }

  export type PriorityConfigMaxAggregateInputType = {
    id?: true
    label?: true
    color?: true
    defaultWeight?: true
  }

  export type PriorityConfigCountAggregateInputType = {
    id?: true
    label?: true
    color?: true
    defaultWeight?: true
    _all?: true
  }

  export type PriorityConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorityConfig to aggregate.
     */
    where?: PriorityConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityConfigs to fetch.
     */
    orderBy?: PriorityConfigOrderByWithRelationInput | PriorityConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriorityConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriorityConfigs
    **/
    _count?: true | PriorityConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriorityConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriorityConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriorityConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriorityConfigMaxAggregateInputType
  }

  export type GetPriorityConfigAggregateType<T extends PriorityConfigAggregateArgs> = {
        [P in keyof T & keyof AggregatePriorityConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriorityConfig[P]>
      : GetScalarType<T[P], AggregatePriorityConfig[P]>
  }




  export type PriorityConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriorityConfigWhereInput
    orderBy?: PriorityConfigOrderByWithAggregationInput | PriorityConfigOrderByWithAggregationInput[]
    by: PriorityConfigScalarFieldEnum[] | PriorityConfigScalarFieldEnum
    having?: PriorityConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriorityConfigCountAggregateInputType | true
    _avg?: PriorityConfigAvgAggregateInputType
    _sum?: PriorityConfigSumAggregateInputType
    _min?: PriorityConfigMinAggregateInputType
    _max?: PriorityConfigMaxAggregateInputType
  }

  export type PriorityConfigGroupByOutputType = {
    id: $Enums.Priority
    label: string
    color: string
    defaultWeight: number
    _count: PriorityConfigCountAggregateOutputType | null
    _avg: PriorityConfigAvgAggregateOutputType | null
    _sum: PriorityConfigSumAggregateOutputType | null
    _min: PriorityConfigMinAggregateOutputType | null
    _max: PriorityConfigMaxAggregateOutputType | null
  }

  type GetPriorityConfigGroupByPayload<T extends PriorityConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriorityConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriorityConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriorityConfigGroupByOutputType[P]>
            : GetScalarType<T[P], PriorityConfigGroupByOutputType[P]>
        }
      >
    >


  export type PriorityConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    defaultWeight?: boolean
  }, ExtArgs["result"]["priorityConfig"]>

  export type PriorityConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    defaultWeight?: boolean
  }, ExtArgs["result"]["priorityConfig"]>

  export type PriorityConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    color?: boolean
    defaultWeight?: boolean
  }, ExtArgs["result"]["priorityConfig"]>

  export type PriorityConfigSelectScalar = {
    id?: boolean
    label?: boolean
    color?: boolean
    defaultWeight?: boolean
  }

  export type PriorityConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "color" | "defaultWeight", ExtArgs["result"]["priorityConfig"]>

  export type $PriorityConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriorityConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: $Enums.Priority
      label: string
      color: string
      defaultWeight: number
    }, ExtArgs["result"]["priorityConfig"]>
    composites: {}
  }

  type PriorityConfigGetPayload<S extends boolean | null | undefined | PriorityConfigDefaultArgs> = $Result.GetResult<Prisma.$PriorityConfigPayload, S>

  type PriorityConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriorityConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriorityConfigCountAggregateInputType | true
    }

  export interface PriorityConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriorityConfig'], meta: { name: 'PriorityConfig' } }
    /**
     * Find zero or one PriorityConfig that matches the filter.
     * @param {PriorityConfigFindUniqueArgs} args - Arguments to find a PriorityConfig
     * @example
     * // Get one PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriorityConfigFindUniqueArgs>(args: SelectSubset<T, PriorityConfigFindUniqueArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriorityConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriorityConfigFindUniqueOrThrowArgs} args - Arguments to find a PriorityConfig
     * @example
     * // Get one PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriorityConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, PriorityConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriorityConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigFindFirstArgs} args - Arguments to find a PriorityConfig
     * @example
     * // Get one PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriorityConfigFindFirstArgs>(args?: SelectSubset<T, PriorityConfigFindFirstArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriorityConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigFindFirstOrThrowArgs} args - Arguments to find a PriorityConfig
     * @example
     * // Get one PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriorityConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, PriorityConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriorityConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriorityConfigs
     * const priorityConfigs = await prisma.priorityConfig.findMany()
     * 
     * // Get first 10 PriorityConfigs
     * const priorityConfigs = await prisma.priorityConfig.findMany({ take: 10 })
     * 
     * // Only select the `label`
     * const priorityConfigWithLabelOnly = await prisma.priorityConfig.findMany({ select: { label: true } })
     * 
     */
    findMany<T extends PriorityConfigFindManyArgs>(args?: SelectSubset<T, PriorityConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriorityConfig.
     * @param {PriorityConfigCreateArgs} args - Arguments to create a PriorityConfig.
     * @example
     * // Create one PriorityConfig
     * const PriorityConfig = await prisma.priorityConfig.create({
     *   data: {
     *     // ... data to create a PriorityConfig
     *   }
     * })
     * 
     */
    create<T extends PriorityConfigCreateArgs>(args: SelectSubset<T, PriorityConfigCreateArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriorityConfigs.
     * @param {PriorityConfigCreateManyArgs} args - Arguments to create many PriorityConfigs.
     * @example
     * // Create many PriorityConfigs
     * const priorityConfig = await prisma.priorityConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriorityConfigCreateManyArgs>(args?: SelectSubset<T, PriorityConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriorityConfigs and returns the data saved in the database.
     * @param {PriorityConfigCreateManyAndReturnArgs} args - Arguments to create many PriorityConfigs.
     * @example
     * // Create many PriorityConfigs
     * const priorityConfig = await prisma.priorityConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriorityConfigs and only return the `label`
     * const priorityConfigWithLabelOnly = await prisma.priorityConfig.createManyAndReturn({
     *   select: { label: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriorityConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, PriorityConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriorityConfig.
     * @param {PriorityConfigDeleteArgs} args - Arguments to delete one PriorityConfig.
     * @example
     * // Delete one PriorityConfig
     * const PriorityConfig = await prisma.priorityConfig.delete({
     *   where: {
     *     // ... filter to delete one PriorityConfig
     *   }
     * })
     * 
     */
    delete<T extends PriorityConfigDeleteArgs>(args: SelectSubset<T, PriorityConfigDeleteArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriorityConfig.
     * @param {PriorityConfigUpdateArgs} args - Arguments to update one PriorityConfig.
     * @example
     * // Update one PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriorityConfigUpdateArgs>(args: SelectSubset<T, PriorityConfigUpdateArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriorityConfigs.
     * @param {PriorityConfigDeleteManyArgs} args - Arguments to filter PriorityConfigs to delete.
     * @example
     * // Delete a few PriorityConfigs
     * const { count } = await prisma.priorityConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriorityConfigDeleteManyArgs>(args?: SelectSubset<T, PriorityConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriorityConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriorityConfigs
     * const priorityConfig = await prisma.priorityConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriorityConfigUpdateManyArgs>(args: SelectSubset<T, PriorityConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriorityConfigs and returns the data updated in the database.
     * @param {PriorityConfigUpdateManyAndReturnArgs} args - Arguments to update many PriorityConfigs.
     * @example
     * // Update many PriorityConfigs
     * const priorityConfig = await prisma.priorityConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriorityConfigs and only return the `label`
     * const priorityConfigWithLabelOnly = await prisma.priorityConfig.updateManyAndReturn({
     *   select: { label: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PriorityConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, PriorityConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriorityConfig.
     * @param {PriorityConfigUpsertArgs} args - Arguments to update or create a PriorityConfig.
     * @example
     * // Update or create a PriorityConfig
     * const priorityConfig = await prisma.priorityConfig.upsert({
     *   create: {
     *     // ... data to create a PriorityConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriorityConfig we want to update
     *   }
     * })
     */
    upsert<T extends PriorityConfigUpsertArgs>(args: SelectSubset<T, PriorityConfigUpsertArgs<ExtArgs>>): Prisma__PriorityConfigClient<$Result.GetResult<Prisma.$PriorityConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriorityConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigCountArgs} args - Arguments to filter PriorityConfigs to count.
     * @example
     * // Count the number of PriorityConfigs
     * const count = await prisma.priorityConfig.count({
     *   where: {
     *     // ... the filter for the PriorityConfigs we want to count
     *   }
     * })
    **/
    count<T extends PriorityConfigCountArgs>(
      args?: Subset<T, PriorityConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriorityConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriorityConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PriorityConfigAggregateArgs>(args: Subset<T, PriorityConfigAggregateArgs>): Prisma.PrismaPromise<GetPriorityConfigAggregateType<T>>

    /**
     * Group by PriorityConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorityConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PriorityConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriorityConfigGroupByArgs['orderBy'] }
        : { orderBy?: PriorityConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PriorityConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriorityConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriorityConfig model
   */
  readonly fields: PriorityConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriorityConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriorityConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PriorityConfig model
   */
  interface PriorityConfigFieldRefs {
    readonly id: FieldRef<"PriorityConfig", 'Priority'>
    readonly label: FieldRef<"PriorityConfig", 'String'>
    readonly color: FieldRef<"PriorityConfig", 'String'>
    readonly defaultWeight: FieldRef<"PriorityConfig", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * PriorityConfig findUnique
   */
  export type PriorityConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter, which PriorityConfig to fetch.
     */
    where: PriorityConfigWhereUniqueInput
  }

  /**
   * PriorityConfig findUniqueOrThrow
   */
  export type PriorityConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter, which PriorityConfig to fetch.
     */
    where: PriorityConfigWhereUniqueInput
  }

  /**
   * PriorityConfig findFirst
   */
  export type PriorityConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter, which PriorityConfig to fetch.
     */
    where?: PriorityConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityConfigs to fetch.
     */
    orderBy?: PriorityConfigOrderByWithRelationInput | PriorityConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorityConfigs.
     */
    cursor?: PriorityConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorityConfigs.
     */
    distinct?: PriorityConfigScalarFieldEnum | PriorityConfigScalarFieldEnum[]
  }

  /**
   * PriorityConfig findFirstOrThrow
   */
  export type PriorityConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter, which PriorityConfig to fetch.
     */
    where?: PriorityConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityConfigs to fetch.
     */
    orderBy?: PriorityConfigOrderByWithRelationInput | PriorityConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorityConfigs.
     */
    cursor?: PriorityConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorityConfigs.
     */
    distinct?: PriorityConfigScalarFieldEnum | PriorityConfigScalarFieldEnum[]
  }

  /**
   * PriorityConfig findMany
   */
  export type PriorityConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter, which PriorityConfigs to fetch.
     */
    where?: PriorityConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorityConfigs to fetch.
     */
    orderBy?: PriorityConfigOrderByWithRelationInput | PriorityConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriorityConfigs.
     */
    cursor?: PriorityConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorityConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorityConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorityConfigs.
     */
    distinct?: PriorityConfigScalarFieldEnum | PriorityConfigScalarFieldEnum[]
  }

  /**
   * PriorityConfig create
   */
  export type PriorityConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a PriorityConfig.
     */
    data: XOR<PriorityConfigCreateInput, PriorityConfigUncheckedCreateInput>
  }

  /**
   * PriorityConfig createMany
   */
  export type PriorityConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriorityConfigs.
     */
    data: PriorityConfigCreateManyInput | PriorityConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriorityConfig createManyAndReturn
   */
  export type PriorityConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * The data used to create many PriorityConfigs.
     */
    data: PriorityConfigCreateManyInput | PriorityConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriorityConfig update
   */
  export type PriorityConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a PriorityConfig.
     */
    data: XOR<PriorityConfigUpdateInput, PriorityConfigUncheckedUpdateInput>
    /**
     * Choose, which PriorityConfig to update.
     */
    where: PriorityConfigWhereUniqueInput
  }

  /**
   * PriorityConfig updateMany
   */
  export type PriorityConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriorityConfigs.
     */
    data: XOR<PriorityConfigUpdateManyMutationInput, PriorityConfigUncheckedUpdateManyInput>
    /**
     * Filter which PriorityConfigs to update
     */
    where?: PriorityConfigWhereInput
    /**
     * Limit how many PriorityConfigs to update.
     */
    limit?: number
  }

  /**
   * PriorityConfig updateManyAndReturn
   */
  export type PriorityConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * The data used to update PriorityConfigs.
     */
    data: XOR<PriorityConfigUpdateManyMutationInput, PriorityConfigUncheckedUpdateManyInput>
    /**
     * Filter which PriorityConfigs to update
     */
    where?: PriorityConfigWhereInput
    /**
     * Limit how many PriorityConfigs to update.
     */
    limit?: number
  }

  /**
   * PriorityConfig upsert
   */
  export type PriorityConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the PriorityConfig to update in case it exists.
     */
    where: PriorityConfigWhereUniqueInput
    /**
     * In case the PriorityConfig found by the `where` argument doesn't exist, create a new PriorityConfig with this data.
     */
    create: XOR<PriorityConfigCreateInput, PriorityConfigUncheckedCreateInput>
    /**
     * In case the PriorityConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriorityConfigUpdateInput, PriorityConfigUncheckedUpdateInput>
  }

  /**
   * PriorityConfig delete
   */
  export type PriorityConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
    /**
     * Filter which PriorityConfig to delete.
     */
    where: PriorityConfigWhereUniqueInput
  }

  /**
   * PriorityConfig deleteMany
   */
  export type PriorityConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorityConfigs to delete
     */
    where?: PriorityConfigWhereInput
    /**
     * Limit how many PriorityConfigs to delete.
     */
    limit?: number
  }

  /**
   * PriorityConfig without action
   */
  export type PriorityConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorityConfig
     */
    select?: PriorityConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriorityConfig
     */
    omit?: PriorityConfigOmit<ExtArgs> | null
  }


  /**
   * Model GameScorecard
   */

  export type AggregateGameScorecard = {
    _count: GameScorecardCountAggregateOutputType | null
    _avg: GameScorecardAvgAggregateOutputType | null
    _sum: GameScorecardSumAggregateOutputType | null
    _min: GameScorecardMinAggregateOutputType | null
    _max: GameScorecardMaxAggregateOutputType | null
  }

  export type GameScorecardAvgAggregateOutputType = {
    ratingsCoreLoop: number | null
    ratingsMonetization: number | null
    ratingsVisualUx: number | null
    ratingsRetention: number | null
    ratingsUsp: number | null
  }

  export type GameScorecardSumAggregateOutputType = {
    ratingsCoreLoop: number | null
    ratingsMonetization: number | null
    ratingsVisualUx: number | null
    ratingsRetention: number | null
    ratingsUsp: number | null
  }

  export type GameScorecardMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    week: Date | null
    ratingsCoreLoop: number | null
    ratingsMonetization: number | null
    ratingsVisualUx: number | null
    ratingsRetention: number | null
    ratingsUsp: number | null
    summary: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type GameScorecardMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    week: Date | null
    ratingsCoreLoop: number | null
    ratingsMonetization: number | null
    ratingsVisualUx: number | null
    ratingsRetention: number | null
    ratingsUsp: number | null
    summary: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type GameScorecardCountAggregateOutputType = {
    id: number
    projectId: number
    week: number
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: number
    authorId: number
    createdAt: number
    _all: number
  }


  export type GameScorecardAvgAggregateInputType = {
    ratingsCoreLoop?: true
    ratingsMonetization?: true
    ratingsVisualUx?: true
    ratingsRetention?: true
    ratingsUsp?: true
  }

  export type GameScorecardSumAggregateInputType = {
    ratingsCoreLoop?: true
    ratingsMonetization?: true
    ratingsVisualUx?: true
    ratingsRetention?: true
    ratingsUsp?: true
  }

  export type GameScorecardMinAggregateInputType = {
    id?: true
    projectId?: true
    week?: true
    ratingsCoreLoop?: true
    ratingsMonetization?: true
    ratingsVisualUx?: true
    ratingsRetention?: true
    ratingsUsp?: true
    summary?: true
    authorId?: true
    createdAt?: true
  }

  export type GameScorecardMaxAggregateInputType = {
    id?: true
    projectId?: true
    week?: true
    ratingsCoreLoop?: true
    ratingsMonetization?: true
    ratingsVisualUx?: true
    ratingsRetention?: true
    ratingsUsp?: true
    summary?: true
    authorId?: true
    createdAt?: true
  }

  export type GameScorecardCountAggregateInputType = {
    id?: true
    projectId?: true
    week?: true
    ratingsCoreLoop?: true
    ratingsMonetization?: true
    ratingsVisualUx?: true
    ratingsRetention?: true
    ratingsUsp?: true
    summary?: true
    authorId?: true
    createdAt?: true
    _all?: true
  }

  export type GameScorecardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameScorecard to aggregate.
     */
    where?: GameScorecardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScorecards to fetch.
     */
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameScorecardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScorecards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScorecards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameScorecards
    **/
    _count?: true | GameScorecardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameScorecardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameScorecardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameScorecardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameScorecardMaxAggregateInputType
  }

  export type GetGameScorecardAggregateType<T extends GameScorecardAggregateArgs> = {
        [P in keyof T & keyof AggregateGameScorecard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameScorecard[P]>
      : GetScalarType<T[P], AggregateGameScorecard[P]>
  }




  export type GameScorecardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScorecardWhereInput
    orderBy?: GameScorecardOrderByWithAggregationInput | GameScorecardOrderByWithAggregationInput[]
    by: GameScorecardScalarFieldEnum[] | GameScorecardScalarFieldEnum
    having?: GameScorecardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameScorecardCountAggregateInputType | true
    _avg?: GameScorecardAvgAggregateInputType
    _sum?: GameScorecardSumAggregateInputType
    _min?: GameScorecardMinAggregateInputType
    _max?: GameScorecardMaxAggregateInputType
  }

  export type GameScorecardGroupByOutputType = {
    id: string
    projectId: string
    week: Date
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    authorId: string
    createdAt: Date
    _count: GameScorecardCountAggregateOutputType | null
    _avg: GameScorecardAvgAggregateOutputType | null
    _sum: GameScorecardSumAggregateOutputType | null
    _min: GameScorecardMinAggregateOutputType | null
    _max: GameScorecardMaxAggregateOutputType | null
  }

  type GetGameScorecardGroupByPayload<T extends GameScorecardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameScorecardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameScorecardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameScorecardGroupByOutputType[P]>
            : GetScalarType<T[P], GameScorecardGroupByOutputType[P]>
        }
      >
    >


  export type GameScorecardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    week?: boolean
    ratingsCoreLoop?: boolean
    ratingsMonetization?: boolean
    ratingsVisualUx?: boolean
    ratingsRetention?: boolean
    ratingsUsp?: boolean
    summary?: boolean
    authorId?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScorecard"]>

  export type GameScorecardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    week?: boolean
    ratingsCoreLoop?: boolean
    ratingsMonetization?: boolean
    ratingsVisualUx?: boolean
    ratingsRetention?: boolean
    ratingsUsp?: boolean
    summary?: boolean
    authorId?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScorecard"]>

  export type GameScorecardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    week?: boolean
    ratingsCoreLoop?: boolean
    ratingsMonetization?: boolean
    ratingsVisualUx?: boolean
    ratingsRetention?: boolean
    ratingsUsp?: boolean
    summary?: boolean
    authorId?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScorecard"]>

  export type GameScorecardSelectScalar = {
    id?: boolean
    projectId?: boolean
    week?: boolean
    ratingsCoreLoop?: boolean
    ratingsMonetization?: boolean
    ratingsVisualUx?: boolean
    ratingsRetention?: boolean
    ratingsUsp?: boolean
    summary?: boolean
    authorId?: boolean
    createdAt?: boolean
  }

  export type GameScorecardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "week" | "ratingsCoreLoop" | "ratingsMonetization" | "ratingsVisualUx" | "ratingsRetention" | "ratingsUsp" | "summary" | "authorId" | "createdAt", ExtArgs["result"]["gameScorecard"]>
  export type GameScorecardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type GameScorecardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type GameScorecardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $GameScorecardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameScorecard"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      author: Prisma.$MemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      week: Date
      ratingsCoreLoop: number
      ratingsMonetization: number
      ratingsVisualUx: number
      ratingsRetention: number
      ratingsUsp: number
      summary: string
      authorId: string
      createdAt: Date
    }, ExtArgs["result"]["gameScorecard"]>
    composites: {}
  }

  type GameScorecardGetPayload<S extends boolean | null | undefined | GameScorecardDefaultArgs> = $Result.GetResult<Prisma.$GameScorecardPayload, S>

  type GameScorecardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameScorecardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameScorecardCountAggregateInputType | true
    }

  export interface GameScorecardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameScorecard'], meta: { name: 'GameScorecard' } }
    /**
     * Find zero or one GameScorecard that matches the filter.
     * @param {GameScorecardFindUniqueArgs} args - Arguments to find a GameScorecard
     * @example
     * // Get one GameScorecard
     * const gameScorecard = await prisma.gameScorecard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameScorecardFindUniqueArgs>(args: SelectSubset<T, GameScorecardFindUniqueArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameScorecard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameScorecardFindUniqueOrThrowArgs} args - Arguments to find a GameScorecard
     * @example
     * // Get one GameScorecard
     * const gameScorecard = await prisma.gameScorecard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameScorecardFindUniqueOrThrowArgs>(args: SelectSubset<T, GameScorecardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameScorecard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardFindFirstArgs} args - Arguments to find a GameScorecard
     * @example
     * // Get one GameScorecard
     * const gameScorecard = await prisma.gameScorecard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameScorecardFindFirstArgs>(args?: SelectSubset<T, GameScorecardFindFirstArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameScorecard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardFindFirstOrThrowArgs} args - Arguments to find a GameScorecard
     * @example
     * // Get one GameScorecard
     * const gameScorecard = await prisma.gameScorecard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameScorecardFindFirstOrThrowArgs>(args?: SelectSubset<T, GameScorecardFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameScorecards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameScorecards
     * const gameScorecards = await prisma.gameScorecard.findMany()
     * 
     * // Get first 10 GameScorecards
     * const gameScorecards = await prisma.gameScorecard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameScorecardWithIdOnly = await prisma.gameScorecard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameScorecardFindManyArgs>(args?: SelectSubset<T, GameScorecardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameScorecard.
     * @param {GameScorecardCreateArgs} args - Arguments to create a GameScorecard.
     * @example
     * // Create one GameScorecard
     * const GameScorecard = await prisma.gameScorecard.create({
     *   data: {
     *     // ... data to create a GameScorecard
     *   }
     * })
     * 
     */
    create<T extends GameScorecardCreateArgs>(args: SelectSubset<T, GameScorecardCreateArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameScorecards.
     * @param {GameScorecardCreateManyArgs} args - Arguments to create many GameScorecards.
     * @example
     * // Create many GameScorecards
     * const gameScorecard = await prisma.gameScorecard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameScorecardCreateManyArgs>(args?: SelectSubset<T, GameScorecardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameScorecards and returns the data saved in the database.
     * @param {GameScorecardCreateManyAndReturnArgs} args - Arguments to create many GameScorecards.
     * @example
     * // Create many GameScorecards
     * const gameScorecard = await prisma.gameScorecard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameScorecards and only return the `id`
     * const gameScorecardWithIdOnly = await prisma.gameScorecard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameScorecardCreateManyAndReturnArgs>(args?: SelectSubset<T, GameScorecardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameScorecard.
     * @param {GameScorecardDeleteArgs} args - Arguments to delete one GameScorecard.
     * @example
     * // Delete one GameScorecard
     * const GameScorecard = await prisma.gameScorecard.delete({
     *   where: {
     *     // ... filter to delete one GameScorecard
     *   }
     * })
     * 
     */
    delete<T extends GameScorecardDeleteArgs>(args: SelectSubset<T, GameScorecardDeleteArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameScorecard.
     * @param {GameScorecardUpdateArgs} args - Arguments to update one GameScorecard.
     * @example
     * // Update one GameScorecard
     * const gameScorecard = await prisma.gameScorecard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameScorecardUpdateArgs>(args: SelectSubset<T, GameScorecardUpdateArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameScorecards.
     * @param {GameScorecardDeleteManyArgs} args - Arguments to filter GameScorecards to delete.
     * @example
     * // Delete a few GameScorecards
     * const { count } = await prisma.gameScorecard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameScorecardDeleteManyArgs>(args?: SelectSubset<T, GameScorecardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameScorecards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameScorecards
     * const gameScorecard = await prisma.gameScorecard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameScorecardUpdateManyArgs>(args: SelectSubset<T, GameScorecardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameScorecards and returns the data updated in the database.
     * @param {GameScorecardUpdateManyAndReturnArgs} args - Arguments to update many GameScorecards.
     * @example
     * // Update many GameScorecards
     * const gameScorecard = await prisma.gameScorecard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameScorecards and only return the `id`
     * const gameScorecardWithIdOnly = await prisma.gameScorecard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameScorecardUpdateManyAndReturnArgs>(args: SelectSubset<T, GameScorecardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameScorecard.
     * @param {GameScorecardUpsertArgs} args - Arguments to update or create a GameScorecard.
     * @example
     * // Update or create a GameScorecard
     * const gameScorecard = await prisma.gameScorecard.upsert({
     *   create: {
     *     // ... data to create a GameScorecard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameScorecard we want to update
     *   }
     * })
     */
    upsert<T extends GameScorecardUpsertArgs>(args: SelectSubset<T, GameScorecardUpsertArgs<ExtArgs>>): Prisma__GameScorecardClient<$Result.GetResult<Prisma.$GameScorecardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameScorecards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardCountArgs} args - Arguments to filter GameScorecards to count.
     * @example
     * // Count the number of GameScorecards
     * const count = await prisma.gameScorecard.count({
     *   where: {
     *     // ... the filter for the GameScorecards we want to count
     *   }
     * })
    **/
    count<T extends GameScorecardCountArgs>(
      args?: Subset<T, GameScorecardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameScorecardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameScorecard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameScorecardAggregateArgs>(args: Subset<T, GameScorecardAggregateArgs>): Prisma.PrismaPromise<GetGameScorecardAggregateType<T>>

    /**
     * Group by GameScorecard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScorecardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameScorecardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameScorecardGroupByArgs['orderBy'] }
        : { orderBy?: GameScorecardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameScorecardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameScorecardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameScorecard model
   */
  readonly fields: GameScorecardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameScorecard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameScorecardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameScorecard model
   */
  interface GameScorecardFieldRefs {
    readonly id: FieldRef<"GameScorecard", 'String'>
    readonly projectId: FieldRef<"GameScorecard", 'String'>
    readonly week: FieldRef<"GameScorecard", 'DateTime'>
    readonly ratingsCoreLoop: FieldRef<"GameScorecard", 'Int'>
    readonly ratingsMonetization: FieldRef<"GameScorecard", 'Int'>
    readonly ratingsVisualUx: FieldRef<"GameScorecard", 'Int'>
    readonly ratingsRetention: FieldRef<"GameScorecard", 'Int'>
    readonly ratingsUsp: FieldRef<"GameScorecard", 'Int'>
    readonly summary: FieldRef<"GameScorecard", 'String'>
    readonly authorId: FieldRef<"GameScorecard", 'String'>
    readonly createdAt: FieldRef<"GameScorecard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameScorecard findUnique
   */
  export type GameScorecardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter, which GameScorecard to fetch.
     */
    where: GameScorecardWhereUniqueInput
  }

  /**
   * GameScorecard findUniqueOrThrow
   */
  export type GameScorecardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter, which GameScorecard to fetch.
     */
    where: GameScorecardWhereUniqueInput
  }

  /**
   * GameScorecard findFirst
   */
  export type GameScorecardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter, which GameScorecard to fetch.
     */
    where?: GameScorecardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScorecards to fetch.
     */
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameScorecards.
     */
    cursor?: GameScorecardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScorecards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScorecards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameScorecards.
     */
    distinct?: GameScorecardScalarFieldEnum | GameScorecardScalarFieldEnum[]
  }

  /**
   * GameScorecard findFirstOrThrow
   */
  export type GameScorecardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter, which GameScorecard to fetch.
     */
    where?: GameScorecardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScorecards to fetch.
     */
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameScorecards.
     */
    cursor?: GameScorecardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScorecards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScorecards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameScorecards.
     */
    distinct?: GameScorecardScalarFieldEnum | GameScorecardScalarFieldEnum[]
  }

  /**
   * GameScorecard findMany
   */
  export type GameScorecardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter, which GameScorecards to fetch.
     */
    where?: GameScorecardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScorecards to fetch.
     */
    orderBy?: GameScorecardOrderByWithRelationInput | GameScorecardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameScorecards.
     */
    cursor?: GameScorecardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScorecards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScorecards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameScorecards.
     */
    distinct?: GameScorecardScalarFieldEnum | GameScorecardScalarFieldEnum[]
  }

  /**
   * GameScorecard create
   */
  export type GameScorecardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * The data needed to create a GameScorecard.
     */
    data: XOR<GameScorecardCreateInput, GameScorecardUncheckedCreateInput>
  }

  /**
   * GameScorecard createMany
   */
  export type GameScorecardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameScorecards.
     */
    data: GameScorecardCreateManyInput | GameScorecardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameScorecard createManyAndReturn
   */
  export type GameScorecardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * The data used to create many GameScorecards.
     */
    data: GameScorecardCreateManyInput | GameScorecardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameScorecard update
   */
  export type GameScorecardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * The data needed to update a GameScorecard.
     */
    data: XOR<GameScorecardUpdateInput, GameScorecardUncheckedUpdateInput>
    /**
     * Choose, which GameScorecard to update.
     */
    where: GameScorecardWhereUniqueInput
  }

  /**
   * GameScorecard updateMany
   */
  export type GameScorecardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameScorecards.
     */
    data: XOR<GameScorecardUpdateManyMutationInput, GameScorecardUncheckedUpdateManyInput>
    /**
     * Filter which GameScorecards to update
     */
    where?: GameScorecardWhereInput
    /**
     * Limit how many GameScorecards to update.
     */
    limit?: number
  }

  /**
   * GameScorecard updateManyAndReturn
   */
  export type GameScorecardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * The data used to update GameScorecards.
     */
    data: XOR<GameScorecardUpdateManyMutationInput, GameScorecardUncheckedUpdateManyInput>
    /**
     * Filter which GameScorecards to update
     */
    where?: GameScorecardWhereInput
    /**
     * Limit how many GameScorecards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameScorecard upsert
   */
  export type GameScorecardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * The filter to search for the GameScorecard to update in case it exists.
     */
    where: GameScorecardWhereUniqueInput
    /**
     * In case the GameScorecard found by the `where` argument doesn't exist, create a new GameScorecard with this data.
     */
    create: XOR<GameScorecardCreateInput, GameScorecardUncheckedCreateInput>
    /**
     * In case the GameScorecard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameScorecardUpdateInput, GameScorecardUncheckedUpdateInput>
  }

  /**
   * GameScorecard delete
   */
  export type GameScorecardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
    /**
     * Filter which GameScorecard to delete.
     */
    where: GameScorecardWhereUniqueInput
  }

  /**
   * GameScorecard deleteMany
   */
  export type GameScorecardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameScorecards to delete
     */
    where?: GameScorecardWhereInput
    /**
     * Limit how many GameScorecards to delete.
     */
    limit?: number
  }

  /**
   * GameScorecard without action
   */
  export type GameScorecardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScorecard
     */
    select?: GameScorecardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScorecard
     */
    omit?: GameScorecardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScorecardInclude<ExtArgs> | null
  }


  /**
   * Model WeeklyInsight
   */

  export type AggregateWeeklyInsight = {
    _count: WeeklyInsightCountAggregateOutputType | null
    _min: WeeklyInsightMinAggregateOutputType | null
    _max: WeeklyInsightMaxAggregateOutputType | null
  }

  export type WeeklyInsightMinAggregateOutputType = {
    id: string | null
    week: Date | null
    title: string | null
    overallStatus: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type WeeklyInsightMaxAggregateOutputType = {
    id: string | null
    week: Date | null
    title: string | null
    overallStatus: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type WeeklyInsightCountAggregateOutputType = {
    id: number
    week: number
    title: number
    overallStatus: number
    highlights: number
    risks: number
    actionItems: number
    authorId: number
    createdAt: number
    _all: number
  }


  export type WeeklyInsightMinAggregateInputType = {
    id?: true
    week?: true
    title?: true
    overallStatus?: true
    authorId?: true
    createdAt?: true
  }

  export type WeeklyInsightMaxAggregateInputType = {
    id?: true
    week?: true
    title?: true
    overallStatus?: true
    authorId?: true
    createdAt?: true
  }

  export type WeeklyInsightCountAggregateInputType = {
    id?: true
    week?: true
    title?: true
    overallStatus?: true
    highlights?: true
    risks?: true
    actionItems?: true
    authorId?: true
    createdAt?: true
    _all?: true
  }

  export type WeeklyInsightAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeeklyInsight to aggregate.
     */
    where?: WeeklyInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyInsights to fetch.
     */
    orderBy?: WeeklyInsightOrderByWithRelationInput | WeeklyInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeeklyInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeeklyInsights
    **/
    _count?: true | WeeklyInsightCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeeklyInsightMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeeklyInsightMaxAggregateInputType
  }

  export type GetWeeklyInsightAggregateType<T extends WeeklyInsightAggregateArgs> = {
        [P in keyof T & keyof AggregateWeeklyInsight]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeeklyInsight[P]>
      : GetScalarType<T[P], AggregateWeeklyInsight[P]>
  }




  export type WeeklyInsightGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeeklyInsightWhereInput
    orderBy?: WeeklyInsightOrderByWithAggregationInput | WeeklyInsightOrderByWithAggregationInput[]
    by: WeeklyInsightScalarFieldEnum[] | WeeklyInsightScalarFieldEnum
    having?: WeeklyInsightScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeeklyInsightCountAggregateInputType | true
    _min?: WeeklyInsightMinAggregateInputType
    _max?: WeeklyInsightMaxAggregateInputType
  }

  export type WeeklyInsightGroupByOutputType = {
    id: string
    week: Date
    title: string
    overallStatus: string
    highlights: JsonValue | null
    risks: JsonValue | null
    actionItems: JsonValue | null
    authorId: string
    createdAt: Date
    _count: WeeklyInsightCountAggregateOutputType | null
    _min: WeeklyInsightMinAggregateOutputType | null
    _max: WeeklyInsightMaxAggregateOutputType | null
  }

  type GetWeeklyInsightGroupByPayload<T extends WeeklyInsightGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeeklyInsightGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeeklyInsightGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeeklyInsightGroupByOutputType[P]>
            : GetScalarType<T[P], WeeklyInsightGroupByOutputType[P]>
        }
      >
    >


  export type WeeklyInsightSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    week?: boolean
    title?: boolean
    overallStatus?: boolean
    highlights?: boolean
    risks?: boolean
    actionItems?: boolean
    authorId?: boolean
    createdAt?: boolean
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weeklyInsight"]>

  export type WeeklyInsightSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    week?: boolean
    title?: boolean
    overallStatus?: boolean
    highlights?: boolean
    risks?: boolean
    actionItems?: boolean
    authorId?: boolean
    createdAt?: boolean
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weeklyInsight"]>

  export type WeeklyInsightSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    week?: boolean
    title?: boolean
    overallStatus?: boolean
    highlights?: boolean
    risks?: boolean
    actionItems?: boolean
    authorId?: boolean
    createdAt?: boolean
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weeklyInsight"]>

  export type WeeklyInsightSelectScalar = {
    id?: boolean
    week?: boolean
    title?: boolean
    overallStatus?: boolean
    highlights?: boolean
    risks?: boolean
    actionItems?: boolean
    authorId?: boolean
    createdAt?: boolean
  }

  export type WeeklyInsightOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "week" | "title" | "overallStatus" | "highlights" | "risks" | "actionItems" | "authorId" | "createdAt", ExtArgs["result"]["weeklyInsight"]>
  export type WeeklyInsightInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type WeeklyInsightIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type WeeklyInsightIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $WeeklyInsightPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeeklyInsight"
    objects: {
      author: Prisma.$MemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      week: Date
      title: string
      overallStatus: string
      highlights: Prisma.JsonValue | null
      risks: Prisma.JsonValue | null
      actionItems: Prisma.JsonValue | null
      authorId: string
      createdAt: Date
    }, ExtArgs["result"]["weeklyInsight"]>
    composites: {}
  }

  type WeeklyInsightGetPayload<S extends boolean | null | undefined | WeeklyInsightDefaultArgs> = $Result.GetResult<Prisma.$WeeklyInsightPayload, S>

  type WeeklyInsightCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeeklyInsightFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeeklyInsightCountAggregateInputType | true
    }

  export interface WeeklyInsightDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeeklyInsight'], meta: { name: 'WeeklyInsight' } }
    /**
     * Find zero or one WeeklyInsight that matches the filter.
     * @param {WeeklyInsightFindUniqueArgs} args - Arguments to find a WeeklyInsight
     * @example
     * // Get one WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeeklyInsightFindUniqueArgs>(args: SelectSubset<T, WeeklyInsightFindUniqueArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeeklyInsight that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeeklyInsightFindUniqueOrThrowArgs} args - Arguments to find a WeeklyInsight
     * @example
     * // Get one WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeeklyInsightFindUniqueOrThrowArgs>(args: SelectSubset<T, WeeklyInsightFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeeklyInsight that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightFindFirstArgs} args - Arguments to find a WeeklyInsight
     * @example
     * // Get one WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeeklyInsightFindFirstArgs>(args?: SelectSubset<T, WeeklyInsightFindFirstArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeeklyInsight that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightFindFirstOrThrowArgs} args - Arguments to find a WeeklyInsight
     * @example
     * // Get one WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeeklyInsightFindFirstOrThrowArgs>(args?: SelectSubset<T, WeeklyInsightFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeeklyInsights that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeeklyInsights
     * const weeklyInsights = await prisma.weeklyInsight.findMany()
     * 
     * // Get first 10 WeeklyInsights
     * const weeklyInsights = await prisma.weeklyInsight.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weeklyInsightWithIdOnly = await prisma.weeklyInsight.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeeklyInsightFindManyArgs>(args?: SelectSubset<T, WeeklyInsightFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeeklyInsight.
     * @param {WeeklyInsightCreateArgs} args - Arguments to create a WeeklyInsight.
     * @example
     * // Create one WeeklyInsight
     * const WeeklyInsight = await prisma.weeklyInsight.create({
     *   data: {
     *     // ... data to create a WeeklyInsight
     *   }
     * })
     * 
     */
    create<T extends WeeklyInsightCreateArgs>(args: SelectSubset<T, WeeklyInsightCreateArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeeklyInsights.
     * @param {WeeklyInsightCreateManyArgs} args - Arguments to create many WeeklyInsights.
     * @example
     * // Create many WeeklyInsights
     * const weeklyInsight = await prisma.weeklyInsight.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeeklyInsightCreateManyArgs>(args?: SelectSubset<T, WeeklyInsightCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeeklyInsights and returns the data saved in the database.
     * @param {WeeklyInsightCreateManyAndReturnArgs} args - Arguments to create many WeeklyInsights.
     * @example
     * // Create many WeeklyInsights
     * const weeklyInsight = await prisma.weeklyInsight.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeeklyInsights and only return the `id`
     * const weeklyInsightWithIdOnly = await prisma.weeklyInsight.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeeklyInsightCreateManyAndReturnArgs>(args?: SelectSubset<T, WeeklyInsightCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeeklyInsight.
     * @param {WeeklyInsightDeleteArgs} args - Arguments to delete one WeeklyInsight.
     * @example
     * // Delete one WeeklyInsight
     * const WeeklyInsight = await prisma.weeklyInsight.delete({
     *   where: {
     *     // ... filter to delete one WeeklyInsight
     *   }
     * })
     * 
     */
    delete<T extends WeeklyInsightDeleteArgs>(args: SelectSubset<T, WeeklyInsightDeleteArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeeklyInsight.
     * @param {WeeklyInsightUpdateArgs} args - Arguments to update one WeeklyInsight.
     * @example
     * // Update one WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeeklyInsightUpdateArgs>(args: SelectSubset<T, WeeklyInsightUpdateArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeeklyInsights.
     * @param {WeeklyInsightDeleteManyArgs} args - Arguments to filter WeeklyInsights to delete.
     * @example
     * // Delete a few WeeklyInsights
     * const { count } = await prisma.weeklyInsight.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeeklyInsightDeleteManyArgs>(args?: SelectSubset<T, WeeklyInsightDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeeklyInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeeklyInsights
     * const weeklyInsight = await prisma.weeklyInsight.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeeklyInsightUpdateManyArgs>(args: SelectSubset<T, WeeklyInsightUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeeklyInsights and returns the data updated in the database.
     * @param {WeeklyInsightUpdateManyAndReturnArgs} args - Arguments to update many WeeklyInsights.
     * @example
     * // Update many WeeklyInsights
     * const weeklyInsight = await prisma.weeklyInsight.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeeklyInsights and only return the `id`
     * const weeklyInsightWithIdOnly = await prisma.weeklyInsight.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WeeklyInsightUpdateManyAndReturnArgs>(args: SelectSubset<T, WeeklyInsightUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeeklyInsight.
     * @param {WeeklyInsightUpsertArgs} args - Arguments to update or create a WeeklyInsight.
     * @example
     * // Update or create a WeeklyInsight
     * const weeklyInsight = await prisma.weeklyInsight.upsert({
     *   create: {
     *     // ... data to create a WeeklyInsight
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeeklyInsight we want to update
     *   }
     * })
     */
    upsert<T extends WeeklyInsightUpsertArgs>(args: SelectSubset<T, WeeklyInsightUpsertArgs<ExtArgs>>): Prisma__WeeklyInsightClient<$Result.GetResult<Prisma.$WeeklyInsightPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeeklyInsights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightCountArgs} args - Arguments to filter WeeklyInsights to count.
     * @example
     * // Count the number of WeeklyInsights
     * const count = await prisma.weeklyInsight.count({
     *   where: {
     *     // ... the filter for the WeeklyInsights we want to count
     *   }
     * })
    **/
    count<T extends WeeklyInsightCountArgs>(
      args?: Subset<T, WeeklyInsightCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeeklyInsightCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeeklyInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeeklyInsightAggregateArgs>(args: Subset<T, WeeklyInsightAggregateArgs>): Prisma.PrismaPromise<GetWeeklyInsightAggregateType<T>>

    /**
     * Group by WeeklyInsight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeeklyInsightGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeeklyInsightGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeeklyInsightGroupByArgs['orderBy'] }
        : { orderBy?: WeeklyInsightGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeeklyInsightGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeeklyInsightGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeeklyInsight model
   */
  readonly fields: WeeklyInsightFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeeklyInsight.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeeklyInsightClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WeeklyInsight model
   */
  interface WeeklyInsightFieldRefs {
    readonly id: FieldRef<"WeeklyInsight", 'String'>
    readonly week: FieldRef<"WeeklyInsight", 'DateTime'>
    readonly title: FieldRef<"WeeklyInsight", 'String'>
    readonly overallStatus: FieldRef<"WeeklyInsight", 'String'>
    readonly highlights: FieldRef<"WeeklyInsight", 'Json'>
    readonly risks: FieldRef<"WeeklyInsight", 'Json'>
    readonly actionItems: FieldRef<"WeeklyInsight", 'Json'>
    readonly authorId: FieldRef<"WeeklyInsight", 'String'>
    readonly createdAt: FieldRef<"WeeklyInsight", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeeklyInsight findUnique
   */
  export type WeeklyInsightFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyInsight to fetch.
     */
    where: WeeklyInsightWhereUniqueInput
  }

  /**
   * WeeklyInsight findUniqueOrThrow
   */
  export type WeeklyInsightFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyInsight to fetch.
     */
    where: WeeklyInsightWhereUniqueInput
  }

  /**
   * WeeklyInsight findFirst
   */
  export type WeeklyInsightFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyInsight to fetch.
     */
    where?: WeeklyInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyInsights to fetch.
     */
    orderBy?: WeeklyInsightOrderByWithRelationInput | WeeklyInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeeklyInsights.
     */
    cursor?: WeeklyInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeeklyInsights.
     */
    distinct?: WeeklyInsightScalarFieldEnum | WeeklyInsightScalarFieldEnum[]
  }

  /**
   * WeeklyInsight findFirstOrThrow
   */
  export type WeeklyInsightFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyInsight to fetch.
     */
    where?: WeeklyInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyInsights to fetch.
     */
    orderBy?: WeeklyInsightOrderByWithRelationInput | WeeklyInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeeklyInsights.
     */
    cursor?: WeeklyInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeeklyInsights.
     */
    distinct?: WeeklyInsightScalarFieldEnum | WeeklyInsightScalarFieldEnum[]
  }

  /**
   * WeeklyInsight findMany
   */
  export type WeeklyInsightFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter, which WeeklyInsights to fetch.
     */
    where?: WeeklyInsightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeeklyInsights to fetch.
     */
    orderBy?: WeeklyInsightOrderByWithRelationInput | WeeklyInsightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeeklyInsights.
     */
    cursor?: WeeklyInsightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeeklyInsights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeeklyInsights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeeklyInsights.
     */
    distinct?: WeeklyInsightScalarFieldEnum | WeeklyInsightScalarFieldEnum[]
  }

  /**
   * WeeklyInsight create
   */
  export type WeeklyInsightCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * The data needed to create a WeeklyInsight.
     */
    data: XOR<WeeklyInsightCreateInput, WeeklyInsightUncheckedCreateInput>
  }

  /**
   * WeeklyInsight createMany
   */
  export type WeeklyInsightCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeeklyInsights.
     */
    data: WeeklyInsightCreateManyInput | WeeklyInsightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeeklyInsight createManyAndReturn
   */
  export type WeeklyInsightCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * The data used to create many WeeklyInsights.
     */
    data: WeeklyInsightCreateManyInput | WeeklyInsightCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeeklyInsight update
   */
  export type WeeklyInsightUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * The data needed to update a WeeklyInsight.
     */
    data: XOR<WeeklyInsightUpdateInput, WeeklyInsightUncheckedUpdateInput>
    /**
     * Choose, which WeeklyInsight to update.
     */
    where: WeeklyInsightWhereUniqueInput
  }

  /**
   * WeeklyInsight updateMany
   */
  export type WeeklyInsightUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeeklyInsights.
     */
    data: XOR<WeeklyInsightUpdateManyMutationInput, WeeklyInsightUncheckedUpdateManyInput>
    /**
     * Filter which WeeklyInsights to update
     */
    where?: WeeklyInsightWhereInput
    /**
     * Limit how many WeeklyInsights to update.
     */
    limit?: number
  }

  /**
   * WeeklyInsight updateManyAndReturn
   */
  export type WeeklyInsightUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * The data used to update WeeklyInsights.
     */
    data: XOR<WeeklyInsightUpdateManyMutationInput, WeeklyInsightUncheckedUpdateManyInput>
    /**
     * Filter which WeeklyInsights to update
     */
    where?: WeeklyInsightWhereInput
    /**
     * Limit how many WeeklyInsights to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeeklyInsight upsert
   */
  export type WeeklyInsightUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * The filter to search for the WeeklyInsight to update in case it exists.
     */
    where: WeeklyInsightWhereUniqueInput
    /**
     * In case the WeeklyInsight found by the `where` argument doesn't exist, create a new WeeklyInsight with this data.
     */
    create: XOR<WeeklyInsightCreateInput, WeeklyInsightUncheckedCreateInput>
    /**
     * In case the WeeklyInsight was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeeklyInsightUpdateInput, WeeklyInsightUncheckedUpdateInput>
  }

  /**
   * WeeklyInsight delete
   */
  export type WeeklyInsightDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
    /**
     * Filter which WeeklyInsight to delete.
     */
    where: WeeklyInsightWhereUniqueInput
  }

  /**
   * WeeklyInsight deleteMany
   */
  export type WeeklyInsightDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeeklyInsights to delete
     */
    where?: WeeklyInsightWhereInput
    /**
     * Limit how many WeeklyInsights to delete.
     */
    limit?: number
  }

  /**
   * WeeklyInsight without action
   */
  export type WeeklyInsightDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeeklyInsight
     */
    select?: WeeklyInsightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeeklyInsight
     */
    omit?: WeeklyInsightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeeklyInsightInclude<ExtArgs> | null
  }


  /**
   * Model Snapshot
   */

  export type AggregateSnapshot = {
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  export type SnapshotMinAggregateOutputType = {
    id: string | null
    snapshotDate: Date | null
    createdAt: Date | null
  }

  export type SnapshotMaxAggregateOutputType = {
    id: string | null
    snapshotDate: Date | null
    createdAt: Date | null
  }

  export type SnapshotCountAggregateOutputType = {
    id: number
    snapshotDate: number
    payload: number
    createdAt: number
    _all: number
  }


  export type SnapshotMinAggregateInputType = {
    id?: true
    snapshotDate?: true
    createdAt?: true
  }

  export type SnapshotMaxAggregateInputType = {
    id?: true
    snapshotDate?: true
    createdAt?: true
  }

  export type SnapshotCountAggregateInputType = {
    id?: true
    snapshotDate?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type SnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshot to aggregate.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Snapshots
    **/
    _count?: true | SnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapshotMaxAggregateInputType
  }

  export type GetSnapshotAggregateType<T extends SnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapshot[P]>
      : GetScalarType<T[P], AggregateSnapshot[P]>
  }




  export type SnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotWhereInput
    orderBy?: SnapshotOrderByWithAggregationInput | SnapshotOrderByWithAggregationInput[]
    by: SnapshotScalarFieldEnum[] | SnapshotScalarFieldEnum
    having?: SnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapshotCountAggregateInputType | true
    _min?: SnapshotMinAggregateInputType
    _max?: SnapshotMaxAggregateInputType
  }

  export type SnapshotGroupByOutputType = {
    id: string
    snapshotDate: Date
    payload: JsonValue
    createdAt: Date
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  type GetSnapshotGroupByPayload<T extends SnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotDate?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotDate?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotDate?: boolean
    payload?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectScalar = {
    id?: boolean
    snapshotDate?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type SnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotDate" | "payload" | "createdAt", ExtArgs["result"]["snapshot"]>

  export type $SnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Snapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      snapshotDate: Date
      payload: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["snapshot"]>
    composites: {}
  }

  type SnapshotGetPayload<S extends boolean | null | undefined | SnapshotDefaultArgs> = $Result.GetResult<Prisma.$SnapshotPayload, S>

  type SnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnapshotCountAggregateInputType | true
    }

  export interface SnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Snapshot'], meta: { name: 'Snapshot' } }
    /**
     * Find zero or one Snapshot that matches the filter.
     * @param {SnapshotFindUniqueArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapshotFindUniqueArgs>(args: SelectSubset<T, SnapshotFindUniqueArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Snapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnapshotFindUniqueOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Snapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapshotFindFirstArgs>(args?: SelectSubset<T, SnapshotFindFirstArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Snapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Snapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Snapshots
     * const snapshots = await prisma.snapshot.findMany()
     * 
     * // Get first 10 Snapshots
     * const snapshots = await prisma.snapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapshotFindManyArgs>(args?: SelectSubset<T, SnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Snapshot.
     * @param {SnapshotCreateArgs} args - Arguments to create a Snapshot.
     * @example
     * // Create one Snapshot
     * const Snapshot = await prisma.snapshot.create({
     *   data: {
     *     // ... data to create a Snapshot
     *   }
     * })
     * 
     */
    create<T extends SnapshotCreateArgs>(args: SelectSubset<T, SnapshotCreateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Snapshots.
     * @param {SnapshotCreateManyArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapshotCreateManyArgs>(args?: SelectSubset<T, SnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Snapshots and returns the data saved in the database.
     * @param {SnapshotCreateManyAndReturnArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Snapshots and only return the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Snapshot.
     * @param {SnapshotDeleteArgs} args - Arguments to delete one Snapshot.
     * @example
     * // Delete one Snapshot
     * const Snapshot = await prisma.snapshot.delete({
     *   where: {
     *     // ... filter to delete one Snapshot
     *   }
     * })
     * 
     */
    delete<T extends SnapshotDeleteArgs>(args: SelectSubset<T, SnapshotDeleteArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Snapshot.
     * @param {SnapshotUpdateArgs} args - Arguments to update one Snapshot.
     * @example
     * // Update one Snapshot
     * const snapshot = await prisma.snapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapshotUpdateArgs>(args: SelectSubset<T, SnapshotUpdateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Snapshots.
     * @param {SnapshotDeleteManyArgs} args - Arguments to filter Snapshots to delete.
     * @example
     * // Delete a few Snapshots
     * const { count } = await prisma.snapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapshotDeleteManyArgs>(args?: SelectSubset<T, SnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Snapshots
     * const snapshot = await prisma.snapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapshotUpdateManyArgs>(args: SelectSubset<T, SnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snapshots and returns the data updated in the database.
     * @param {SnapshotUpdateManyAndReturnArgs} args - Arguments to update many Snapshots.
     * @example
     * // Update many Snapshots
     * const snapshot = await prisma.snapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Snapshots and only return the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, SnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Snapshot.
     * @param {SnapshotUpsertArgs} args - Arguments to update or create a Snapshot.
     * @example
     * // Update or create a Snapshot
     * const snapshot = await prisma.snapshot.upsert({
     *   create: {
     *     // ... data to create a Snapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Snapshot we want to update
     *   }
     * })
     */
    upsert<T extends SnapshotUpsertArgs>(args: SelectSubset<T, SnapshotUpsertArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotCountArgs} args - Arguments to filter Snapshots to count.
     * @example
     * // Count the number of Snapshots
     * const count = await prisma.snapshot.count({
     *   where: {
     *     // ... the filter for the Snapshots we want to count
     *   }
     * })
    **/
    count<T extends SnapshotCountArgs>(
      args?: Subset<T, SnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SnapshotAggregateArgs>(args: Subset<T, SnapshotAggregateArgs>): Prisma.PrismaPromise<GetSnapshotAggregateType<T>>

    /**
     * Group by Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Snapshot model
   */
  readonly fields: SnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Snapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Snapshot model
   */
  interface SnapshotFieldRefs {
    readonly id: FieldRef<"Snapshot", 'String'>
    readonly snapshotDate: FieldRef<"Snapshot", 'DateTime'>
    readonly payload: FieldRef<"Snapshot", 'Json'>
    readonly createdAt: FieldRef<"Snapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Snapshot findUnique
   */
  export type SnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findUniqueOrThrow
   */
  export type SnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findFirst
   */
  export type SnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findFirstOrThrow
   */
  export type SnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findMany
   */
  export type SnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter, which Snapshots to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot create
   */
  export type SnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a Snapshot.
     */
    data: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
  }

  /**
   * Snapshot createMany
   */
  export type SnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Snapshot createManyAndReturn
   */
  export type SnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Snapshot update
   */
  export type SnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a Snapshot.
     */
    data: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
    /**
     * Choose, which Snapshot to update.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot updateMany
   */
  export type SnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Snapshots.
     */
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyInput>
    /**
     * Filter which Snapshots to update
     */
    where?: SnapshotWhereInput
    /**
     * Limit how many Snapshots to update.
     */
    limit?: number
  }

  /**
   * Snapshot updateManyAndReturn
   */
  export type SnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * The data used to update Snapshots.
     */
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyInput>
    /**
     * Filter which Snapshots to update
     */
    where?: SnapshotWhereInput
    /**
     * Limit how many Snapshots to update.
     */
    limit?: number
  }

  /**
   * Snapshot upsert
   */
  export type SnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the Snapshot to update in case it exists.
     */
    where: SnapshotWhereUniqueInput
    /**
     * In case the Snapshot found by the `where` argument doesn't exist, create a new Snapshot with this data.
     */
    create: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
    /**
     * In case the Snapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
  }

  /**
   * Snapshot delete
   */
  export type SnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
    /**
     * Filter which Snapshot to delete.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot deleteMany
   */
  export type SnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshots to delete
     */
    where?: SnapshotWhereInput
    /**
     * Limit how many Snapshots to delete.
     */
    limit?: number
  }

  /**
   * Snapshot without action
   */
  export type SnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snapshot
     */
    omit?: SnapshotOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    platform: 'platform',
    genre: 'genre',
    status: 'status',
    color: 'color',
    createdAt: 'createdAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const MemberScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    role: 'role',
    avatarColor: 'avatarColor',
    initials: 'initials',
    joinedAt: 'joinedAt',
    password: 'password'
  };

  export type MemberScalarFieldEnum = (typeof MemberScalarFieldEnum)[keyof typeof MemberScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    projectId: 'projectId',
    assigneeId: 'assigneeId',
    status: 'status',
    priority: 'priority',
    weight: 'weight',
    deadline: 'deadline',
    createdAt: 'createdAt',
    completedAt: 'completedAt',
    eisenhowerUrgent: 'eisenhowerUrgent',
    eisenhowerImportant: 'eisenhowerImportant',
    eisenhowerAutoClassified: 'eisenhowerAutoClassified',
    tags: 'tags'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const StatusConfigScalarFieldEnum: {
    id: 'id',
    label: 'label',
    color: 'color',
    order: 'order'
  };

  export type StatusConfigScalarFieldEnum = (typeof StatusConfigScalarFieldEnum)[keyof typeof StatusConfigScalarFieldEnum]


  export const PriorityConfigScalarFieldEnum: {
    id: 'id',
    label: 'label',
    color: 'color',
    defaultWeight: 'defaultWeight'
  };

  export type PriorityConfigScalarFieldEnum = (typeof PriorityConfigScalarFieldEnum)[keyof typeof PriorityConfigScalarFieldEnum]


  export const GameScorecardScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    week: 'week',
    ratingsCoreLoop: 'ratingsCoreLoop',
    ratingsMonetization: 'ratingsMonetization',
    ratingsVisualUx: 'ratingsVisualUx',
    ratingsRetention: 'ratingsRetention',
    ratingsUsp: 'ratingsUsp',
    summary: 'summary',
    authorId: 'authorId',
    createdAt: 'createdAt'
  };

  export type GameScorecardScalarFieldEnum = (typeof GameScorecardScalarFieldEnum)[keyof typeof GameScorecardScalarFieldEnum]


  export const WeeklyInsightScalarFieldEnum: {
    id: 'id',
    week: 'week',
    title: 'title',
    overallStatus: 'overallStatus',
    highlights: 'highlights',
    risks: 'risks',
    actionItems: 'actionItems',
    authorId: 'authorId',
    createdAt: 'createdAt'
  };

  export type WeeklyInsightScalarFieldEnum = (typeof WeeklyInsightScalarFieldEnum)[keyof typeof WeeklyInsightScalarFieldEnum]


  export const SnapshotScalarFieldEnum: {
    id: 'id',
    snapshotDate: 'snapshotDate',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type SnapshotScalarFieldEnum = (typeof SnapshotScalarFieldEnum)[keyof typeof SnapshotScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'Priority'
   */
  export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>
    


  /**
   * Reference to a field of type 'Priority[]'
   */
  export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    platform?: StringFilter<"Project"> | string
    genre?: StringFilter<"Project"> | string
    status?: StringFilter<"Project"> | string
    color?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    tasks?: TaskListRelationFilter
    scorecards?: GameScorecardListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    genre?: SortOrder
    status?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    tasks?: TaskOrderByRelationAggregateInput
    scorecards?: GameScorecardOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    platform?: StringFilter<"Project"> | string
    genre?: StringFilter<"Project"> | string
    status?: StringFilter<"Project"> | string
    color?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    tasks?: TaskListRelationFilter
    scorecards?: GameScorecardListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    genre?: SortOrder
    status?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    platform?: StringWithAggregatesFilter<"Project"> | string
    genre?: StringWithAggregatesFilter<"Project"> | string
    status?: StringWithAggregatesFilter<"Project"> | string
    color?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type MemberWhereInput = {
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    id?: StringFilter<"Member"> | string
    name?: StringFilter<"Member"> | string
    email?: StringFilter<"Member"> | string
    role?: StringFilter<"Member"> | string
    avatarColor?: StringFilter<"Member"> | string
    initials?: StringFilter<"Member"> | string
    joinedAt?: DateTimeFilter<"Member"> | Date | string
    password?: StringFilter<"Member"> | string
    tasks?: TaskListRelationFilter
    scorecards?: GameScorecardListRelationFilter
    insights?: WeeklyInsightListRelationFilter
  }

  export type MemberOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    avatarColor?: SortOrder
    initials?: SortOrder
    joinedAt?: SortOrder
    password?: SortOrder
    tasks?: TaskOrderByRelationAggregateInput
    scorecards?: GameScorecardOrderByRelationAggregateInput
    insights?: WeeklyInsightOrderByRelationAggregateInput
  }

  export type MemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    name?: StringFilter<"Member"> | string
    role?: StringFilter<"Member"> | string
    avatarColor?: StringFilter<"Member"> | string
    initials?: StringFilter<"Member"> | string
    joinedAt?: DateTimeFilter<"Member"> | Date | string
    password?: StringFilter<"Member"> | string
    tasks?: TaskListRelationFilter
    scorecards?: GameScorecardListRelationFilter
    insights?: WeeklyInsightListRelationFilter
  }, "id" | "email">

  export type MemberOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    avatarColor?: SortOrder
    initials?: SortOrder
    joinedAt?: SortOrder
    password?: SortOrder
    _count?: MemberCountOrderByAggregateInput
    _max?: MemberMaxOrderByAggregateInput
    _min?: MemberMinOrderByAggregateInput
  }

  export type MemberScalarWhereWithAggregatesInput = {
    AND?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    OR?: MemberScalarWhereWithAggregatesInput[]
    NOT?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Member"> | string
    name?: StringWithAggregatesFilter<"Member"> | string
    email?: StringWithAggregatesFilter<"Member"> | string
    role?: StringWithAggregatesFilter<"Member"> | string
    avatarColor?: StringWithAggregatesFilter<"Member"> | string
    initials?: StringWithAggregatesFilter<"Member"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"Member"> | Date | string
    password?: StringWithAggregatesFilter<"Member"> | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    projectId?: StringFilter<"Task"> | string
    assigneeId?: StringFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    weight?: IntFilter<"Task"> | number
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    eisenhowerUrgent?: BoolFilter<"Task"> | boolean
    eisenhowerImportant?: BoolFilter<"Task"> | boolean
    eisenhowerAutoClassified?: BoolFilter<"Task"> | boolean
    tags?: JsonNullableFilter<"Task">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    assignee?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    assigneeId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    weight?: SortOrder
    deadline?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    eisenhowerUrgent?: SortOrder
    eisenhowerImportant?: SortOrder
    eisenhowerAutoClassified?: SortOrder
    tags?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    assignee?: MemberOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    projectId?: StringFilter<"Task"> | string
    assigneeId?: StringFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    weight?: IntFilter<"Task"> | number
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    eisenhowerUrgent?: BoolFilter<"Task"> | boolean
    eisenhowerImportant?: BoolFilter<"Task"> | boolean
    eisenhowerAutoClassified?: BoolFilter<"Task"> | boolean
    tags?: JsonNullableFilter<"Task">
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    assignee?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    assigneeId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    weight?: SortOrder
    deadline?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    eisenhowerUrgent?: SortOrder
    eisenhowerImportant?: SortOrder
    eisenhowerAutoClassified?: SortOrder
    tags?: SortOrderInput | SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringWithAggregatesFilter<"Task"> | string
    projectId?: StringWithAggregatesFilter<"Task"> | string
    assigneeId?: StringWithAggregatesFilter<"Task"> | string
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityWithAggregatesFilter<"Task"> | $Enums.Priority
    weight?: IntWithAggregatesFilter<"Task"> | number
    deadline?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    eisenhowerUrgent?: BoolWithAggregatesFilter<"Task"> | boolean
    eisenhowerImportant?: BoolWithAggregatesFilter<"Task"> | boolean
    eisenhowerAutoClassified?: BoolWithAggregatesFilter<"Task"> | boolean
    tags?: JsonNullableWithAggregatesFilter<"Task">
  }

  export type StatusConfigWhereInput = {
    AND?: StatusConfigWhereInput | StatusConfigWhereInput[]
    OR?: StatusConfigWhereInput[]
    NOT?: StatusConfigWhereInput | StatusConfigWhereInput[]
    id?: EnumTaskStatusFilter<"StatusConfig"> | $Enums.TaskStatus
    label?: StringFilter<"StatusConfig"> | string
    color?: StringFilter<"StatusConfig"> | string
    order?: IntFilter<"StatusConfig"> | number
  }

  export type StatusConfigOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    order?: SortOrder
  }

  export type StatusConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: $Enums.TaskStatus
    AND?: StatusConfigWhereInput | StatusConfigWhereInput[]
    OR?: StatusConfigWhereInput[]
    NOT?: StatusConfigWhereInput | StatusConfigWhereInput[]
    label?: StringFilter<"StatusConfig"> | string
    color?: StringFilter<"StatusConfig"> | string
    order?: IntFilter<"StatusConfig"> | number
  }, "id">

  export type StatusConfigOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    order?: SortOrder
    _count?: StatusConfigCountOrderByAggregateInput
    _avg?: StatusConfigAvgOrderByAggregateInput
    _max?: StatusConfigMaxOrderByAggregateInput
    _min?: StatusConfigMinOrderByAggregateInput
    _sum?: StatusConfigSumOrderByAggregateInput
  }

  export type StatusConfigScalarWhereWithAggregatesInput = {
    AND?: StatusConfigScalarWhereWithAggregatesInput | StatusConfigScalarWhereWithAggregatesInput[]
    OR?: StatusConfigScalarWhereWithAggregatesInput[]
    NOT?: StatusConfigScalarWhereWithAggregatesInput | StatusConfigScalarWhereWithAggregatesInput[]
    id?: EnumTaskStatusWithAggregatesFilter<"StatusConfig"> | $Enums.TaskStatus
    label?: StringWithAggregatesFilter<"StatusConfig"> | string
    color?: StringWithAggregatesFilter<"StatusConfig"> | string
    order?: IntWithAggregatesFilter<"StatusConfig"> | number
  }

  export type PriorityConfigWhereInput = {
    AND?: PriorityConfigWhereInput | PriorityConfigWhereInput[]
    OR?: PriorityConfigWhereInput[]
    NOT?: PriorityConfigWhereInput | PriorityConfigWhereInput[]
    id?: EnumPriorityFilter<"PriorityConfig"> | $Enums.Priority
    label?: StringFilter<"PriorityConfig"> | string
    color?: StringFilter<"PriorityConfig"> | string
    defaultWeight?: IntFilter<"PriorityConfig"> | number
  }

  export type PriorityConfigOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    defaultWeight?: SortOrder
  }

  export type PriorityConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: $Enums.Priority
    AND?: PriorityConfigWhereInput | PriorityConfigWhereInput[]
    OR?: PriorityConfigWhereInput[]
    NOT?: PriorityConfigWhereInput | PriorityConfigWhereInput[]
    label?: StringFilter<"PriorityConfig"> | string
    color?: StringFilter<"PriorityConfig"> | string
    defaultWeight?: IntFilter<"PriorityConfig"> | number
  }, "id">

  export type PriorityConfigOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    defaultWeight?: SortOrder
    _count?: PriorityConfigCountOrderByAggregateInput
    _avg?: PriorityConfigAvgOrderByAggregateInput
    _max?: PriorityConfigMaxOrderByAggregateInput
    _min?: PriorityConfigMinOrderByAggregateInput
    _sum?: PriorityConfigSumOrderByAggregateInput
  }

  export type PriorityConfigScalarWhereWithAggregatesInput = {
    AND?: PriorityConfigScalarWhereWithAggregatesInput | PriorityConfigScalarWhereWithAggregatesInput[]
    OR?: PriorityConfigScalarWhereWithAggregatesInput[]
    NOT?: PriorityConfigScalarWhereWithAggregatesInput | PriorityConfigScalarWhereWithAggregatesInput[]
    id?: EnumPriorityWithAggregatesFilter<"PriorityConfig"> | $Enums.Priority
    label?: StringWithAggregatesFilter<"PriorityConfig"> | string
    color?: StringWithAggregatesFilter<"PriorityConfig"> | string
    defaultWeight?: IntWithAggregatesFilter<"PriorityConfig"> | number
  }

  export type GameScorecardWhereInput = {
    AND?: GameScorecardWhereInput | GameScorecardWhereInput[]
    OR?: GameScorecardWhereInput[]
    NOT?: GameScorecardWhereInput | GameScorecardWhereInput[]
    id?: StringFilter<"GameScorecard"> | string
    projectId?: StringFilter<"GameScorecard"> | string
    week?: DateTimeFilter<"GameScorecard"> | Date | string
    ratingsCoreLoop?: IntFilter<"GameScorecard"> | number
    ratingsMonetization?: IntFilter<"GameScorecard"> | number
    ratingsVisualUx?: IntFilter<"GameScorecard"> | number
    ratingsRetention?: IntFilter<"GameScorecard"> | number
    ratingsUsp?: IntFilter<"GameScorecard"> | number
    summary?: StringFilter<"GameScorecard"> | string
    authorId?: StringFilter<"GameScorecard"> | string
    createdAt?: DateTimeFilter<"GameScorecard"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }

  export type GameScorecardOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    week?: SortOrder
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
    summary?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    author?: MemberOrderByWithRelationInput
  }

  export type GameScorecardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameScorecardWhereInput | GameScorecardWhereInput[]
    OR?: GameScorecardWhereInput[]
    NOT?: GameScorecardWhereInput | GameScorecardWhereInput[]
    projectId?: StringFilter<"GameScorecard"> | string
    week?: DateTimeFilter<"GameScorecard"> | Date | string
    ratingsCoreLoop?: IntFilter<"GameScorecard"> | number
    ratingsMonetization?: IntFilter<"GameScorecard"> | number
    ratingsVisualUx?: IntFilter<"GameScorecard"> | number
    ratingsRetention?: IntFilter<"GameScorecard"> | number
    ratingsUsp?: IntFilter<"GameScorecard"> | number
    summary?: StringFilter<"GameScorecard"> | string
    authorId?: StringFilter<"GameScorecard"> | string
    createdAt?: DateTimeFilter<"GameScorecard"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }, "id">

  export type GameScorecardOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    week?: SortOrder
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
    summary?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    _count?: GameScorecardCountOrderByAggregateInput
    _avg?: GameScorecardAvgOrderByAggregateInput
    _max?: GameScorecardMaxOrderByAggregateInput
    _min?: GameScorecardMinOrderByAggregateInput
    _sum?: GameScorecardSumOrderByAggregateInput
  }

  export type GameScorecardScalarWhereWithAggregatesInput = {
    AND?: GameScorecardScalarWhereWithAggregatesInput | GameScorecardScalarWhereWithAggregatesInput[]
    OR?: GameScorecardScalarWhereWithAggregatesInput[]
    NOT?: GameScorecardScalarWhereWithAggregatesInput | GameScorecardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameScorecard"> | string
    projectId?: StringWithAggregatesFilter<"GameScorecard"> | string
    week?: DateTimeWithAggregatesFilter<"GameScorecard"> | Date | string
    ratingsCoreLoop?: IntWithAggregatesFilter<"GameScorecard"> | number
    ratingsMonetization?: IntWithAggregatesFilter<"GameScorecard"> | number
    ratingsVisualUx?: IntWithAggregatesFilter<"GameScorecard"> | number
    ratingsRetention?: IntWithAggregatesFilter<"GameScorecard"> | number
    ratingsUsp?: IntWithAggregatesFilter<"GameScorecard"> | number
    summary?: StringWithAggregatesFilter<"GameScorecard"> | string
    authorId?: StringWithAggregatesFilter<"GameScorecard"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GameScorecard"> | Date | string
  }

  export type WeeklyInsightWhereInput = {
    AND?: WeeklyInsightWhereInput | WeeklyInsightWhereInput[]
    OR?: WeeklyInsightWhereInput[]
    NOT?: WeeklyInsightWhereInput | WeeklyInsightWhereInput[]
    id?: StringFilter<"WeeklyInsight"> | string
    week?: DateTimeFilter<"WeeklyInsight"> | Date | string
    title?: StringFilter<"WeeklyInsight"> | string
    overallStatus?: StringFilter<"WeeklyInsight"> | string
    highlights?: JsonNullableFilter<"WeeklyInsight">
    risks?: JsonNullableFilter<"WeeklyInsight">
    actionItems?: JsonNullableFilter<"WeeklyInsight">
    authorId?: StringFilter<"WeeklyInsight"> | string
    createdAt?: DateTimeFilter<"WeeklyInsight"> | Date | string
    author?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }

  export type WeeklyInsightOrderByWithRelationInput = {
    id?: SortOrder
    week?: SortOrder
    title?: SortOrder
    overallStatus?: SortOrder
    highlights?: SortOrderInput | SortOrder
    risks?: SortOrderInput | SortOrder
    actionItems?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    author?: MemberOrderByWithRelationInput
  }

  export type WeeklyInsightWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WeeklyInsightWhereInput | WeeklyInsightWhereInput[]
    OR?: WeeklyInsightWhereInput[]
    NOT?: WeeklyInsightWhereInput | WeeklyInsightWhereInput[]
    week?: DateTimeFilter<"WeeklyInsight"> | Date | string
    title?: StringFilter<"WeeklyInsight"> | string
    overallStatus?: StringFilter<"WeeklyInsight"> | string
    highlights?: JsonNullableFilter<"WeeklyInsight">
    risks?: JsonNullableFilter<"WeeklyInsight">
    actionItems?: JsonNullableFilter<"WeeklyInsight">
    authorId?: StringFilter<"WeeklyInsight"> | string
    createdAt?: DateTimeFilter<"WeeklyInsight"> | Date | string
    author?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }, "id">

  export type WeeklyInsightOrderByWithAggregationInput = {
    id?: SortOrder
    week?: SortOrder
    title?: SortOrder
    overallStatus?: SortOrder
    highlights?: SortOrderInput | SortOrder
    risks?: SortOrderInput | SortOrder
    actionItems?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    _count?: WeeklyInsightCountOrderByAggregateInput
    _max?: WeeklyInsightMaxOrderByAggregateInput
    _min?: WeeklyInsightMinOrderByAggregateInput
  }

  export type WeeklyInsightScalarWhereWithAggregatesInput = {
    AND?: WeeklyInsightScalarWhereWithAggregatesInput | WeeklyInsightScalarWhereWithAggregatesInput[]
    OR?: WeeklyInsightScalarWhereWithAggregatesInput[]
    NOT?: WeeklyInsightScalarWhereWithAggregatesInput | WeeklyInsightScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeeklyInsight"> | string
    week?: DateTimeWithAggregatesFilter<"WeeklyInsight"> | Date | string
    title?: StringWithAggregatesFilter<"WeeklyInsight"> | string
    overallStatus?: StringWithAggregatesFilter<"WeeklyInsight"> | string
    highlights?: JsonNullableWithAggregatesFilter<"WeeklyInsight">
    risks?: JsonNullableWithAggregatesFilter<"WeeklyInsight">
    actionItems?: JsonNullableWithAggregatesFilter<"WeeklyInsight">
    authorId?: StringWithAggregatesFilter<"WeeklyInsight"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WeeklyInsight"> | Date | string
  }

  export type SnapshotWhereInput = {
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    id?: StringFilter<"Snapshot"> | string
    snapshotDate?: DateTimeFilter<"Snapshot"> | Date | string
    payload?: JsonFilter<"Snapshot">
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
  }

  export type SnapshotOrderByWithRelationInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type SnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    snapshotDate?: Date | string
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    payload?: JsonFilter<"Snapshot">
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
  }, "id" | "snapshotDate">

  export type SnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    _count?: SnapshotCountOrderByAggregateInput
    _max?: SnapshotMaxOrderByAggregateInput
    _min?: SnapshotMinOrderByAggregateInput
  }

  export type SnapshotScalarWhereWithAggregatesInput = {
    AND?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    OR?: SnapshotScalarWhereWithAggregatesInput[]
    NOT?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Snapshot"> | string
    snapshotDate?: DateTimeWithAggregatesFilter<"Snapshot"> | Date | string
    payload?: JsonWithAggregatesFilter<"Snapshot">
    createdAt?: DateTimeWithAggregatesFilter<"Snapshot"> | Date | string
  }

  export type ProjectCreateInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    tasks?: TaskCreateNestedManyWithoutProjectInput
    scorecards?: GameScorecardCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    scorecards?: GameScorecardUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    scorecards?: GameScorecardUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    scorecards?: GameScorecardUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberCreateInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskCreateNestedManyWithoutAssigneeInput
    scorecards?: GameScorecardCreateNestedManyWithoutAuthorInput
    insights?: WeeklyInsightCreateNestedManyWithoutAuthorInput
  }

  export type MemberUncheckedCreateInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    scorecards?: GameScorecardUncheckedCreateNestedManyWithoutAuthorInput
    insights?: WeeklyInsightUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type MemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUpdateManyWithoutAssigneeNestedInput
    scorecards?: GameScorecardUpdateManyWithoutAuthorNestedInput
    insights?: WeeklyInsightUpdateManyWithoutAuthorNestedInput
  }

  export type MemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    scorecards?: GameScorecardUncheckedUpdateManyWithoutAuthorNestedInput
    insights?: WeeklyInsightUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type MemberCreateManyInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
  }

  export type MemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type MemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateInput = {
    id: string
    title: string
    description: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutTasksInput
    assignee: MemberCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id: string
    title: string
    description: string
    projectId: string
    assigneeId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    assignee?: MemberUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    assigneeId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskCreateManyInput = {
    id: string
    title: string
    description: string
    projectId: string
    assigneeId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    assigneeId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StatusConfigCreateInput = {
    id: $Enums.TaskStatus
    label: string
    color: string
    order: number
  }

  export type StatusConfigUncheckedCreateInput = {
    id: $Enums.TaskStatus
    label: string
    color: string
    order: number
  }

  export type StatusConfigUpdateInput = {
    id?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type StatusConfigUncheckedUpdateInput = {
    id?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type StatusConfigCreateManyInput = {
    id: $Enums.TaskStatus
    label: string
    color: string
    order: number
  }

  export type StatusConfigUpdateManyMutationInput = {
    id?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type StatusConfigUncheckedUpdateManyInput = {
    id?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PriorityConfigCreateInput = {
    id: $Enums.Priority
    label: string
    color: string
    defaultWeight: number
  }

  export type PriorityConfigUncheckedCreateInput = {
    id: $Enums.Priority
    label: string
    color: string
    defaultWeight: number
  }

  export type PriorityConfigUpdateInput = {
    id?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    defaultWeight?: IntFieldUpdateOperationsInput | number
  }

  export type PriorityConfigUncheckedUpdateInput = {
    id?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    defaultWeight?: IntFieldUpdateOperationsInput | number
  }

  export type PriorityConfigCreateManyInput = {
    id: $Enums.Priority
    label: string
    color: string
    defaultWeight: number
  }

  export type PriorityConfigUpdateManyMutationInput = {
    id?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    defaultWeight?: IntFieldUpdateOperationsInput | number
  }

  export type PriorityConfigUncheckedUpdateManyInput = {
    id?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    label?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    defaultWeight?: IntFieldUpdateOperationsInput | number
  }

  export type GameScorecardCreateInput = {
    id: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    createdAt: Date | string
    project: ProjectCreateNestedOneWithoutScorecardsInput
    author: MemberCreateNestedOneWithoutScorecardsInput
  }

  export type GameScorecardUncheckedCreateInput = {
    id: string
    projectId: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    authorId: string
    createdAt: Date | string
  }

  export type GameScorecardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutScorecardsNestedInput
    author?: MemberUpdateOneRequiredWithoutScorecardsNestedInput
  }

  export type GameScorecardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScorecardCreateManyInput = {
    id: string
    projectId: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    authorId: string
    createdAt: Date | string
  }

  export type GameScorecardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScorecardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightCreateInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt: Date | string
    author: MemberCreateNestedOneWithoutInsightsInput
  }

  export type WeeklyInsightUncheckedCreateInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    authorId: string
    createdAt: Date | string
  }

  export type WeeklyInsightUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: MemberUpdateOneRequiredWithoutInsightsNestedInput
  }

  export type WeeklyInsightUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightCreateManyInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    authorId: string
    createdAt: Date | string
  }

  export type WeeklyInsightUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotCreateInput = {
    id?: string
    snapshotDate: Date | string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SnapshotUncheckedCreateInput = {
    id?: string
    snapshotDate: Date | string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotCreateManyInput = {
    id?: string
    snapshotDate: Date | string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type GameScorecardListRelationFilter = {
    every?: GameScorecardWhereInput
    some?: GameScorecardWhereInput
    none?: GameScorecardWhereInput
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameScorecardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    genre?: SortOrder
    status?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    genre?: SortOrder
    status?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    genre?: SortOrder
    status?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type WeeklyInsightListRelationFilter = {
    every?: WeeklyInsightWhereInput
    some?: WeeklyInsightWhereInput
    none?: WeeklyInsightWhereInput
  }

  export type WeeklyInsightOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MemberCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    avatarColor?: SortOrder
    initials?: SortOrder
    joinedAt?: SortOrder
    password?: SortOrder
  }

  export type MemberMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    avatarColor?: SortOrder
    initials?: SortOrder
    joinedAt?: SortOrder
    password?: SortOrder
  }

  export type MemberMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    avatarColor?: SortOrder
    initials?: SortOrder
    joinedAt?: SortOrder
    password?: SortOrder
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type EnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type MemberScalarRelationFilter = {
    is?: MemberWhereInput
    isNot?: MemberWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    assigneeId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    weight?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    eisenhowerUrgent?: SortOrder
    eisenhowerImportant?: SortOrder
    eisenhowerAutoClassified?: SortOrder
    tags?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    weight?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    assigneeId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    weight?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    eisenhowerUrgent?: SortOrder
    eisenhowerImportant?: SortOrder
    eisenhowerAutoClassified?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    assigneeId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    weight?: SortOrder
    deadline?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    eisenhowerUrgent?: SortOrder
    eisenhowerImportant?: SortOrder
    eisenhowerAutoClassified?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    weight?: SortOrder
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type EnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StatusConfigCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    order?: SortOrder
  }

  export type StatusConfigAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type StatusConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    order?: SortOrder
  }

  export type StatusConfigMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    order?: SortOrder
  }

  export type StatusConfigSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PriorityConfigCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    defaultWeight?: SortOrder
  }

  export type PriorityConfigAvgOrderByAggregateInput = {
    defaultWeight?: SortOrder
  }

  export type PriorityConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    defaultWeight?: SortOrder
  }

  export type PriorityConfigMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    color?: SortOrder
    defaultWeight?: SortOrder
  }

  export type PriorityConfigSumOrderByAggregateInput = {
    defaultWeight?: SortOrder
  }

  export type GameScorecardCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    week?: SortOrder
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
    summary?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScorecardAvgOrderByAggregateInput = {
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
  }

  export type GameScorecardMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    week?: SortOrder
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
    summary?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScorecardMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    week?: SortOrder
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
    summary?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScorecardSumOrderByAggregateInput = {
    ratingsCoreLoop?: SortOrder
    ratingsMonetization?: SortOrder
    ratingsVisualUx?: SortOrder
    ratingsRetention?: SortOrder
    ratingsUsp?: SortOrder
  }

  export type WeeklyInsightCountOrderByAggregateInput = {
    id?: SortOrder
    week?: SortOrder
    title?: SortOrder
    overallStatus?: SortOrder
    highlights?: SortOrder
    risks?: SortOrder
    actionItems?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type WeeklyInsightMaxOrderByAggregateInput = {
    id?: SortOrder
    week?: SortOrder
    title?: SortOrder
    overallStatus?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type WeeklyInsightMinOrderByAggregateInput = {
    id?: SortOrder
    week?: SortOrder
    title?: SortOrder
    overallStatus?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type SnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    createdAt?: SortOrder
  }

  export type SnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type TaskCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GameScorecardCreateNestedManyWithoutProjectInput = {
    create?: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput> | GameScorecardCreateWithoutProjectInput[] | GameScorecardUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutProjectInput | GameScorecardCreateOrConnectWithoutProjectInput[]
    createMany?: GameScorecardCreateManyProjectInputEnvelope
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GameScorecardUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput> | GameScorecardCreateWithoutProjectInput[] | GameScorecardUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutProjectInput | GameScorecardCreateOrConnectWithoutProjectInput[]
    createMany?: GameScorecardCreateManyProjectInputEnvelope
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TaskUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutProjectInput | TaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutProjectInput | TaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutProjectInput | TaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GameScorecardUpdateManyWithoutProjectNestedInput = {
    create?: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput> | GameScorecardCreateWithoutProjectInput[] | GameScorecardUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutProjectInput | GameScorecardCreateOrConnectWithoutProjectInput[]
    upsert?: GameScorecardUpsertWithWhereUniqueWithoutProjectInput | GameScorecardUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: GameScorecardCreateManyProjectInputEnvelope
    set?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    disconnect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    delete?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    update?: GameScorecardUpdateWithWhereUniqueWithoutProjectInput | GameScorecardUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: GameScorecardUpdateManyWithWhereWithoutProjectInput | GameScorecardUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutProjectInput | TaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutProjectInput | TaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutProjectInput | TaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GameScorecardUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput> | GameScorecardCreateWithoutProjectInput[] | GameScorecardUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutProjectInput | GameScorecardCreateOrConnectWithoutProjectInput[]
    upsert?: GameScorecardUpsertWithWhereUniqueWithoutProjectInput | GameScorecardUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: GameScorecardCreateManyProjectInputEnvelope
    set?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    disconnect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    delete?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    update?: GameScorecardUpdateWithWhereUniqueWithoutProjectInput | GameScorecardUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: GameScorecardUpdateManyWithWhereWithoutProjectInput | GameScorecardUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
  }

  export type TaskCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GameScorecardCreateNestedManyWithoutAuthorInput = {
    create?: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput> | GameScorecardCreateWithoutAuthorInput[] | GameScorecardUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutAuthorInput | GameScorecardCreateOrConnectWithoutAuthorInput[]
    createMany?: GameScorecardCreateManyAuthorInputEnvelope
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
  }

  export type WeeklyInsightCreateNestedManyWithoutAuthorInput = {
    create?: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput> | WeeklyInsightCreateWithoutAuthorInput[] | WeeklyInsightUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: WeeklyInsightCreateOrConnectWithoutAuthorInput | WeeklyInsightCreateOrConnectWithoutAuthorInput[]
    createMany?: WeeklyInsightCreateManyAuthorInputEnvelope
    connect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GameScorecardUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput> | GameScorecardCreateWithoutAuthorInput[] | GameScorecardUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutAuthorInput | GameScorecardCreateOrConnectWithoutAuthorInput[]
    createMany?: GameScorecardCreateManyAuthorInputEnvelope
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
  }

  export type WeeklyInsightUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput> | WeeklyInsightCreateWithoutAuthorInput[] | WeeklyInsightUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: WeeklyInsightCreateOrConnectWithoutAuthorInput | WeeklyInsightCreateOrConnectWithoutAuthorInput[]
    createMany?: WeeklyInsightCreateManyAuthorInputEnvelope
    connect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
  }

  export type TaskUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GameScorecardUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput> | GameScorecardCreateWithoutAuthorInput[] | GameScorecardUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutAuthorInput | GameScorecardCreateOrConnectWithoutAuthorInput[]
    upsert?: GameScorecardUpsertWithWhereUniqueWithoutAuthorInput | GameScorecardUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: GameScorecardCreateManyAuthorInputEnvelope
    set?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    disconnect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    delete?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    update?: GameScorecardUpdateWithWhereUniqueWithoutAuthorInput | GameScorecardUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: GameScorecardUpdateManyWithWhereWithoutAuthorInput | GameScorecardUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
  }

  export type WeeklyInsightUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput> | WeeklyInsightCreateWithoutAuthorInput[] | WeeklyInsightUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: WeeklyInsightCreateOrConnectWithoutAuthorInput | WeeklyInsightCreateOrConnectWithoutAuthorInput[]
    upsert?: WeeklyInsightUpsertWithWhereUniqueWithoutAuthorInput | WeeklyInsightUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: WeeklyInsightCreateManyAuthorInputEnvelope
    set?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    disconnect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    delete?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    connect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    update?: WeeklyInsightUpdateWithWhereUniqueWithoutAuthorInput | WeeklyInsightUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: WeeklyInsightUpdateManyWithWhereWithoutAuthorInput | WeeklyInsightUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: WeeklyInsightScalarWhereInput | WeeklyInsightScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput> | TaskCreateWithoutAssigneeInput[] | TaskUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneeInput | TaskCreateOrConnectWithoutAssigneeInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneeInput | TaskUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TaskCreateManyAssigneeInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneeInput | TaskUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneeInput | TaskUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GameScorecardUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput> | GameScorecardCreateWithoutAuthorInput[] | GameScorecardUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: GameScorecardCreateOrConnectWithoutAuthorInput | GameScorecardCreateOrConnectWithoutAuthorInput[]
    upsert?: GameScorecardUpsertWithWhereUniqueWithoutAuthorInput | GameScorecardUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: GameScorecardCreateManyAuthorInputEnvelope
    set?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    disconnect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    delete?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    connect?: GameScorecardWhereUniqueInput | GameScorecardWhereUniqueInput[]
    update?: GameScorecardUpdateWithWhereUniqueWithoutAuthorInput | GameScorecardUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: GameScorecardUpdateManyWithWhereWithoutAuthorInput | GameScorecardUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
  }

  export type WeeklyInsightUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput> | WeeklyInsightCreateWithoutAuthorInput[] | WeeklyInsightUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: WeeklyInsightCreateOrConnectWithoutAuthorInput | WeeklyInsightCreateOrConnectWithoutAuthorInput[]
    upsert?: WeeklyInsightUpsertWithWhereUniqueWithoutAuthorInput | WeeklyInsightUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: WeeklyInsightCreateManyAuthorInputEnvelope
    set?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    disconnect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    delete?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    connect?: WeeklyInsightWhereUniqueInput | WeeklyInsightWhereUniqueInput[]
    update?: WeeklyInsightUpdateWithWhereUniqueWithoutAuthorInput | WeeklyInsightUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: WeeklyInsightUpdateManyWithWhereWithoutAuthorInput | WeeklyInsightUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: WeeklyInsightScalarWhereInput | WeeklyInsightScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutTasksInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    connect?: ProjectWhereUniqueInput
  }

  export type MemberCreateNestedOneWithoutTasksInput = {
    create?: XOR<MemberCreateWithoutTasksInput, MemberUncheckedCreateWithoutTasksInput>
    connectOrCreate?: MemberCreateOrConnectWithoutTasksInput
    connect?: MemberWhereUniqueInput
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type EnumPriorityFieldUpdateOperationsInput = {
    set?: $Enums.Priority
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProjectUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    upsert?: ProjectUpsertWithoutTasksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTasksInput, ProjectUpdateWithoutTasksInput>, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type MemberUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<MemberCreateWithoutTasksInput, MemberUncheckedCreateWithoutTasksInput>
    connectOrCreate?: MemberCreateOrConnectWithoutTasksInput
    upsert?: MemberUpsertWithoutTasksInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutTasksInput, MemberUpdateWithoutTasksInput>, MemberUncheckedUpdateWithoutTasksInput>
  }

  export type ProjectCreateNestedOneWithoutScorecardsInput = {
    create?: XOR<ProjectCreateWithoutScorecardsInput, ProjectUncheckedCreateWithoutScorecardsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutScorecardsInput
    connect?: ProjectWhereUniqueInput
  }

  export type MemberCreateNestedOneWithoutScorecardsInput = {
    create?: XOR<MemberCreateWithoutScorecardsInput, MemberUncheckedCreateWithoutScorecardsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutScorecardsInput
    connect?: MemberWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutScorecardsNestedInput = {
    create?: XOR<ProjectCreateWithoutScorecardsInput, ProjectUncheckedCreateWithoutScorecardsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutScorecardsInput
    upsert?: ProjectUpsertWithoutScorecardsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutScorecardsInput, ProjectUpdateWithoutScorecardsInput>, ProjectUncheckedUpdateWithoutScorecardsInput>
  }

  export type MemberUpdateOneRequiredWithoutScorecardsNestedInput = {
    create?: XOR<MemberCreateWithoutScorecardsInput, MemberUncheckedCreateWithoutScorecardsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutScorecardsInput
    upsert?: MemberUpsertWithoutScorecardsInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutScorecardsInput, MemberUpdateWithoutScorecardsInput>, MemberUncheckedUpdateWithoutScorecardsInput>
  }

  export type MemberCreateNestedOneWithoutInsightsInput = {
    create?: XOR<MemberCreateWithoutInsightsInput, MemberUncheckedCreateWithoutInsightsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutInsightsInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberUpdateOneRequiredWithoutInsightsNestedInput = {
    create?: XOR<MemberCreateWithoutInsightsInput, MemberUncheckedCreateWithoutInsightsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutInsightsInput
    upsert?: MemberUpsertWithoutInsightsInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutInsightsInput, MemberUpdateWithoutInsightsInput>, MemberUncheckedUpdateWithoutInsightsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TaskCreateWithoutProjectInput = {
    id: string
    title: string
    description: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    assignee: MemberCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutProjectInput = {
    id: string
    title: string
    description: string
    assigneeId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskCreateOrConnectWithoutProjectInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput>
  }

  export type TaskCreateManyProjectInputEnvelope = {
    data: TaskCreateManyProjectInput | TaskCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type GameScorecardCreateWithoutProjectInput = {
    id: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    createdAt: Date | string
    author: MemberCreateNestedOneWithoutScorecardsInput
  }

  export type GameScorecardUncheckedCreateWithoutProjectInput = {
    id: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    authorId: string
    createdAt: Date | string
  }

  export type GameScorecardCreateOrConnectWithoutProjectInput = {
    where: GameScorecardWhereUniqueInput
    create: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput>
  }

  export type GameScorecardCreateManyProjectInputEnvelope = {
    data: GameScorecardCreateManyProjectInput | GameScorecardCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type TaskUpsertWithWhereUniqueWithoutProjectInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutProjectInput, TaskUncheckedUpdateWithoutProjectInput>
    create: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutProjectInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutProjectInput, TaskUncheckedUpdateWithoutProjectInput>
  }

  export type TaskUpdateManyWithWhereWithoutProjectInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutProjectInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    projectId?: StringFilter<"Task"> | string
    assigneeId?: StringFilter<"Task"> | string
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    weight?: IntFilter<"Task"> | number
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    eisenhowerUrgent?: BoolFilter<"Task"> | boolean
    eisenhowerImportant?: BoolFilter<"Task"> | boolean
    eisenhowerAutoClassified?: BoolFilter<"Task"> | boolean
    tags?: JsonNullableFilter<"Task">
  }

  export type GameScorecardUpsertWithWhereUniqueWithoutProjectInput = {
    where: GameScorecardWhereUniqueInput
    update: XOR<GameScorecardUpdateWithoutProjectInput, GameScorecardUncheckedUpdateWithoutProjectInput>
    create: XOR<GameScorecardCreateWithoutProjectInput, GameScorecardUncheckedCreateWithoutProjectInput>
  }

  export type GameScorecardUpdateWithWhereUniqueWithoutProjectInput = {
    where: GameScorecardWhereUniqueInput
    data: XOR<GameScorecardUpdateWithoutProjectInput, GameScorecardUncheckedUpdateWithoutProjectInput>
  }

  export type GameScorecardUpdateManyWithWhereWithoutProjectInput = {
    where: GameScorecardScalarWhereInput
    data: XOR<GameScorecardUpdateManyMutationInput, GameScorecardUncheckedUpdateManyWithoutProjectInput>
  }

  export type GameScorecardScalarWhereInput = {
    AND?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
    OR?: GameScorecardScalarWhereInput[]
    NOT?: GameScorecardScalarWhereInput | GameScorecardScalarWhereInput[]
    id?: StringFilter<"GameScorecard"> | string
    projectId?: StringFilter<"GameScorecard"> | string
    week?: DateTimeFilter<"GameScorecard"> | Date | string
    ratingsCoreLoop?: IntFilter<"GameScorecard"> | number
    ratingsMonetization?: IntFilter<"GameScorecard"> | number
    ratingsVisualUx?: IntFilter<"GameScorecard"> | number
    ratingsRetention?: IntFilter<"GameScorecard"> | number
    ratingsUsp?: IntFilter<"GameScorecard"> | number
    summary?: StringFilter<"GameScorecard"> | string
    authorId?: StringFilter<"GameScorecard"> | string
    createdAt?: DateTimeFilter<"GameScorecard"> | Date | string
  }

  export type TaskCreateWithoutAssigneeInput = {
    id: string
    title: string
    description: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    project: ProjectCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutAssigneeInput = {
    id: string
    title: string
    description: string
    projectId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskCreateOrConnectWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskCreateManyAssigneeInputEnvelope = {
    data: TaskCreateManyAssigneeInput | TaskCreateManyAssigneeInput[]
    skipDuplicates?: boolean
  }

  export type GameScorecardCreateWithoutAuthorInput = {
    id: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    createdAt: Date | string
    project: ProjectCreateNestedOneWithoutScorecardsInput
  }

  export type GameScorecardUncheckedCreateWithoutAuthorInput = {
    id: string
    projectId: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    createdAt: Date | string
  }

  export type GameScorecardCreateOrConnectWithoutAuthorInput = {
    where: GameScorecardWhereUniqueInput
    create: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput>
  }

  export type GameScorecardCreateManyAuthorInputEnvelope = {
    data: GameScorecardCreateManyAuthorInput | GameScorecardCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type WeeklyInsightCreateWithoutAuthorInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt: Date | string
  }

  export type WeeklyInsightUncheckedCreateWithoutAuthorInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt: Date | string
  }

  export type WeeklyInsightCreateOrConnectWithoutAuthorInput = {
    where: WeeklyInsightWhereUniqueInput
    create: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput>
  }

  export type WeeklyInsightCreateManyAuthorInputEnvelope = {
    data: WeeklyInsightCreateManyAuthorInput | WeeklyInsightCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type TaskUpsertWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
    create: XOR<TaskCreateWithoutAssigneeInput, TaskUncheckedCreateWithoutAssigneeInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssigneeInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssigneeInput, TaskUncheckedUpdateWithoutAssigneeInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssigneeInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssigneeInput>
  }

  export type GameScorecardUpsertWithWhereUniqueWithoutAuthorInput = {
    where: GameScorecardWhereUniqueInput
    update: XOR<GameScorecardUpdateWithoutAuthorInput, GameScorecardUncheckedUpdateWithoutAuthorInput>
    create: XOR<GameScorecardCreateWithoutAuthorInput, GameScorecardUncheckedCreateWithoutAuthorInput>
  }

  export type GameScorecardUpdateWithWhereUniqueWithoutAuthorInput = {
    where: GameScorecardWhereUniqueInput
    data: XOR<GameScorecardUpdateWithoutAuthorInput, GameScorecardUncheckedUpdateWithoutAuthorInput>
  }

  export type GameScorecardUpdateManyWithWhereWithoutAuthorInput = {
    where: GameScorecardScalarWhereInput
    data: XOR<GameScorecardUpdateManyMutationInput, GameScorecardUncheckedUpdateManyWithoutAuthorInput>
  }

  export type WeeklyInsightUpsertWithWhereUniqueWithoutAuthorInput = {
    where: WeeklyInsightWhereUniqueInput
    update: XOR<WeeklyInsightUpdateWithoutAuthorInput, WeeklyInsightUncheckedUpdateWithoutAuthorInput>
    create: XOR<WeeklyInsightCreateWithoutAuthorInput, WeeklyInsightUncheckedCreateWithoutAuthorInput>
  }

  export type WeeklyInsightUpdateWithWhereUniqueWithoutAuthorInput = {
    where: WeeklyInsightWhereUniqueInput
    data: XOR<WeeklyInsightUpdateWithoutAuthorInput, WeeklyInsightUncheckedUpdateWithoutAuthorInput>
  }

  export type WeeklyInsightUpdateManyWithWhereWithoutAuthorInput = {
    where: WeeklyInsightScalarWhereInput
    data: XOR<WeeklyInsightUpdateManyMutationInput, WeeklyInsightUncheckedUpdateManyWithoutAuthorInput>
  }

  export type WeeklyInsightScalarWhereInput = {
    AND?: WeeklyInsightScalarWhereInput | WeeklyInsightScalarWhereInput[]
    OR?: WeeklyInsightScalarWhereInput[]
    NOT?: WeeklyInsightScalarWhereInput | WeeklyInsightScalarWhereInput[]
    id?: StringFilter<"WeeklyInsight"> | string
    week?: DateTimeFilter<"WeeklyInsight"> | Date | string
    title?: StringFilter<"WeeklyInsight"> | string
    overallStatus?: StringFilter<"WeeklyInsight"> | string
    highlights?: JsonNullableFilter<"WeeklyInsight">
    risks?: JsonNullableFilter<"WeeklyInsight">
    actionItems?: JsonNullableFilter<"WeeklyInsight">
    authorId?: StringFilter<"WeeklyInsight"> | string
    createdAt?: DateTimeFilter<"WeeklyInsight"> | Date | string
  }

  export type ProjectCreateWithoutTasksInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    scorecards?: GameScorecardCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTasksInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    scorecards?: GameScorecardUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTasksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
  }

  export type MemberCreateWithoutTasksInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    scorecards?: GameScorecardCreateNestedManyWithoutAuthorInput
    insights?: WeeklyInsightCreateNestedManyWithoutAuthorInput
  }

  export type MemberUncheckedCreateWithoutTasksInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    scorecards?: GameScorecardUncheckedCreateNestedManyWithoutAuthorInput
    insights?: WeeklyInsightUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type MemberCreateOrConnectWithoutTasksInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutTasksInput, MemberUncheckedCreateWithoutTasksInput>
  }

  export type ProjectUpsertWithoutTasksInput = {
    update: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTasksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type ProjectUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scorecards?: GameScorecardUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scorecards?: GameScorecardUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type MemberUpsertWithoutTasksInput = {
    update: XOR<MemberUpdateWithoutTasksInput, MemberUncheckedUpdateWithoutTasksInput>
    create: XOR<MemberCreateWithoutTasksInput, MemberUncheckedCreateWithoutTasksInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutTasksInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutTasksInput, MemberUncheckedUpdateWithoutTasksInput>
  }

  export type MemberUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    scorecards?: GameScorecardUpdateManyWithoutAuthorNestedInput
    insights?: WeeklyInsightUpdateManyWithoutAuthorNestedInput
  }

  export type MemberUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    scorecards?: GameScorecardUncheckedUpdateManyWithoutAuthorNestedInput
    insights?: WeeklyInsightUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ProjectCreateWithoutScorecardsInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    tasks?: TaskCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutScorecardsInput = {
    id: string
    name: string
    platform: string
    genre: string
    status: string
    color: string
    createdAt: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutScorecardsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutScorecardsInput, ProjectUncheckedCreateWithoutScorecardsInput>
  }

  export type MemberCreateWithoutScorecardsInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskCreateNestedManyWithoutAssigneeInput
    insights?: WeeklyInsightCreateNestedManyWithoutAuthorInput
  }

  export type MemberUncheckedCreateWithoutScorecardsInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    insights?: WeeklyInsightUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type MemberCreateOrConnectWithoutScorecardsInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutScorecardsInput, MemberUncheckedCreateWithoutScorecardsInput>
  }

  export type ProjectUpsertWithoutScorecardsInput = {
    update: XOR<ProjectUpdateWithoutScorecardsInput, ProjectUncheckedUpdateWithoutScorecardsInput>
    create: XOR<ProjectCreateWithoutScorecardsInput, ProjectUncheckedCreateWithoutScorecardsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutScorecardsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutScorecardsInput, ProjectUncheckedUpdateWithoutScorecardsInput>
  }

  export type ProjectUpdateWithoutScorecardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutScorecardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type MemberUpsertWithoutScorecardsInput = {
    update: XOR<MemberUpdateWithoutScorecardsInput, MemberUncheckedUpdateWithoutScorecardsInput>
    create: XOR<MemberCreateWithoutScorecardsInput, MemberUncheckedCreateWithoutScorecardsInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutScorecardsInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutScorecardsInput, MemberUncheckedUpdateWithoutScorecardsInput>
  }

  export type MemberUpdateWithoutScorecardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUpdateManyWithoutAssigneeNestedInput
    insights?: WeeklyInsightUpdateManyWithoutAuthorNestedInput
  }

  export type MemberUncheckedUpdateWithoutScorecardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    insights?: WeeklyInsightUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type MemberCreateWithoutInsightsInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskCreateNestedManyWithoutAssigneeInput
    scorecards?: GameScorecardCreateNestedManyWithoutAuthorInput
  }

  export type MemberUncheckedCreateWithoutInsightsInput = {
    id: string
    name: string
    email: string
    role: string
    avatarColor: string
    initials: string
    joinedAt: Date | string
    password: string
    tasks?: TaskUncheckedCreateNestedManyWithoutAssigneeInput
    scorecards?: GameScorecardUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type MemberCreateOrConnectWithoutInsightsInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutInsightsInput, MemberUncheckedCreateWithoutInsightsInput>
  }

  export type MemberUpsertWithoutInsightsInput = {
    update: XOR<MemberUpdateWithoutInsightsInput, MemberUncheckedUpdateWithoutInsightsInput>
    create: XOR<MemberCreateWithoutInsightsInput, MemberUncheckedCreateWithoutInsightsInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutInsightsInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutInsightsInput, MemberUncheckedUpdateWithoutInsightsInput>
  }

  export type MemberUpdateWithoutInsightsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUpdateManyWithoutAssigneeNestedInput
    scorecards?: GameScorecardUpdateManyWithoutAuthorNestedInput
  }

  export type MemberUncheckedUpdateWithoutInsightsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatarColor?: StringFieldUpdateOperationsInput | string
    initials?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutAssigneeNestedInput
    scorecards?: GameScorecardUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type TaskCreateManyProjectInput = {
    id: string
    title: string
    description: string
    assigneeId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GameScorecardCreateManyProjectInput = {
    id: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    authorId: string
    createdAt: Date | string
  }

  export type TaskUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    assignee?: MemberUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assigneeId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assigneeId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GameScorecardUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: MemberUpdateOneRequiredWithoutScorecardsNestedInput
  }

  export type GameScorecardUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScorecardUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyAssigneeInput = {
    id: string
    title: string
    description: string
    projectId: string
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    weight: number
    deadline?: Date | string | null
    createdAt: Date | string
    completedAt?: Date | string | null
    eisenhowerUrgent?: boolean
    eisenhowerImportant?: boolean
    eisenhowerAutoClassified?: boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GameScorecardCreateManyAuthorInput = {
    id: string
    projectId: string
    week: Date | string
    ratingsCoreLoop: number
    ratingsMonetization: number
    ratingsVisualUx: number
    ratingsRetention: number
    ratingsUsp: number
    summary: string
    createdAt: Date | string
  }

  export type WeeklyInsightCreateManyAuthorInput = {
    id: string
    week: Date | string
    title: string
    overallStatus: string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt: Date | string
  }

  export type TaskUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskUncheckedUpdateManyWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    weight?: IntFieldUpdateOperationsInput | number
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eisenhowerUrgent?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerImportant?: BoolFieldUpdateOperationsInput | boolean
    eisenhowerAutoClassified?: BoolFieldUpdateOperationsInput | boolean
    tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GameScorecardUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutScorecardsNestedInput
  }

  export type GameScorecardUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScorecardUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    ratingsCoreLoop?: IntFieldUpdateOperationsInput | number
    ratingsMonetization?: IntFieldUpdateOperationsInput | number
    ratingsVisualUx?: IntFieldUpdateOperationsInput | number
    ratingsRetention?: IntFieldUpdateOperationsInput | number
    ratingsUsp?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeeklyInsightUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    week?: DateTimeFieldUpdateOperationsInput | Date | string
    title?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    highlights?: NullableJsonNullValueInput | InputJsonValue
    risks?: NullableJsonNullValueInput | InputJsonValue
    actionItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}