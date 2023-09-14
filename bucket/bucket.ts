import * as Bucket from '@spica-devkit/bucket';
  /**
   * Call this method before interacting with buckets.
   * @param initOptions Initialize options to initialize the '@spica-devkit/bucket'.
   */
    export function initialize(
    ...initOptions: Parameters<typeof Bucket.initialize>
  ) {
    initOptions[0].publicUrl = 'https://master.spicaengine.com/api';
    Bucket.initialize(...initOptions);
  }

type Rest<T extends any[]> = ((...p: T) => void) extends ((p1: infer P1, ...rest: infer R) => void) ? R : never;
type getArgs = Rest<Parameters<typeof Bucket.data.get>>;
type getAllArgs = Rest<Parameters<typeof Bucket.data.getAll>>;
type realtimeGetArgs = Rest<Parameters<typeof Bucket.data.realtime.get>>;
type realtimeGetAllArgs = Rest<Parameters<typeof Bucket.data.realtime.getAll>>;
type id = { _id: string };

type Find<Targets extends string[], Search extends string> = {
  [K in keyof Targets]: Targets[K] extends `${Search}.${infer Rest}`
    ? Targets[K]
    : Targets[K] extends `${Search}`
    ? Targets[K]
    : never;
}[number];

type FindRest<T extends string[], S extends string> = {
  [K in keyof T]: T[K] extends `${S}.${infer Rest}`
    ? Rest
    : never
}[number]; 

type ConvertEnumToSelection<T extends string[]> = T extends []
  ? []
  : T extends (infer U)[]
  ? [U, ...U[]]
  : [];

type Props<T> = {
  [K in keyof T]: K;
}[keyof T];

type RemoveProps<TClass, TProps extends keyof TClass> = {
  [K in keyof TClass as K extends TProps ? never : K]: TClass[K];
};

type AvailableLanguages = 'en_US'|'it'|'mt'|'es-ES'



export interface Products<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Books<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  image?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface Owners<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  name?: string;
  surname?: string;
  number_of_prizes?: number;
  product?: Find<Relations,"product">[] extends never[] ? string[] : (Products<FindRest<Relations,"product">[]>&id)[];
  dob?: string;
}

export interface Ionic_movie_AppIonic_movie_App<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  title?: string;
  imdb?: number;
  duration: number;
  release_date?: Date | string;
  is_watched?: boolean;
  tests?: Find<Relations,"tests">[] extends never[] ? string[] : (Ionic_movie_AppIonic_movie_App<FindRest<Relations,"tests">[]>&id)[];
  test?: Find<Relations,"test">[] extends never[] ? string : (Ionic_movie_AppIonic_movie_App<FindRest<Relations,"test">[]>&id);
}

export interface Kenan_Test<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  title?: string;
  description?: string;
  deneme?: string;
  toggle_deneme?: string;
  den_prop?: string;
}

export interface UsersProducts<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  name?: string;
  owner?: Find<Relations,"owner">[] extends never[] ? string : (NewUsers<FindRest<Relations,"owner">[]>&id);
}

export interface Productss<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  name?: string;
  quantity?: number;
  asf?: ('asd'|'asg'|'hk')[];
  arr?: string[];
}

export interface Messages<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  text?: string;
  sender_name?: string;
}

export interface NewUsers<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  email?: string;
  name?: string;
}

export interface Count<Relations extends string[] = [], Localize extends boolean = true>{
  _id?: string;
  dislike?: number;
  text?: string;
  like?: number;
}

class CRUD<Scheme,Paginate extends boolean = false> {
  protected options: {
    headers: {
      'accept-language'?: string;
    };
    queryParams: {
      limit?: number;
      skip?: number;
      sort?: {
        [T in keyof Scheme]: -1 | 1;
      };
      paginate?: boolean;

      relation?: string[];
      localize?: boolean;
      filter?: any;
    };
  } = {
    headers: {},
    queryParams: {},
  };

  constructor(
    protected bucketId: string,
    protected bdService: typeof Bucket.data,
    protected relationalFields: string[]
  ) {}

  private normalizeRelations(document: any) {
    this.relationalFields.forEach((field) => {
      if (typeof document[field] == 'object') {
        document[field] = Array.isArray(document[field])
          ? document[field].map((v: any) => v._id || v)
          : document[field]._id;
      }
    });
    return document;
  }

  private buildOptions(options: any) {
    options = options ? options : this.options;
    this.options = {
      headers: {},
      queryParams: {},
    };
    return options;
  }

  get(...args: getArgs) {
    args[1] = this.buildOptions(args[1]);
    return this.bdService.get<Scheme & id>(this.bucketId, ...args);
  }

