
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/") {
      return new Response("Student Task Manager API is running!", {
        headers: corsHeaders,
      });
    }

    if (!path.startsWith("/api/tasks")) {
      return jsonResponse({ error: "Route not found" }, 404);
    }

    const parts = path.split("/");
    const taskId = parts.length === 4 ? parts[3] : null;
    const collectionPath = path === "/api/tasks";

    try {
      // GET /api/tasks — List all tasks
      if (collectionPath && request.method === "GET") {
        const listed = await env.TASKS.list();
        const tasks = await Promise.all(
          listed.keys.map(async (key) => {
            const value = await env.TASKS.get(key.name);
            return value ? JSON.parse(value) : null;
          })
        );

        return jsonResponse(tasks.filter(Boolean));
      }

      // POST /api/tasks — Create a task
      if (collectionPath && request.method === "POST") {
        let body;

        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "Invalid JSON body" }, 400);
        }

        if (typeof body.title !== "string" || !body.title.trim()) {
          return jsonResponse(
            { error: "A non-empty title is required" },
            400
          );
        }

        const task = {
          id: crypto.randomUUID(),
          title: body.title.trim(),
          description:
            typeof body.description === "string"
              ? body.description.trim()
              : "",
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await env.TASKS.put(task.id, JSON.stringify(task));
        return jsonResponse(task, 201);
      }

      // Individual task endpoints require an ID
      if (taskId && taskId !== "api") {
        const existingValue = await env.TASKS.get(taskId);

        if (!existingValue) {
          return jsonResponse({ error: "Task not found" }, 404);
        }

        const existing = JSON.parse(existingValue);

        // GET /api/tasks/:id — Read one task
        if (request.method === "GET") {
          return jsonResponse(existing);
        }

        // PUT /api/tasks/:id — Update a task
        if (request.method === "PUT") {
          let body;

          try {
            body = await request.json();
          } catch {
            return jsonResponse({ error: "Invalid JSON body" }, 400);
          }

          if (
            body.title !== undefined &&
            (typeof body.title !== "string" || !body.title.trim())
          ) {
            return jsonResponse(
              { error: "Title must be a non-empty string" },
              400
            );
          }

          if (
            body.completed !== undefined &&
            typeof body.completed !== "boolean"
          ) {
            return jsonResponse(
              { error: "Completed must be true or false" },
              400
            );
          }

          if (
            body.description !== undefined &&
            typeof body.description !== "string"
          ) {
            return jsonResponse(
              { error: "Description must be a string" },
              400
            );
          }

          const updated = {
            ...existing,
            ...(body.title !== undefined && {
              title: body.title.trim(),
            }),
            ...(body.description !== undefined && {
              description: body.description.trim(),
            }),
            ...(body.completed !== undefined && {
              completed: body.completed,
            }),
            updatedAt: new Date().toISOString(),
          };

          await env.TASKS.put(taskId, JSON.stringify(updated));
          return jsonResponse(updated);
        }

        // DELETE /api/tasks/:id — Delete a task
        if (request.method === "DELETE") {
          await env.TASKS.delete(taskId);

          return new Response(null, {
            status: 204,
            headers: corsHeaders,
          });
        }

        return jsonResponse({ error: "Method not allowed" }, 405);
      }

      return jsonResponse({ error: "Route not found" }, 404);
    } catch (error) {
      return jsonResponse(
        { error: "Internal server error" },
        500
      );
    }
  },
};
