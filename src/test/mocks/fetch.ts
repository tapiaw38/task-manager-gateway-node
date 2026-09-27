export const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export const emptyResponse = (status = 204) => new Response(null, { status });

export const errorResponse = (code: string, message: string, status: number) =>
    jsonResponse({ code, message }, status);
