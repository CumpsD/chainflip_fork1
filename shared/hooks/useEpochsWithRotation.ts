import { useMemo } from 'react';
import { type ApolloError, type QueryHookOptions, useQuery } from '@apollo/client';
import { gql } from '@/shared/graphql/generated';
import {
  type EpochWithRotationFragment,
  type GetLatestEpochsQuery,
  type GetLatestEpochsQueryVariables,
} from '../graphql/generated/graphql';

export const getLatestEpochsQuery = gql(/* GraphQL */ `
  query GetLatestEpochs($limit: Int!) {
    latestEpoch: allEpoches(first: $limit, orderBy: ID_DESC) {
      nodes {
        ...EpochWithRotation
      }
    }
  }
`);

type EpochHook = {
  epochsWithRotation: EpochWithRotationFragment[] | null;
  loading: boolean;
  error?: ApolloError;
};

export default function useEpochsWithRotation(
  options?: QueryHookOptions<GetLatestEpochsQuery, GetLatestEpochsQueryVariables>,
): EpochHook {
  const result = useQuery(getLatestEpochsQuery, {
    variables: { limit: 1 },
    context: { clientName: 'processor' },
    ...options,
  });

  return useMemo(() => {
    let epochInfo = null;

    const { data, loading, error } = result;

    if (data?.latestEpoch?.nodes.length) {
      epochInfo = data.latestEpoch.nodes;
    }

    return { epochsWithRotation: epochInfo, loading, error };
  }, [result]);
}