  getAll(
    ...args: getAllArgs
  ): Paginate extends true
    ? Promise<Bucket.IndexResult<Scheme>>
    : Promise<Scheme[]> {
    args[0] = this.buildOptions(args[0]);
    return this.bdService.getAll<Scheme & id>(
      this.bucketId,
      ...args
    ) as Paginate extends true
      ? Promise<Bucket.IndexResult<Scheme>>
      : Promise<Scheme[]>;
  }

  insert(document: Omit<Scheme, '_id'>) {
    document = this.normalizeRelations(document);
    return this.bdService.insert(this.bucketId, document);
  }
  update(document: Scheme & id) {
    document = this.normalizeRelations(document);
    return this.bdService.update(this.bucketId, document._id, document);
  }
  patch(document: Partial<Scheme> & id) {
    document = this.normalizeRelations(document);
    return this.bdService.patch(this.bucketId, document._id, document);
  }

  remove(documentId: string) {
    return this.bdService.remove(this.bucketId, documentId);
  }

  realtime = {
    get: (...args: realtimeGetArgs) => {
      return this.bdService.realtime.get<Scheme & id>(
        this.bucketId,
        ...args
      );
    },
    getAll: (...args: realtimeGetAllArgs) => {
      return this.bdService.realtime.getAll<Scheme & id>(
        this.bucketId,
        ...args
      );
    },
  };
}

class Cursor<Scheme,Paginate extends boolean = false> extends CRUD<Scheme,Paginate>{
  limit(limit: number): any {
    this.options.queryParams.limit = limit;
    return this;
  }

  skip(skip: number): any {
    this.options.queryParams.skip = skip;
    return this;
  }

  sort(sort: { [T in keyof Scheme]: -1 | 1 }): any {
    this.options.queryParams.sort = sort;
    return this;
  }

  filter(filter: any): any {
    this.options.queryParams.filter = filter;
    return this;
  }

  translate(language: AvailableLanguages): any {
    this.options.headers['accept-language'] = language;
    return this;
  }

  paginate(): any {
    this.options.queryParams.paginate = true;
    return this;
  }

  nonLocalize(): any {
    this.options.queryParams.localize = false;
    return this;
  }  

  resolveRelations(relation:any): any {
    this.options.queryParams.relation = relation;
    return this;
  }
}

const ProductsRelationFields: string[] = []
type ProductsRelationEnum = []
type ProductsRelationSelection = ConvertEnumToSelection<ProductsRelationEnum>
type ProductsCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  ProductsCursor<R, P, L>,
  Exclude<Props<CRUD<Products<R, L>, P>>, 'get' | 'getAll'>
>;

class ProductsCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Products<R,L>,P>{
  
  override resolveRelations<Selecteds extends ProductsRelationSelection>(
    relations: Selecteds
  ): ProductsCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): ProductsCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): ProductsCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): ProductsCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Products]: -1 | 1;
  }): ProductsCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): ProductsCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): ProductsCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): ProductsCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const products = new ProductsCursor('64a67428bcd096002df2caa0',Bucket.data,ProductsRelationFields)

const BooksRelationFields: string[] = []
type BooksRelationEnum = []
type BooksRelationSelection = ConvertEnumToSelection<BooksRelationEnum>
type BooksCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  BooksCursor<R, P, L>,
  Exclude<Props<CRUD<Books<R, L>, P>>, 'get' | 'getAll'>
>;

class BooksCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Books<R,L>,P>{
  
  override resolveRelations<Selecteds extends BooksRelationSelection>(
    relations: Selecteds
  ): BooksCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): BooksCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): BooksCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): BooksCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Books]: -1 | 1;
  }): BooksCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): BooksCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): BooksCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): BooksCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const books = new BooksCursor('64b91d543404ce002c98bf90',Bucket.data,BooksRelationFields)

const OwnersRelationFields: string[] = ['product']
type OwnersRelationEnum = ('product')[]
type OwnersRelationSelection = ConvertEnumToSelection<OwnersRelationEnum>
type OwnersCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  OwnersCursor<R, P, L>,
  Exclude<Props<CRUD<Owners<R, L>, P>>, 'get' | 'getAll'>
>;

class OwnersCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Owners<R,L>,P>{
  
  override resolveRelations<Selecteds extends OwnersRelationSelection>(
    relations: Selecteds
  ): OwnersCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): OwnersCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): OwnersCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): OwnersCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Owners]: -1 | 1;
  }): OwnersCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): OwnersCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): OwnersCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): OwnersCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const owners = new OwnersCursor('64a66f70bcd096002df2ca10',Bucket.data,OwnersRelationFields)

