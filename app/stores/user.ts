export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>();
  const theme = ref("light");

  function signOut() {
    user.value = undefined;
  }

  async function signIn(
    email: string,
    password: string
  ): Promise<Error | undefined> {
    const { data, error } = await tryRequestEndpoint<User>("/login", "POST", {
      email,
      password,
    });
    if (error) return error;
    user.value = data;
    console.log(user.value);
  }
  return {
    user,
    signOut,
    signIn,
    theme,
  };
});
