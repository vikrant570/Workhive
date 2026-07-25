interface partialUserInfo {
    _id: string,
    fullname: string,
    username: string
}

interface professionalUserInfo extends partialUserInfo {
    workplace: string,
    jobTitle: string
}

interface fullUserInfo extends professionalUserInfo {
    email: string;
    bio?: string;
}

interface toastMsgInterface {
    text: string,
    type: 'success' | 'error' | 'info'
}

interface params {
    params: Promise<{ [key: string]: string }>
}