// let a = 1
export type PlainObject = Record<string, any>;
export type DeepPartial<T extends PlainObject> = {
      [K in keyof T]?: DeepPartial<T[K]>
}
export type Flatten<T> = {
      [K in keyof T]: T[K]
}
export type MarkPropAsOptional<T extends PlainObject, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MarkPropAsRequired<T extends PlainObject, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>


interface A {
      id: string,
      name?: string,
      detail: {
            name: string,
            age: number,
      }
}

type _A = DeepPartial<A>

type _B = Flatten<MarkPropAsOptional<A, "id">>
type _C = Flatten<MarkPropAsRequired<A, "name">>


let a: _A = {
      detail: {
            name: '1',
      }
}

