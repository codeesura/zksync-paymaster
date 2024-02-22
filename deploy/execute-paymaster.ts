import { HardhatRuntimeEnvironment } from 'hardhat/types';
import deployPaymaster from '../deploy/deploy-paymaster';
import usePaymaster from '../deploy/use-paymaster';
import { Colors } from '../types';

export default async function executePaymaster(hre: HardhatRuntimeEnvironment) {
    try {
        console.group(`${Colors.yellow}Execution Process${Colors.reset}`);

        const { erc20Address, paymasterAddress, emptyWalletPrivateKey } = await deployPaymaster(hre);

        await usePaymaster(hre, erc20Address, paymasterAddress, emptyWalletPrivateKey);
        
        console.groupEnd();
        console.log(`${Colors.yellow}Contracts utilized successfully.${Colors.reset}`);
    } catch (error) {
        console.error(`${Colors.red}An error occurred during the execution:${Colors.reset}`, error);
    }
}
