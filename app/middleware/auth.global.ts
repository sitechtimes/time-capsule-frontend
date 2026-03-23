export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  const { loggedIn } = useUserSession();

  const userStore = useUserStore();
  await userStore.fetchUser();

  if (loggedIn.value && to.path === "/login") {
    return navigateTo("/");
  }

  if (!loggedIn.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
