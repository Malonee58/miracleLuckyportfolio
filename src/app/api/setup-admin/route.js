import argon2 from "argon2";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM auth_users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "Admin user already exists" },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const [newUser] = await sql`
      INSERT INTO auth_users (email, name, "emailVerified")
      VALUES (${email}, 'Admin', NOW())
      RETURNING id
    `;

    // Create credentials account
    await sql`
      INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
      VALUES (${newUser.id}, 'credentials', 'credentials', ${email}, ${hashedPassword})
    `;

    return Response.json({
      success: true,
      message: "Admin user created successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Setup admin error:", error);
    return Response.json(
      { error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}
