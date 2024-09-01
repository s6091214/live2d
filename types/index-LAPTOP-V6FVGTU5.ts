declare global {
  type UserType = {
    displayName: string | null;
    photoURL: string | null;
    uid: string;
    email: string | null;
  };
}
