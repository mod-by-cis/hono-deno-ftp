interface PATH_NESTED {
  icon:string;
  name:string;
  href:string;
}
interface PATH {
  START: string;
  UPPER: string;
  FULLY: string;
  ROUTE: string;
  LOCAL: string;
  TITLE: string;
}

type HonoFtpValidUrl= Exclude<`/${string}`, `/`>;
type HonoFtpValidUrl2<T extends string = string> =
  T extends `/${infer Rest}`
    ? Rest extends ""
      ? never
      : T
    : never;

/**
 * @template Handler - typ middleware, który zwróci Twoja aplikacja (np. MiddlewareHandler)
 * @template ServeFactory - fabryka tego middleware (np. serveStatic)
 * @template WalkFn        - funkcja walk z std/fs
 */
interface HonoFtpOptions<
  Handler,
  ServeFactory extends (opts: { root: string }) => Handler,
  WalkFn extends (
    path: string,
    options: { maxDepth: number; includeDirs: boolean; includeFiles: boolean }
  ) => AsyncIterable<{
    path: string;
    isDirectory: boolean;
    isFile: boolean;
    name: string;
  }>> {
  /** katalog do serwowania */
  dir: string;

  /** ścieżka URL, pod którą middleware ma działać */
  url: HonoFtpValidUrl;//<string> & string;//<string>; //string;

  /** opcjonalna funkcja renderująca HTML */
  layout?: (entries: PATH_NESTED[], path: PATH) => string;
  
  
  /** 
   * deps[0] – fabryka middleware (ServeFactory)  
   * deps[1] – funkcja walk (WalkFn)
   */
  deps: [ServeFactory, WalkFn];
}

export type { PATH_NESTED, PATH, HonoFtpOptions, HonoFtpValidUrl };
