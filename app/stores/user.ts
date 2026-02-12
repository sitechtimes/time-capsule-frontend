export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>();
  const theme = ref("light");

  function signOut() {
    user.value = undefined;
  }

  async function signIn(email: string, password: string): Promise<Error | undefined> {
    const { data, error } = await tryRequestEndpoint<User>("/login", "POST", {
      email,
      password
    });
    if (error) return error;
    user.value = data;
  }

  async function fetchData(url: string, method?: string, body?: any) {
    const options: RequestInit = { credentials: "include" };
    if (method) {
      options.method = method;
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }
    return await fetch(import.meta.env.VITE_URL + url, options);
  }
  return {
    user,
    signOut,
    signIn,
    theme,
    fetchData
  };
});
