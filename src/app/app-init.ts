import { AuthService } from './../services/auth.service';

export function initializer(auth: AuthService): () => Promise<any> {
    return (): Promise<any> => {
        return auth.init();
    }
}