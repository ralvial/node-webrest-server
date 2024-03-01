import 'dotenv/config';
import { get } from "env-var";


export const envs = {
    //PORT: Que hace...
    PORT: get('PORT').required().asPortNumber(),
    //PUBLIC_PATH: que hace...
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),

}

