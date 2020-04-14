export default class UserToken {
    constructor() {
        this.name = "";
        this.pass = "";
        this.auth = "";
        this.isAuthed = false;
        this.user = null;
    }

    initialize(logedin, user, pass, token, isAutherized) {
        this.name = user;
        this.pass = pass;

        if (token === null || token === undefined) {
            this.auth = user + ":" + pass;
        }

        if (token.length === 0) {
            this.auth = user + ":" + pass;
        }

        this.auth = token;

        this.isAuthed = isAutherized;

        this.user = logedin;
    }

    static fromSession() {
        let t = sessionStorage.getItem("UserToken") || null;

        let token = new UserToken();

        if (t !== null) {
          token = JSON.parse(t);
        }

        return token;
    }

    static signOut() {
        sessionStorage.setItem("UserToken", "");
    }
}
