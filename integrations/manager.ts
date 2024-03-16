/* eslint-disable no-console */
import { ethers } from 'ethers';
import { from, mergeMap, type Observable, scan, map } from 'rxjs';
import { type WalletClient } from 'wagmi';
import { type ChainId, type Chain } from '@/shared/assets/chains';
import { type Token } from '@/shared/assets/tokens';
import { entries, isFullfilled, isRejected, isTruthy, sleep } from '@/shared/utils';
import { storeRouteInLocalStorage } from './storage';
import {
  type Integration,
  type RouteRequest,
  type RouteResponse,
  type StatusResponse,
  type ExecuteSwapResponse,
  type PrepareSwapResponse,
} from './index';

export interface BaseIntegration<T extends Token = Token> {
  readonly name: string;
  readonly logo: (props?: React.SVGProps<SVGSVGElement>) => JSX.Element;
  getChains(): Promise<Chain[]>;
  getTokens(chainId: ChainId): Promise<T[]>;
  getDestinationChains(srcChainId: ChainId): Promise<Chain[]>;
  getRoutes(routeParams: RouteRequest): Promise<RouteResponse[]>;
  getStatus(swapId: string): Promise<StatusResponse | undefined>;
  executeSwap(swapId: string, walletClient: WalletClient): Promise<ExecuteSwapResponse>;
}

export const getDeterministicRouteId = (route: Omit<RouteResponse, 'id'>) => {
  const identificationData = [
    route.srcAmount.toString(),
    route.integration,
    route.steps.map((step) => [
      step.protocolName,
      step.srcToken.chain.id,
      step.srcToken.address,
      step.destToken.chain.id,
      step.destToken.address,
    ]),
  ];

  return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(identificationData)));
};

export class IntegrationManager {
  static from(integrations: Record<Integration, BaseIntegration | Promise<BaseIntegration>>) {
    let integrationTuples = entries(integrations);

    if (isTruthy(process.env.NEXT_PUBLIC_INTEGRATION_WHITELIST)) {
      const whitelist = process.env.NEXT_PUBLIC_INTEGRATION_WHITELIST.split(',');
      integrationTuples = integrationTuples.filter(([integration]) =>
        whitelist.includes(integration),
      );
    }

    const awaitedIntegrations = {} as Record<Integration, BaseIntegration>;
    const instance = new IntegrationManager(awaitedIntegrations);

    Promise.all(
      integrationTuples.map(async ([name, manager]) => {
        try {
          const controller = new AbortController();
          const awaited = await Promise.race([
            Promise.resolve(manager),
            sleep(10000, { signal: controller.signal }).then(() =>
              Promise.reject(Error('timeout')),
            ),
          ]);
          controller.abort();
          if (awaited) awaitedIntegrations[name] = awaited;
        } catch (error) {
          console.error('failed to initialize integration', name, error);
        }
      }),
    ).then(() => {
      instance.ready = true;
    });

    return instance;
  }

  private ready = false;

  private constructor(private readonly integrations: Record<Integration, BaseIntegration>) {
    this.integrations = integrations;
  }

  private async ensureReady() {
    while (!this.ready) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(10);
    }
  }

  getIntegration(integration: string) {
    if (!(integration in this.integrations)) {
      throw new Error(`integration "${integration}" not found`);
    }

    return this.integrations[integration as Integration];
  }

  getName = (integration: Integration) => this.getIntegration(integration).name;

  getLogo = (integration: Integration) => this.getIntegration(integration).logo;

  getChains = (): Observable<Chain[]> =>
    from(this.ensureReady()).pipe(
      mergeMap(() => Object.values(this.integrations).map((i) => i.getChains())),
      mergeMap((v) => v.catch((err) => err)),
      scan(
        (acc: Chain[], curr: Chain[]) =>
          acc.concat(curr.filter((c) => acc.every((a) => a.id !== c.id))),
        [],
      ),
    );

  getTokens(chainId: ChainId): Observable<Token[]> {
    return from(this.ensureReady()).pipe(
      mergeMap(() =>
        Object.values(this.integrations).map((i) =>
          i.getTokens(chainId).catch((err) => {
            console.error('error loading tokens for integration', i.name, err);

            return [] as Token[];
          }),
        ),
      ),
      mergeMap((v) => v),
      scan(
        (acc, tokens) =>
          new Map([...acc.entries(), ...tokens.map((t) => [t.address.toLowerCase(), t] as const)]),
        new Map<string, Token>(),
      ),
      map((tokenMap) => Array.from(tokenMap.values())),
    );
  }

  getDestinationChains = (srcChainId: ChainId): Observable<Chain[]> =>
    from(this.ensureReady()).pipe(
      mergeMap(() =>
        Object.values(this.integrations).map((i) => i.getDestinationChains(srcChainId)),
      ),
      mergeMap((v) => v.catch((err) => err)),
      scan(
        (acc: Chain[], curr: Chain[]) =>
          acc.concat(curr.filter((c) => acc.every((a) => a.id !== c.id))),
        [],
      ),
    );

  getRoutes = async (routeRequest: RouteRequest): Promise<RouteResponse[]> => {
    await this.ensureReady();
    const promises = Object.values(this.integrations).map((i) => i.getRoutes(routeRequest));

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter(isFullfilled).flatMap((result) => result.value);

    for (const result of results.filter(isRejected)) {
      console.error('error getting all routes:', result.reason);
    }
    return fulfilled;
  };

  getStatus = async (
    integration: Integration,
    swapId: string,
  ): Promise<StatusResponse | undefined> => {
    await this.ensureReady();
    return this.getIntegration(integration).getStatus(swapId);
  };

  prepareSwap = async (route: RouteResponse): Promise<PrepareSwapResponse> => {
    await this.ensureReady();

    const preparedSwapId = crypto.randomUUID();
    storeRouteInLocalStorage(route.integration, preparedSwapId, route);

    return {
      integration: route.integration,
      id: preparedSwapId,
    };
  };

  executeSwap = async (
    integration: Integration,
    swapId: string,
    walletClient: WalletClient,
  ): Promise<ExecuteSwapResponse> => {
    await this.ensureReady();
    return this.getIntegration(integration).executeSwap(swapId, walletClient);
  };
}
