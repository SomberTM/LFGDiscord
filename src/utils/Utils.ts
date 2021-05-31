// @ts-nocheck
export function caller(depth?: number): string {
    var pst, stack, file, frame;

    pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        Error.prepareStackTrace = pst;
        return stack;
    };

    stack = (new Error()).stack;
    depth = !depth || isNaN(depth) ? 1 : (depth > stack.length - 2 ? stack.length - 2 : depth);
    stack = stack.slice(depth + 1);

    do {
        frame = stack.shift();
        file = frame && frame.getFileName();
    } while (stack.length && file === 'module.js');

    return file;
};

export function callerDirectory(depth?: number): string {
    var file: string = caller(depth);
    return file.substring(0, file.lastIndexOf("\\") + 1);
}

export function merge<A extends JsonObject<unknown>, B extends JsonObject<unknown>>(odin: A, dva: B): { [P in keyof A & keyof B]: A[P] & B[P] } {
    return { ...odin, ...dva };
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<Information, K>> & Pick<Information, K>
export type JsonObject<J> = { [key: string]: J, [key: number]: J };
export type DefaultImport<T> = { 'default': T }