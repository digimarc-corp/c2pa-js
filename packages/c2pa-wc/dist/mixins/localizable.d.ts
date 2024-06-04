/**
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
export declare class LocalizableInterface {
    locale: string;
    protected strings: Record<string, string>;
}
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare const Localizable: <T extends Constructor<LitElement>>(superClass: T) => Constructor<LocalizableInterface> & T;
export {};
