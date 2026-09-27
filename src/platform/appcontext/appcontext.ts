import type {
    Integrations,
    IntegrationsFactory,
} from '../../adapters/integrations/integrations';

export interface AppContext {
    integrations: Integrations;
}

export type AppContextFactory = () => AppContext;

export const createAppContextFactory =
    (integrationsFactory: IntegrationsFactory): AppContextFactory =>
    () => ({
        integrations: integrationsFactory(),
    });
