/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2SocialAccount } from 'c2pa';
import { LitElement } from 'lit';
import '../Icon';
import '../PanelSection';
declare global {
    interface HTMLElementTagNameMap {
        'cai-social-media-dm-plugin': SocialMedia;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-social-media-dm-plugin': any;
        }
    }
}
declare const SocialMedia_base: (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class SocialMedia extends SocialMedia_base {
    static get styles(): import("lit").CSSResult[];
    data: L2SocialAccount[] | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
