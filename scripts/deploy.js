const { getHttpEndpoint } = require('@orbs-network/ton-access');
const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToWalletKey } = require('@ton/crypto');

async function deploy() {
    console.log('🚀 Подготовка к деплою SymbolNFT...');
    
    // Подключение к testnet
    const endpoint = await getHttpEndpoint({ network: 'testnet' });
    const client = new TonClient({ endpoint });
    
    console.log('✅ Подключено к TON testnet');
}

deploy();
