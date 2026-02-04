import { json } from "@react-router/node";

export async function loader() {
	return json({
		ok: true,
		message: "API is alive",
	});
}
