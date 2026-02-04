import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return Response.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      problem,
      solution,
      technologies,
      category,
      image_url,
      live_link,
      github_link,
    } = body;

    const result = await sql`
      INSERT INTO projects (title, description, problem, solution, technologies, category, image_url, live_link, github_link)
      VALUES (${title}, ${description}, ${problem}, ${solution}, ${technologies}, ${category}, ${image_url}, ${live_link}, ${github_link})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return Response.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
