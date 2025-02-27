export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token").value;
  const { getUser } = useAuth().actions;
  const { auth } = useAuth();

  if (token && !auth.user) {
    getUser(token);
  }

  // If no token exists and the target route isn't the login page, redirect to login
  if (!token && !to.path.includes("auth")) {
    return navigateTo('/auth/login');
  }
});
