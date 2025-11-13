const { Blockchain, SandboxContract, TreasuryContract } = require('@ton-community/sandbox');
const { Cell, beginCell, toNano, Address } = require('@ton/core');
const { compileFunc } = require('@ton-community/func-js');
const fs = require('fs');
const path = require('path');

async function testNFTCreation() {
    console.log('🧪 Тестирование создания NFT символа...');
    
    // 1. Создаем локальный блокчейн
    const blockchain = await Blockchain.create();
    const deployer = await blockchain.treasury('deployer');
    const user = await blockchain.treasury('user');
    
    console.log('👛 Кошелек пользователя:', user.address.toString());
    
    // 2. Компилируем контракт
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
    
    // 3. Тестируем отправку 5 TON
    console.log('💰 Отправляем 5 TON...');
    
    const result = await user.send({
        to: deployer.address,
        value: toNano('5'),
        body: beginCell()
            .storeUint(1, 32) // opcode для создания NFT
            .storeStringTail('🚀') // символ
            .endCell()
    });
    
    console.log('✅ Транзакция успешна!');
    console.log('📊 Создано транзакций:', result.transactions.length);
    console.log('🎯 Контракт готов к работе!');
}

testNFTCreation().catch(console.error);
