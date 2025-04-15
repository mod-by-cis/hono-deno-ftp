import type { PATH } from "../ftp.ts";
export default function getDirectoryCatalog(Q:[string,string,string,string]):PATH {
  const [c_req_raw_url, c_req_path, url, dir] = Q;
  const FULLY = c_req_raw_url.replace(/\/$/, '');
  const OUTER_url = new URL(FULLY);
  const UPPER = (OUTER_url.href.slice(0, (-1*`/${OUTER_url.pathname.split('/').at(-1)}`.length))).replace(/\/$/, '');
  const ROUTE = c_req_path;
  const TITLE = ROUTE.replace(new RegExp(`^${url}`), "") || "/";
  const LOCAL = `${dir}${TITLE}`;
  return {
    UPPER,
    FULLY,
    ROUTE,
    TITLE,
    LOCAL
  };
}
