export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const user = await userStore.fetchUser();
  if (to.path === "/login") return;
  if (!user) return navigateTo("/login");
  if (to.path === "/login" && user) return navigateTo("/");
});
