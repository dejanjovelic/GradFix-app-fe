
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function getImageUrl(path) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${backendUrl}${path}`;
}
