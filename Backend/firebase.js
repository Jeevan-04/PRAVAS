import admin from "firebase-admin";

const serviceAccount = {
    "type": "service_account",
    "project_id": "pravas-49bde",
    "private_key_id": "95e6cb7161c76c8ccbed171f1e2ee299275475b0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFOsgl3izwTv5j\n+3PGJCmDxS6BhREhaYNpfncVN6MP7eBtpWfmXWwTN2Qid1vm3pTEVg3NB7/bWBqA\nYwf6RfwzYsPMYVveomwbTCcev7ho7CrMxmOQn3XOaLraR5NsUjFdp5INyqIl4sIY\nxMb7failyVtw25PJEOBysTLRpVxayQu3ys79m9YUXhntEiwkDfA1ryqY9LmwtEhJ\nuAHx35OYbNaW3YGGQ+sk7z3/LS/cC7dTMay2llKV9fXiR+rCRnhqxQpgqrtzWgsI\nxvD3uJ1E3n54KZ0+2jMxZyrAgc+pDMwEpDUCqLcwJmElABPCBCeUEnDFkADa8BVh\nGS37ivXtAgMBAAECggEAAMXj2G5fPeJuQ4mqdGoMJbfQ7rUUHNwM+xvlTzLlYBNp\nvWi4MSsyn4vhR/PbTtOWjxFwDZOHK+QMpd/kmc5R6iVPiN5WtOxe/WCCufaZH8sK\nR5IEfGHfnT7n5FpmS/3cXdZ20v9nETw5QgamTVXeN9/nWrSwRtgMgZk9B4BgnCYj\n+YX8M2R5D8TLVSnfzd/+7pYe47pbFe5SvlebpB6pzeXNP5EyOUxsfS+1kogHSEun\nM69EJpUYaTZg5vxY+aJ8CBeKUni4oWmYirSwp/ZtDf+HMyotOCFRPz6nqLYZcxKf\nvUyuhwjEGr4/IGEZZ0oy/S7i5Vl6wXvqt1rPhKsRWQKBgQDvl+Uca9vnr2LoQvtV\n2l7baZ/mdZtcvkVzfSZNn9lgWRltRVy0hUISBJ6qVHudRIF3VK89RtCPJpGh9jQS\nV1YNtQTGfrNDvuYWKEvRaGF8SaKX2GHhcKNj7OoAxFAYEF3F8wvlZS05donIhowc\nJhIUaxJJI3ADFcxx5WIP6IOEqQKBgQDSvD6skq8d9wz6K8eGZAR8q8hAVH5z1VEB\n0MlsKy8OLBcNQlT2exZ9vXoKKptjl74iM3lvj08rQBhGRT/8bOrTK8g2lQsMtXkf\nrmPIyFEMdafzVTzfS8hqNkYOhE+tg4PGDhMSMGq24nv5o5I4uSlN/yCT7A5x6nPA\nju3r2QbtpQKBgQDaqtHCt7ny4QIvInrKp0ttiyARsIKECW/PcIgVzm8RXSA0t1pd\ns0VStn6szAApz40tgM+S6F+OVtARdmed2bHDPtPF6XrouIC79jkEPPTD/1xyo1zp\n6OhmWaJT4teKrt02vZS83zOAP2yO5CVZx3E2y2Xb9IjVd/6ocIaoKDhoSQKBgBFH\numPwS0fLwFarTFsqzGtksrEDvLLG5TOe6UVjbSJeXy2JKOplQXziEqXOxJswEDlB\nu014lOdZBCSO/SY30DGsv2gqZJOQNfRxGmGWe37oDvOXI7yzvCVpeekq1FXIGQAe\nm1W8fqOsgrn/vbfFBywMJaG7k5unvAIoNj5Gt5i5AoGBAK9nTJgZrJkJp+x3k2xc\nxs6fcpaTxIA21/oH2bruwZNKhbGZBuTbyhaM6ypr6NneGHfhhr63sIVEc9rCVhE4\nW4/eu9Gj5q/jciZ5LwLlLyPw7+1VgcDYbaNH8O+VnVs9Xqpqn9jZ8ApL9n0qwXV2\nF7UxLfuesVIeasRQ3i+J6klv\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-i1107@pravas-49bde.iam.gserviceaccount.com",
    "client_id": "100505272317110676595",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i1107%40pravas-49bde.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();

export default admin;