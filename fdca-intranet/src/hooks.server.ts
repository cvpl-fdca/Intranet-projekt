import { getUsername } from "$lib/login"
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = getUsername()

    const response = await resolve(event)

    return response
}