import { json } from '@sveltejs/kit';

export async function POST(request) {
    // Extract the CSP report from the request body
    const cspReport = request.body;

    // Log the CSP report for debugging
    console.log('CSP Report:', cspReport);

    // Respond with a 200 status to indicate that the report was received successfully
    return json({ success: true, message: 'CSP report received successfully' });
}

