async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
    }
}

async function checkAdminSession() {
    const response = await fetchWithTimeout('/api/auth/session', { credentials: 'same-origin' });
    if (response.status === 401) {
        window.location.replace('/login.html');
        return null;
    }
    if (!response.ok) throw new Error('Unable to verify the admin session.');
    return response.json();
}

async function logoutAdmin() {
    try {
        const response = await fetchWithTimeout('/api/auth/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
        if (!response.ok) throw new Error('Unable to sign out.');
        window.location.replace('/login.html');
    } catch (error) {
        console.error('Logout error:', error);
        window.alert(error.message);
    }
}
