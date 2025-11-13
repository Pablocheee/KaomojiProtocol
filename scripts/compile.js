const { compileFunc } = require('@ton-community/func-js');
const fs = require('fs');
const path = require('path');

async function compileContract() {
    console.log('Компиляция SymbolNFT...');
    
    const contractCode = fs.readFileSync(path.join(__dirname, '../contracts/SymbolNFT.fc'), 'utf8');
    
    try {
        const result = await compileFunc({
            targets: ['SymbolNFT.fc'],
            sources: {
                'SymbolNFT.fc': contractCode
            }
        });
        
        if (result.status === 'ok') {
            console.log('✅ Контракт успешно скомпилирован!');
            console.log('Code BOC:', result.code);
        } else {
            console.log('❌ Ошибка компиляции:', result.message);
        }
    } catch (error) {
        console.log('❌ Ошибка:', error);
    }
}

compileContract();
