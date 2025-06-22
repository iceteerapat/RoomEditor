export function decodeJwt(token){
    if(!token || typeof token !== 'string'){
        return null;
    }

    try{
        const parts = token.split('.');
        if(parts.length !== 3){
            return null;
        }

        const payload = parts[1];
        const decodePayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodePayload);
    }catch(error){
        console.error('Error decoding JWT:', error);
        return null;
    }
}