/*
 This file is part of crypu.js.

 crypu.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 crypu.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with crypu.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Logger } from '@ethersproject/logger';
import {
  defineReadOnly,
  getStatic,
  shallowCopy,
} from '@ethersproject/properties';
import {
  BigNumber,
  BigNumberish,
} from '@ethersproject/bignumber';

import {
  JsonFragment,
  Fragment,
  FunctionFragment,
  Interface,
} from '@crypujs/abi';
import {
  TransactionRequest,
  TransactionResponse,
  BlockTag,
  Provider,
} from '@crypujs/abstract-provider';
import { Signer } from '@crypujs/abstract-signer';

export interface Overrides {
  gasLimit?: BigNumberish | Promise<BigNumberish>;
  gasPrice?: BigNumberish | Promise<BigNumberish>;
  nonce?: BigNumberish | Promise<BigNumberish>;
};

export interface PayableOverrides extends Overrides {
  value?: BigNumberish | Promise<BigNumberish>;
}

export interface CallOverrides extends PayableOverrides {
  blockTag?: BlockTag | Promise<BlockTag>;
  from?: string | Promise<string>;
}

export interface SendOverrides extends CallOverrides {
  hook?: (transaction: TransactionResponse) => Promise<any>;
}

export type ContractInterface = string | Array<Fragment | JsonFragment | string> | Interface;
export type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>;

const logger = new Logger('contracts');

function buildCall(contract: Contract, fragment: FunctionFragment): ContractFunction {
  return async (...args: Array<any>): Promise<any> => {
    const signerOrProvider = (contract.signer || contract.provider);
    if (!signerOrProvider) {
      logger.throwError('sending a transaction requires a signer or provider', Logger.errors.UNSUPPORTED_OPERATION, {
        operation: 'call'
      });
    }

    let overrides: CallOverrides = {};
    if (args.length === fragment.inputs.length + 1 && typeof (args[args.length - 1]) === 'object') {
      overrides = shallowCopy(args.pop());
    }

    const tx: TransactionRequest = {
      to: contract.address,
      data: contract.interface.encodeFunctionData(fragment, args),
    };

    if (!!overrides.gasLimit) { tx.gasLimit = BigNumber.from(overrides.gasLimit); }
    if (!!overrides.gasPrice) { tx.gasPrice = BigNumber.from(overrides.gasPrice); }
    if (!!overrides.nonce) { tx.nonce = BigNumber.from(overrides.nonce).toNumber(); }

    if (!!overrides.value) {
      const value = BigNumber.from(overrides.value);
      if (!value.isZero() && !fragment.payable) {
        logger.throwError('non-payable method cannot override value', Logger.errors.UNSUPPORTED_OPERATION, {
          operation: 'overrides.value',
          value: overrides.value,
        });
      }
      tx.value = value;
    }

    const result = await signerOrProvider.call(tx);
    try {
      return contract.interface.decodeFunctionResult(fragment, result);
    } catch (error) {
      if (error.code === Logger.errors.CALL_EXCEPTION) {
        error.address = contract.address;
        error.args = args;
        error.transaction = tx;
      }
      throw error;
    }
  }
}

function buildSend(contract: Contract, fragment: FunctionFragment): ContractFunction {
  return async (...args: Array<any>): Promise<any> => {
    const signer = contract.signer;
    if (!signer) {
      logger.throwError('sending a transaction requires a signer', Logger.errors.UNSUPPORTED_OPERATION, {
        operation: 'sendTransaction'
      });
    }

    let overrides: SendOverrides = {};
    if (args.length === fragment.inputs.length + 1 && typeof (args[args.length - 1]) === 'object') {
      overrides = shallowCopy(args.pop());
    }

    const tx: TransactionRequest = {
      to: contract.address,
      data: contract.interface.encodeFunctionData(fragment, args),
    };

    if (!!overrides.gasLimit) { tx.gasLimit = BigNumber.from(overrides.gasLimit); }
    if (!!overrides.gasPrice) { tx.gasPrice = BigNumber.from(overrides.gasPrice); }
    if (!!overrides.nonce) { tx.nonce = BigNumber.from(overrides.nonce).toNumber(); }

    if (!!overrides.value) {
      const value = BigNumber.from(overrides.value);
      if (!value.isZero() && !fragment.payable) {
        logger.throwError('non-payable method cannot override value', Logger.errors.UNSUPPORTED_OPERATION, {
          operation: 'overrides.value',
          value: overrides.value,
        });
      }
      tx.value = value;
    }

    return signer.sendTransaction(tx, overrides.hook);
  }
}

function buildDefault(contract: Contract, fragment: FunctionFragment): ContractFunction {
  if (fragment.constant) {
    return buildCall(contract, fragment);
  }
  return buildSend(contract, fragment);
}

export class Contract {
  readonly signer: Signer;
  readonly provider: Provider;

  readonly address: string;
  readonly interface: Interface;

  readonly functions: { [name: string]: ContractFunction };

  constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider: Signer | Provider) {
    if (signerOrProvider == null) {
      defineReadOnly(this, 'provider', null);
      defineReadOnly(this, 'signer', null);
    } else if (Signer.isSigner(signerOrProvider)) {
      defineReadOnly(this, 'provider', signerOrProvider.provider || null);
      defineReadOnly(this, 'signer', signerOrProvider);
    } else if (Provider.isProvider(signerOrProvider)) {
      defineReadOnly(this, 'provider', signerOrProvider);
      defineReadOnly(this, 'signer', null);
    }

    defineReadOnly(this, 'address', addressOrName);
    defineReadOnly(
      this,
      'interface',
      getStatic<
        (
          contractInterface: ContractInterface
        ) => Interface
        >(new.target, 'getInterface')(contractInterface),
    );
    defineReadOnly(this, 'functions', {});

    Object.keys(this.interface.functions).forEach((signature) => {
      const fragment: FunctionFragment = this.interface.functions[signature];

      if (this.functions[fragment.name] == null) {
        defineReadOnly(this.functions, fragment.name, buildDefault(this, fragment));
      }
    });
  }

  static getInterface(contractInterface: ContractInterface): Interface {
    if (Interface.isInterface(contractInterface)) {
      return contractInterface;
    }
    return new Interface(contractInterface);
  }
}
