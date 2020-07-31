/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Bytes, BytesLike, SignatureLike } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Wordlist } from '@ethersproject/wordlists';
import { Mnemonic } from '@ethersproject/hdnode';
import { ProgressCallback } from '@ethersproject/json-wallets';
import { Provider, TransactionRequest } from '@crypujs/abstract-provider';
import { ExternallyOwnedAccount, Signer } from '@crypujs/abstract-signer';
export declare class Wallet extends Signer implements ExternallyOwnedAccount {
    readonly address: string;
    readonly provider: Provider;
    readonly _signingKey: () => SigningKey;
    readonly _mnemonic: () => Mnemonic;
    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider);
    get mnemonic(): Mnemonic;
    get privateKey(): string;
    get publicKey(): string;
    getAddress(): Promise<string>;
    connect(provider: Provider): Wallet;
    signTransaction(transaction: TransactionRequest): Promise<string>;
    signMessage(message: Bytes | string): Promise<string>;
    encrypt(password: Bytes | string, options?: any, progressCallback?: ProgressCallback): Promise<string>;
    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options?: any): Wallet;
    static fromEncryptedJson(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<Wallet>;
    static fromEncryptedJsonSync(json: string, password: Bytes | string): Wallet;
    static fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet;
}
export declare function verifyMessage(message: Bytes | string, signature: SignatureLike): string;
