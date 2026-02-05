import { handle } from "react-router-hono-server/vercel";
// This imports the server build created by 'react-router build'
import * as build from "../build/server/index.js";

export default handle(build);
