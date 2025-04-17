export function matchPathname(path, options = {}) {
  const { strict = false } = options;
  const currentPath = window.location.pathname;

  if (strict) {
    return currentPath === path;
  }

  return currentPath.startsWith(path);
}