import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('blog/*', 'blog/page.tsx'),
  route('api/search', 'blog/search.ts'),
] satisfies RouteConfig;
