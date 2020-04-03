export function createUrlFromRoute(route: string, params: { [name: string]: string | number }): string {
  return route.replace(/(:\w+)/g, match => {
    return String(params[match.substring(1)]);
  });
}
