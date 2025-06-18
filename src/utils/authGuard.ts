import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import Cookies from 'js-cookie';

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get("accessToken");
  console.log(accessToken);
  if (accessToken === null || accessToken === "") {
    return false;
  } else {
    return true;
  }
};

export const getUserRole = (): string | undefined => {
  return Cookies.get('user_role');
};

export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated()) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (!isAuthenticated()) {
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    }

    const userRole = getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      next({ path: '/unauthorized' });
      return;
    }

    next();
  };
};