export const TON_CONFIG = {
    RPC_URL: process.env.TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC',
    NETWORK: process.env.TON_NETWORK || 'mainnet',
    GAS_LIMIT: 0.05,
    DEX_ADDRESSES: {
        STON_FI: 'EQD...',
        DEDUST: 'EQD...'
    }
};
