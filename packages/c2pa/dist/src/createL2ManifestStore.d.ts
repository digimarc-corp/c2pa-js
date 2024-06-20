/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ValidationStatus } from '@contentauth/toolkit';
import { ManifestStore } from './manifestStore';
import { GenerativeInfo } from './selectors/selectGenerativeInfo';
declare module './assertions' {
    interface ExtendedAssertions {
        'adobe.beta': {
            version: string;
        };
    }
}
export declare type ErrorStatus = 'otgp' | 'error' | null;
export declare type AlertType = {
    message: string;
    type: 'info' | 'warning' | 'error';
};
/**
 * Manifest representation suitable for use with c2pa-wc.
 */
export interface L2ManifestStore {
    format: string;
    title: string;
    signature: L2Signature | null;
    claimGenerator: L2ClaimGenerator;
    producer: L2Producer | null;
    socialAccounts: L2SocialAccount[] | null;
    thumbnail: string | null;
    generativeInfo: GenerativeInfo[] | null;
    web3: L2Web3 | null;
    isBeta: boolean;
    error: ErrorStatus;
    validationStatus: ValidationStatus[];
    alert?: AlertType | null;
    watermarkProvider?: string | null;
}
export interface L2Signature {
    issuer: string | null;
    isoDateString: string | null;
}
export interface L2ClaimGenerator {
    value: string;
    product: string;
}
export interface L2Producer {
    '@type': string;
    name: string;
    identifier: string;
}
export interface L2SocialAccount {
    '@type': string;
    '@id': string | undefined;
    name: string;
    identifier: string;
}
export interface L2Web3 {
    ethereum?: string[] | undefined;
    solana?: string[] | undefined;
}
export declare type DisposableL2ManifestStore = {
    manifestStore: L2ManifestStore;
    dispose: () => void;
};
/**
 * Creates a manifest store representation suitable for use with c2pa-wc.
 *
 * @param manifestStore - c2pa manifest store object
 */
export declare function createL2ManifestStore(manifestStore: ManifestStore): Promise<DisposableL2ManifestStore>;
//# sourceMappingURL=createL2ManifestStore.d.ts.map