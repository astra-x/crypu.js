/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Bytes, BytesLike, SignatureLike, Signature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Wordlist } from '@ethersproject/wordlists';
import { Mnemonic } from '@ethersproject/hdnode';
import { ProgressCallback } from '@ethersproject/json-wallets';
import { Provider, TransactionRequest } from '@crypujs/abstract-provider';
import { ExternallyOwnedAccount, Signer } from '@crypujs/abstract-signer';
import { SigningEscrow } from '@crypujs/signing-escrow';
export interface Signing {
    readonly curve: string;
    readonly privateKey: string;
    readonly publicKey: string;
}
export declare class Wallet extends Signer implements ExternallyOwnedAccount {
    readonly address: string;
    readonly provider: Provider;
    readonly _signing: () => Signing;
    readonly _mnemonic: () => Mnemonic;
    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey | SigningEscrow, provider?: Provider);
    get mnemonic(): Mnemonic;
    get privateKey(): string;
    get publicKey(): string;
    getAddress(): Promise<string>;
    signDigest(digest: BytesLike): Promise<Signature>;
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
