export default defineNuxtRouteMiddleware((to) => {
  const authStore = useUserStore();
  if (to.path === "/login") return;
  if (!authStore.user) return navigateTo("/login");
  if (to.path === "/login" && authStore.user) return navigateTo("/");
});
