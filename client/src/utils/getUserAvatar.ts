export const getUserAvatar = (username: string): string => {
  return `https://api.dicebear.com/8.x/personas/svg?seed=${username}`;
};
