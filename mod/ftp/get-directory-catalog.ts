import type { PATH } from "../ftp.d.ts";
function getDirectoryCatalog(Q:[string,string,string,string]):PATH {
  const [c_req_raw_url, c_req_path, url, dir] = Q;
  const FULLY = c_req_raw_url.replace(/\/$/, '');
  const OUTER_url = new URL(FULLY);
  const UPPER = (OUTER_url.href.slice(0, (-1*`/${OUTER_url.pathname.split('/').at(-1)}`.length))).replace(/\/$/, '');
  const ROUTE = c_req_path;
  const TITLE = ROUTE.replace(new RegExp(`^${url}`), "") || "/";
  const LOCAL = `${dir}${TITLE}`;
  const START = `${OUTER_url.protocol}//${OUTER_url.host}`;
  return {
    START,
    UPPER,
    FULLY,
    ROUTE,
    LOCAL,
    TITLE
  };
}

export default getDirectoryCatalog;
