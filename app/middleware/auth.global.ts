export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const user = userStore.user;
  if (user && to.path === "/login") {
    return navigateTo("/");
  }

  if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
