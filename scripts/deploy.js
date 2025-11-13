const { getHttpEndpoint } = require('@orbs-network/ton-access');
const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToWalletKey } = require('@ton/crypto');
const { compileFunc } = require('@ton-community/func-js');
const fs = require('fs');
const path = require('path');

async function deploy() {
    console.log('🚀 Подготовка к деплою SymbolNFT в testnet...');
    
    // 1. Компилируем контракт
    console.log('📦 Компиляция контракта...');
    const contractCode = fs.readFileSync(path.join(__dirname, '../contracts/SymbolNFT.fc'), 'utf8');
    
    const compileResult = await compileFunc({
        targets: ['SymbolNFT.fc'],
        sources: { 'SymbolNFT.fc': contractCode }
    });
    
    if (compileResult.status !== 'ok') {
        console.log('❌ Ошибка компиляции:', compileResult.message);
        return;
    }
    
    console.log('✅ Контракт скомпилирован');
    
    // 2. Подключаемся к testnet
    console.log('🔗 Подключение к TON testnet...');
    const endpoint = await getHttpEndpoint({ network: 'testnet' });
    const client = new TonClient({ endpoint });
    console.log('✅ Подключено к TON testnet');
    
    // 3. Информация о деплое
    console.log('📋 Информация для деплоя:');
    console.log('📍 Адрес твоего кошелька:', 'UQAjFd47HbPvN3H4W8Zqk0wM_59ZOI6L855leAJ67G9wYPsO');
    console.log('💰 Убедись что на кошельке есть testnet TON');
    console.log('🔐 Для полного деплоя нужна мнемоническая фраза кошелька');
    
    console.log('\\n🎯 Следующие шаги:');
    console.log('1. Получить testnet TON в @testgiver_ton_bot');
    console.log('2. Добавить мнемоническую фразу в скрипт');
    console.log('3. Задеплоить контракт в testnet');
}

deploy().catch(console.error);
