const AUTH_TOKEN_KEY = 'id_token';

class AuthService {
    getAuthToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    setAuthToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    hasAuthToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
    }
}

export default new AuthService();