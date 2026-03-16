export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  if (userStore.loading) {
    return;
  }
  if (!userStore.user) {
    await userStore.fetchUser();
  }

  const user = userStore.user;

  if (user && to.path === "/login") {
    return navigateTo("/");
  }
  if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
