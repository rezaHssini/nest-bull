export type AnyFn = (...args: any[]) => any;
/**
 * By given function type (arg1: T1, arg2: T2, ...) => R returns a function type that has same signature
 * but with addition parameters from Args
 *
 * For example, given
 * function f(a: string, b: boolean) => number
 *
 * UnshiftArgsToMethod<typeof f, [object, number[]]>
 *   returns type
 *   (arg_1: object, arg_2: number[], a: string, b: boolean) => number
 */
export type UnshiftArgsToMethod<Type, Args extends any[]>
  = Type extends AnyFn ? (...args: [...Args, ...Parameters<Type>]) => ReturnType<Type> : Type;

/**
 * Applies UnshiftArgsToMethod<Type, Args> to all method properties of interface Type
 */
export type UnshiftArgsToClassMethods<Type, Args extends any[]> = {
  [Key in keyof Type]: UnshiftArgsToMethod<Type[Key], Args>;
};
