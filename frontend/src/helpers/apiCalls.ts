// a wrapper to use fetch to do api calls
export const apiCall = async (url: string, method: string, body?: any) => {
    const response = await fetch(url, {
        method,
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return response.json();
}