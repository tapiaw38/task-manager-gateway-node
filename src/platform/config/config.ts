export interface Configuration {
    appName: string;
    appVersion: string;
    server: {
        port: number;
        allowedOrigins: string[];
    };
    taskService: {
        baseUrl: string;
        timeoutMs: number;
        authenticationEnabled: boolean;
    };
    docs: {
        specPath: string;
    };
}
