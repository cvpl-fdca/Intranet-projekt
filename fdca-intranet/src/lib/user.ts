export class User {
    public details = {
        discordName: "",
        email: {
            fdca: "",
            private: "",
            work: ""
        },
        fullName: "",
        phone: {
            private: "",
            work: ""
        }
    };
    public roles = {
        isAdmin: false,
        projects: {
            sagalabs: false,
            soMe: false
        },
    };
    public uid = "";
    constructor(uid: string) {
        this.uid = uid;
    }
}