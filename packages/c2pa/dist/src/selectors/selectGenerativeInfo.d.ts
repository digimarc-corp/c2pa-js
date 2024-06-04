/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import type { ActionV1, Assertion, GeneratorInfoMap, ManifestAssertion } from '@contentauth/toolkit';
import { ActionV2 } from '@contentauth/toolkit';
import type { Manifest } from '../manifest';
export declare type LegacyAssertion = Assertion<'com.adobe.generative-ai', {
    description: string;
    version: string;
    prompt?: string;
}>;
export declare type GenAiAssertion = ManifestAssertion | LegacyAssertion;
export interface GenerativeInfo {
    assertion: GenAiAssertion;
    action?: ActionV1 | ActionV2;
    type: 'legacy' | 'trainedAlgorithmicMedia' | 'compositeWithTrainedAlgorithmicMedia';
    softwareAgent: GeneratorInfoMap;
}
/**
 * Gets any generative AI information from the manifest.
 *
 * @param manifest - Manifest to derive data from
 */
export declare function selectGenerativeInfo(manifest: Manifest): GenerativeInfo[] | null;
/**
 * Returns a set of software agents
 * @param generativeInfo - generative info from manifest
 */
export declare function selectGenerativeSoftwareAgents(generativeInfo: GenerativeInfo[]): string[];
/**
 * Returns the generative type (trained , legacy or composite)
 * @param generativeInfo - generative info from manifest
 */
export declare function selectGenerativeType(generativeInfo: GenerativeInfo[]): "legacy" | "trainedAlgorithmicMedia" | "compositeWithTrainedAlgorithmicMedia";
//# sourceMappingURL=selectGenerativeInfo.d.ts.map