import { 
  Hono, 
  serveStatic, 
  trimTrailingSlash,
  type MiddlewareHandler,
  logger, 
  poweredBy, 
  type HonoFtpOptions, 
  honoDenoFtp, 
  walk
} from "./sample-deps.ts";

const appMain = new Hono();

appMain.use("*", logger(), poweredBy());
appMain.use("*", trimTrailingSlash());

// Przekazujesz swój Handler jako generyk i serveStatic jako fabrykę:
appMain.use(
  honoDenoFtp<
    MiddlewareHandler, 
    typeof serveStatic,
    typeof walk
  >({
    dir: "./sample/public",
    url: "/f",
    deps: [serveStatic, walk],
    // layout: (urlPath, entries) => customHtml
  } as HonoFtpOptions<
      MiddlewareHandler, 
      typeof serveStatic, 
      typeof walk
    >)
);

//appMain.get('/', (c) => {
//  // return c.redirect('/f', 301);
//  return c.redirect('/f');
//});

Deno.serve(/*{port:8007},*/ appMain.fetch);
