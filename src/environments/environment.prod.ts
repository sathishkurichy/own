/*
* PROD
* */
export const environment = {
    production: true
};
export class Constantes {

    public static PDF_ENDPOINT            = '/assets/pdf';
    public static APP_VERSION             = '0.0.10';
    public static IONIC_CLOUD_APP_ID      = '5ea6d6ce';
    public static IS_DEV_MODE             = true;

    public static COOKIE_ACCEPTED         = 'beaba_cookie_accepted';
    public static COOKIE_SOCIAL_ACCEPTED  = 'beaba_cookie_social_share_accepted';

    public static SERVER_URL                          = 'http://nutrition.beaba.com';
    public static KEYCLOAK_CONFIG_FILE                = 'assets/keycloak.dev.json';
    public static KEYCLOAK_TOKEN_ENDPOINT             = 'https://auth.beaba.com/auth/realms/beaba_dev/protocol/openid-connect/token';
    public static KEYCLOAK_GOOGLE_TOKEN_ENDPOINT      = 'https://auth.beaba.com/auth/realms/beaba_dev/protocol/openid-connect/token';

    public static BACKEND_URL = 'http://connect.beaba.com';

    public static KEYCLOAK_ROLE_PARENT_REFERENT = "95349634-a1b1-44e2-92fc-e2c6e14603d1";// TODO

}
