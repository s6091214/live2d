export const useUser = () => {
  const userStore = useUserStore();
  const { fetchUsersData } = userStore;

  const getUsers = async () => {
    await fetchUsersData();
  };

  return {
    getUsers,
  };
};
