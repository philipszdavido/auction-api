export interface User {
  username: string;
  hashPassword: string;
}

const users: User[] = [
  {
    username: "",
    hashPassword: "",
  },
];

export function find(username: string) {
  return users.find((user) => user.username === username);
}

export function create(username: string, hashPassword: string) {
  if (find(username)) return;
  users.push({ username, hashPassword });
}

export function update(username: string, hashPassword: string) {
  const user = users.find((user: User) => user.username === username);
  if (!user) return;
  user.hashPassword = hashPassword;
}

export function remove(username: string) {
  const index = users.findIndex((user) => user.username === username);
  users.splice(index, 1);
}

export function getAll() {
  return users;
}
