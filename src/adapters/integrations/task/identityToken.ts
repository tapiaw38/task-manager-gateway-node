const metadataIdentityURL =
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';

export type IdentityTokenProvider = (audience: string) => Promise<string>;

export const getIdentityToken: IdentityTokenProvider = async (audience) => {
    const response = await fetch(
        `${metadataIdentityURL}?audience=${encodeURIComponent(audience)}`,
        { headers: { 'Metadata-Flavor': 'Google' } },
    );

    if (!response.ok) {
        throw new Error('could not obtain task service identity token');
    }

    return response.text();
};
