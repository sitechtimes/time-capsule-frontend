export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();
  await userStore.fetchUser();
  const user = userStore.user;
  if (user && to.path === "/login") {
    return navigateTo("/");
  }

  if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
