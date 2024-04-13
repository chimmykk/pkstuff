import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';


const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

async function getMongoDBClient() {
  const uri = process.env.MONGODB_URI; // Use the environment variable
  if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set.');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('attendance-admin');
  return db;
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + 604800) // Adds 7 days to the current time
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// lib.ts

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
  const inputPassword = formData.get("password");

  try {
      const db = await getMongoDBClient(); // Establish connection to MongoDB
      const collection = db.collection('password'); // Access the 'password' collection

      console.log('Fetching hashed password from the database...');
      const doc = await collection.findOne(); // Fetch the document containing the password
      const storedHashedPassword = doc?.password;

      console.log('Hashed password retrieved:', storedHashedPassword);

      if (!storedHashedPassword) {
          console.log('No stored password found');
          return { success: false, message: 'No stored password found' };
      }

      // Check if inputPassword is null or not a string, and handle the case appropriately
      if (typeof inputPassword !== "string") {
        console.error("Password is not a string or is missing");
        return { success: false, message: 'Password is not a string or is missing' };
      }

      // Use bcrypt to compare the submitted password with the hashed password
      const match = await bcrypt.compare(inputPassword, storedHashedPassword);
      if (match) {
          // Assuming successful login
          const expires = new Date(Date.now() + 604800 * 1000); // 7 days from now
          const session = await encrypt({ user: { password: inputPassword }, expires });

          cookies().set("session", session, { expires, httpOnly: true });
          console.log('Password correct');
          return { success: true }; // Indicate successful login
      } else {
          console.log('Wrong password');
          return { success: false, message: 'Wrong password' }; // Indicate failed login
      }
  } catch (error) {
      console.error('Error fetching or comparing password:', error);
      return { success: false, message: 'Error fetching or comparing password' };
  }
}


export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  console.log('session destroyed')
}

export async function getSession() {
  const session = cookies().get("session")?.value;

  
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 604800 * 1000); // 604800 seconds * 1000 to convert to milliseconds 
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
