class User {
    private details = {
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
    private roles = {
        isAdmin: false,
        isMember: false,
        projects: {
            sagalabs: false,
            soMe: false
        },
    };
    private uid = "";
    constructor(uid: string) {
        this.uid = uid;
    }
}

