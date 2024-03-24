import { sql } from "@vercel/postgres";

export interface User {
  id: number;
  username: string;
  hashPassword: string;
}

export async function find(username: string) {
  const { rows } = await sql`SELECT * from USERS where username=${username}`;
  console.log(rows);
  return rows[0];
}

export async function create(username: string, hashPassword: string) {
  if (await find(username)) return;

  await sql`INSERT INTO USERS (username, email, hashPassword)
  VALUES (${username}, ${hashPassword});  `;
}

export async function update(user: User) {
  await sql`UPDATE USERS
  SET hashPassword = ${user.hashPassword}, username = ${user.username}
  WHERE id = ${user.id};
  `;
}

export async function remove(user: User) {
  await sql`DELETE FROM USERS
  WHERE id = ${user.id};
  `;
}

export async function getAll() {
  return await sql`SELECT * FROM USERS`;
}
