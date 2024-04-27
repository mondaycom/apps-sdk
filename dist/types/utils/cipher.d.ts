/// <reference types="node" />
export declare const generateBase64Secret: (secret: string) => Buffer;
export declare const encrypt: (text: string, base64Secret?: Buffer, initVector?: Buffer) => string;
export declare const decrypt: (text: string, base64Secret?: Buffer, initVector?: Buffer) => string;
