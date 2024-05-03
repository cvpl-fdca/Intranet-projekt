import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { PUBLIC_ENVIRONMENT } from '$env/static/public';

async function getSecretFromKeyVault(secretName: string, vaultUrl: string): Promise<string | undefined> {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(vaultUrl, credential);

    const secret = await client.getSecret(secretName);

    return secret.value;
}

async function getEmailSecret() {
    const emailAccountJson = await getSecretFromKeyVault('emailAccountJson', 'https://fdca-intranet.vault.azure.net/');

    return { emailAccountJson };
}

async function getFirebaseSecret() {
    let firebaseAccountJson;

    if (PUBLIC_ENVIRONMENT.toLowerCase() == "dev" || PUBLIC_ENVIRONMENT.toLowerCase() == "test") {
        firebaseAccountJson = await getSecretFromKeyVault('firebaseAccountJsonDev', 'https://fdca-intranet.vault.azure.net/');
    }

    else if (PUBLIC_ENVIRONMENT.toLowerCase() == "prod") {
        firebaseAccountJson = await getSecretFromKeyVault('firebaseAccountJson', 'https://fdca-intranet.vault.azure.net/');
    } else {
        if (typeof window !== 'undefined') {
            alert('environment variable not set!');
        }
        else {
            console.log('environment variable not set!');
        }
    }

    return { firebaseAccountJson };

}



export { getSecretFromKeyVault, getEmailSecret, getFirebaseSecret };
