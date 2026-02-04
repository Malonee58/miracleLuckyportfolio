import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

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
      UPDATE projects 
      SET 
        title = ${title}, 
        description = ${description}, 
        problem = ${problem}, 
        solution = ${solution}, 
        technologies = ${technologies}, 
        category = ${category}, 
        image_url = ${image_url}, 
        live_link = ${live_link}, 
        github_link = ${github_link}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return Response.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return Response.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return Response.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
