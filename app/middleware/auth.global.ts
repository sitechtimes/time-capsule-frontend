export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (to.path === "/login") return;

  if (!authStore.user) return navigateTo("/login");

  if (to.path === "/login" && authStore.user) return navigateTo("/");
});
