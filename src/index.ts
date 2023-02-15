import { assertInteger, assertString } from '@tb-dev/ts-guard';

declare global {
    interface Map<K, V> {
        /**
         * Returns a specified element from the Map object. If the value that is associated to the provided key is an object,
         * then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
         * 
         * @returns Returns the element associated with the specified key.
         * If no element is associated with the specified key, throws an error.
         */
        assert(key: K, message?: string): V;
    }

    interface URLSearchParams {
        /**
         * Returns the value of the first name-value pair whose name is `name`.
         * If there are no such pairs, throws a error.
         */
        assert<T extends string>(name: string): T;

        /**
         * Get the value of the first name-value pair whose name is `name`, then tries to parse it as an integer.
         * If it fails (i.e. `NaN` is returned), throws a error.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        assertAsInteger(name: string, radix?: number): number;
    }

    interface NumberConstructor {
        /**
         * Converts a string to an integer, exactly like `Number.parseInt()` does.
         * However, if the string cannot be parsed as an integer, throws a error.
         * @param rawString A string to convert into a number.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal. 
         */
        assertInteger(rawString: string, radix?: number): number
    }
}

Map.prototype.assert = function<K, V>(key: K, message?: string): V {
    const item = this.get(key);
    if (typeof message !== 'string') message = 'O item não existe no mapa.';
    assert(item !== undefined, message);
    return item;
};

Number.assertInteger = function(rawString: string, radix: number = 10): number {
    const parsed = Number.parseInt(rawString, radix);
    assertInteger(parsed, 'Não foi possível obter um número inteiro a partir da string.');
    return parsed;
};

URLSearchParams.prototype.assert = function<T extends string>(name: string): T {
    const item = this.get(name);
    assert(item !== null, 'O item não existe entre os parâmetros da URL.');
    return item as T;
};

URLSearchParams.prototype.assertAsInteger = function(name: string, radix: number = 10): number {
    const item = this.get(name);
    assertString(item, 'O item não existe entre os parâmetros da URL.');
    return Number.assertInteger(item, radix);
};