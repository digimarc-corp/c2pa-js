/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2ManifestStore } from 'c2pa';
import { LitElement } from 'lit';
import type { MinimumViableProvenanceConfig } from '../MinimumViableProvenance';
import '../AIToolUsed';
import '../ContentSummary';
import '../MinimumViableProvenance';
import '../ProducedBy';
import '../ProducedWith';
import '../SocialMedia';
import '../Web3';
declare global {
    interface HTMLElementTagNameMap {
        'cai-manifest-summary-dm-plugin': ManifestSummary;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-manifest-summary-dm-plugin': any;
        }
    }
}
declare const ManifestSummary_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<MinimumViableProvenanceConfig>) & (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class ManifestSummary extends ManifestSummary_base {
    static readonly cssParts: {
        viewMore: string;
    };
    static get styles(): import("lit").CSSResult[];
    manifestStore: L2ManifestStore | undefined;
    viewMoreUrl: string;
    private _postRef;
    private _isPostEmpty;
    private _checkPostEmpty;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1> | null;
}
export {};
