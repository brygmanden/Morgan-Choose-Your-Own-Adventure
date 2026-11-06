import pages from './story-data.json' with { type: 'json' };

export { pages };
export const START_PAGE = 1;

export function routeIsValid(route) {
  if (!Array.isArray(route) || route[0] !== START_PAGE || route.length < 1 || route.length > 3) return false;
  return route.every((page, index) => {
    if (!pages[page]) return false;
    if (index === 0) return true;
    return (pages[route[index - 1]].choices ?? []).some(choice => choice[1] === page);
  });
}

export function nextRoute(route, page) {
  if (!routeIsValid(route)) throw new Error('Invalid current route');
  if (!(pages[route.at(-1)].choices ?? []).some(choice => choice[1] === page)) throw new Error('Invalid next page');
  return [...route, page];
}

export function routeTo(route, page) {
  const index = route.indexOf(page);
  if (index < 0) throw new Error('Page not in current route');
  return route.slice(0, index + 1);
}
