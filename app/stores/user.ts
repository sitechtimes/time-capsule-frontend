import { useApi } from '~/composables/useApi';
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>();
  const theme = ref("light");
  const api = useApi()
  async function fetchData(url: string, method?: string, body?: any) {
    const options: RequestInit = { credentials: "include" };
    if (method) {
      options.method = method;
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }
    return await fetch(import.meta.env.VITE_URL + url, options);
  }
  const token = useCookie('auth_token')
  const login = async (credentials) => {
    const data = await $fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      body: credentials
    })
    token.value = data.access
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  return { token, user, login, logout }
})
  return {
    user,
    theme,
    fetchData
  };
});
