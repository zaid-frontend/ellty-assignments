"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from "@/app/action/definitions";
import { createSession, deleteSession } from "@/app/action/02-database-session";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  // 3. Check if the user's email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      message: "Email already exists, please use a different email or login.",
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Insert the user into the database
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // 5. Create a session for the user
  await createSession(user.id);
  
  // This line will never be reached because createSession redirects
  return { message: "Success" };
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const errorMessage = { message: "Invalid login credentials." };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Query the database for the user with the given email
  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  // If user is not found, return early
  if (!user) {
    return errorMessage;
  }

  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password
  );

  // If the password does not match, return early
  if (!passwordMatch) {
    return errorMessage;
  }

  // 4. If login successful, create a session for the user
  await createSession(user.id);
  
  return { message: "Success" };
}

export async function logout() {
  await deleteSession();
}