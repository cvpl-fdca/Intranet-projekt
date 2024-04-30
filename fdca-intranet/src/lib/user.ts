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
        },
        certificate: "", // Add this line if certificate is a string
        arbejde: ""
    };
    public roles = {
        isAdmin: false,
        projects: {
            karkom: false,
            strøko: false,
            socsam: false
        },
    };
    public uid = "";
    constructor(uid: string) {
        this.uid = uid;
    }
}