// src/blockchain/ton-config.ts
export const TON_CONFIG = {
    network: 'testnet', // 'mainnet' or 'testnet'
    apiEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    explorerUrl: 'https://testnet.tonscan.org',
    symbolNFTCode: 'standard_nft_code_here' // Будет позже
};

export const SYMBOL_PROTOCOL_FEES = {
    creationFee: 1.0, // TON for creating new symbol
    tradeFee: 0.01, // 1% protocol fee
    royaltyFee: 0.05 // 5% royalty to creator
};