const Ionic_movie_AppIonic_movie_AppRelationFields: string[] = ['tests','test']
type Ionic_movie_AppIonic_movie_AppRelationEnum = ('tests'|'tests.tests'|'tests.tests.tests'|'tests.tests.tests.tests'|'tests.tests.tests.tests.tests'|'tests.tests.tests.tests.test'|'tests.tests.tests.test'|'tests.tests.tests.test.tests'|'tests.tests.tests.test.test'|'tests.tests.test'|'tests.tests.test.tests'|'tests.tests.test.tests.tests'|'tests.tests.test.tests.test'|'tests.tests.test.test'|'tests.tests.test.test.tests'|'tests.tests.test.test.test'|'tests.test'|'tests.test.tests'|'tests.test.tests.tests'|'tests.test.tests.tests.tests'|'tests.test.tests.tests.test'|'tests.test.tests.test'|'tests.test.tests.test.tests'|'tests.test.tests.test.test'|'tests.test.test'|'tests.test.test.tests'|'tests.test.test.tests.tests'|'tests.test.test.tests.test'|'tests.test.test.test'|'tests.test.test.test.tests'|'tests.test.test.test.test'|'test'|'test.tests'|'test.tests.tests'|'test.tests.tests.tests'|'test.tests.tests.tests.tests'|'test.tests.tests.tests.test'|'test.tests.tests.test'|'test.tests.tests.test.tests'|'test.tests.tests.test.test'|'test.tests.test'|'test.tests.test.tests'|'test.tests.test.tests.tests'|'test.tests.test.tests.test'|'test.tests.test.test'|'test.tests.test.test.tests'|'test.tests.test.test.test'|'test.test'|'test.test.tests'|'test.test.tests.tests'|'test.test.tests.tests.tests'|'test.test.tests.tests.test'|'test.test.tests.test'|'test.test.tests.test.tests'|'test.test.tests.test.test'|'test.test.test'|'test.test.test.tests'|'test.test.test.tests.tests'|'test.test.test.tests.test'|'test.test.test.test'|'test.test.test.test.tests'|'test.test.test.test.test')[]
type Ionic_movie_AppIonic_movie_AppRelationSelection = ConvertEnumToSelection<Ionic_movie_AppIonic_movie_AppRelationEnum>
type Ionic_movie_AppIonic_movie_AppCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  Ionic_movie_AppIonic_movie_AppCursor<R, P, L>,
  Exclude<Props<CRUD<Ionic_movie_AppIonic_movie_App<R, L>, P>>, 'get' | 'getAll'>
>;

class Ionic_movie_AppIonic_movie_AppCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Ionic_movie_AppIonic_movie_App<R,L>,P>{
  
  override resolveRelations<Selecteds extends Ionic_movie_AppIonic_movie_AppRelationSelection>(
    relations: Selecteds
  ): Ionic_movie_AppIonic_movie_AppCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Ionic_movie_AppIonic_movie_App]: -1 | 1;
  }): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): Ionic_movie_AppIonic_movie_AppCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): Ionic_movie_AppIonic_movie_AppCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const ionic_movie_appionic_movie_app = new Ionic_movie_AppIonic_movie_AppCursor('63bc02089dc3d6002c9a3296',Bucket.data,Ionic_movie_AppIonic_movie_AppRelationFields)

const Kenan_TestRelationFields: string[] = []
type Kenan_TestRelationEnum = []
type Kenan_TestRelationSelection = ConvertEnumToSelection<Kenan_TestRelationEnum>
type Kenan_TestCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  Kenan_TestCursor<R, P, L>,
  Exclude<Props<CRUD<Kenan_Test<R, L>, P>>, 'get' | 'getAll'>
>;

class Kenan_TestCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Kenan_Test<R,L>,P>{
  
  override resolveRelations<Selecteds extends Kenan_TestRelationSelection>(
    relations: Selecteds
  ): Kenan_TestCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): Kenan_TestCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): Kenan_TestCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): Kenan_TestCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Kenan_Test]: -1 | 1;
  }): Kenan_TestCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): Kenan_TestCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): Kenan_TestCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): Kenan_TestCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const kenan_test = new Kenan_TestCursor('650058746095ae002d10968f',Bucket.data,Kenan_TestRelationFields)

const UsersProductsRelationFields: string[] = ['owner']
type UsersProductsRelationEnum = ('owner')[]
type UsersProductsRelationSelection = ConvertEnumToSelection<UsersProductsRelationEnum>
type UsersProductsCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  UsersProductsCursor<R, P, L>,
  Exclude<Props<CRUD<UsersProducts<R, L>, P>>, 'get' | 'getAll'>
>;

class UsersProductsCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<UsersProducts<R,L>,P>{
  
  override resolveRelations<Selecteds extends UsersProductsRelationSelection>(
    relations: Selecteds
  ): UsersProductsCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): UsersProductsCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): UsersProductsCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): UsersProductsCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof UsersProducts]: -1 | 1;
  }): UsersProductsCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): UsersProductsCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): UsersProductsCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): UsersProductsCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const usersproducts = new UsersProductsCursor('6501692b6095ae002d109f51',Bucket.data,UsersProductsRelationFields)

const ProductssRelationFields: string[] = []
type ProductssRelationEnum = []
type ProductssRelationSelection = ConvertEnumToSelection<ProductssRelationEnum>
type ProductssCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  ProductssCursor<R, P, L>,
  Exclude<Props<CRUD<Productss<R, L>, P>>, 'get' | 'getAll'>
>;

class ProductssCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Productss<R,L>,P>{
  
  override resolveRelations<Selecteds extends ProductssRelationSelection>(
    relations: Selecteds
  ): ProductssCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): ProductssCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): ProductssCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): ProductssCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Productss]: -1 | 1;
  }): ProductssCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): ProductssCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): ProductssCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): ProductssCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const productss = new ProductssCursor('637b66c0ea080c002bb417ff',Bucket.data,ProductssRelationFields)

const MessagesRelationFields: string[] = []
type MessagesRelationEnum = []
type MessagesRelationSelection = ConvertEnumToSelection<MessagesRelationEnum>
type MessagesCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  MessagesCursor<R, P, L>,
  Exclude<Props<CRUD<Messages<R, L>, P>>, 'get' | 'getAll'>
>;

class MessagesCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Messages<R,L>,P>{
  
  override resolveRelations<Selecteds extends MessagesRelationSelection>(
    relations: Selecteds
  ): MessagesCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): MessagesCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): MessagesCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): MessagesCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Messages]: -1 | 1;
  }): MessagesCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): MessagesCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): MessagesCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): MessagesCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const messages = new MessagesCursor('637f3d6eea080c002bb421d6',Bucket.data,MessagesRelationFields)

const NewUsersRelationFields: string[] = []
type NewUsersRelationEnum = []
type NewUsersRelationSelection = ConvertEnumToSelection<NewUsersRelationEnum>
type NewUsersCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  NewUsersCursor<R, P, L>,
  Exclude<Props<CRUD<NewUsers<R, L>, P>>, 'get' | 'getAll'>
>;

class NewUsersCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<NewUsers<R,L>,P>{
  
  override resolveRelations<Selecteds extends NewUsersRelationSelection>(
    relations: Selecteds
  ): NewUsersCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): NewUsersCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): NewUsersCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): NewUsersCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof NewUsers]: -1 | 1;
  }): NewUsersCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): NewUsersCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): NewUsersCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): NewUsersCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const newusers = new NewUsersCursor('650057c06095ae002d1095f3',Bucket.data,NewUsersRelationFields)

const CountRelationFields: string[] = []
type CountRelationEnum = []
type CountRelationSelection = ConvertEnumToSelection<CountRelationEnum>
type CountCursorMethods<
  R extends string[] = [],
  P extends boolean = false,
  L extends boolean = true
> = RemoveProps<
  CountCursor<R, P, L>,
  Exclude<Props<CRUD<Count<R, L>, P>>, 'get' | 'getAll'>
>;

class CountCursor<R extends string[] = [], P extends boolean = false, L extends boolean = true> extends Cursor<Count<R,L>,P>{
  
  override resolveRelations<Selecteds extends CountRelationSelection>(
    relations: Selecteds
  ): CountCursorMethods<Selecteds, P, L> {
    return super.resolveRelations(relations);
  }

  override nonLocalize(): CountCursorMethods<R, P, false> {
    return super.nonLocalize();
  }

  override limit(limit: number): CountCursorMethods<R, P, L> {
    return super.limit(limit);
  }

  override skip(skip: number): CountCursorMethods<R, P, L> {
    return super.skip(skip);
  }

  override sort(sort: {
    [T in keyof Count]: -1 | 1;
  }): CountCursorMethods<R, P, L> {
    return super.sort(sort);
  }

  override filter(filter: any): CountCursorMethods<R, P, L> {
    return super.filter(filter);
  }

  override translate(
    language: AvailableLanguages
  ): CountCursorMethods<R, P, L> {
    return super.translate(language);
  }

  override paginate(): CountCursorMethods<R, true, L> {
    return super.paginate();
  }

}
        
export const count = new CountCursor('6385cbc7ea080c002bb484ac',Bucket.data,CountRelationFields)
