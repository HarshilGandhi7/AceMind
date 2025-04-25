"use server";

import { cookies } from "next/headers";
import { db, auth } from "../../firebase/admin";

export async function SignUp(params: SignUpParams) {
  const { uid,name, email, password } = params;

  try {
    // Check if user already exists
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: "False",
        message: "User already exists",
      };
    }

    // Create new user
    const user = await db.collection("users").doc(uid).set({
      name,
      email,
      password,
    });

    return {
      success: "True",
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error("error creating user", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: "False",
        message: "Email already in use",
      };
    }
  }
}

export async function setSessionCookie(idToken: string) {
  try {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });
    cookieStore.set("session", sessionCookie, {
      maxAge: 60 * 60 * 24 * 5,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error: any) {
    console.error("Error setting session cookie", error);
    return;
  }
}

export async function SignIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: "False",
        message: "User not found",
      };
    }
    await setSessionCookie(idToken);
    return {
      success: "True",
      message: "User signed in successfully",
    };
  } catch (error: any) {
    console.error("error signing in", error);
    return {
      success: "False",
      message: "Error signing in",
    };
  }
}

export async function GetCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.user_id;
    const userRecord = await db.collection("users").doc(userId).get();
    if (!userRecord) return null;
    return{
      ...userRecord.data(),
      name: userRecord.data()?.name,
      id: userId,
    } as User
  } catch (e) {
    console.error("Error getting current user", e);
    return null;
  }
}

export async function isAuthenticated(){
  const user = await GetCurrentUser();
  return !!user;
}