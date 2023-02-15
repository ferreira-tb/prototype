import { assertInteger, assertPositiveNumber, assertString, isString } from '@tb-dev/ts-guard';

declare global {
    interface Array<T> {
        /** Parses the array as a list of integers, but do not filter out any non-integer values. */
        asIntegerList(): number[];
        /** Parses the array as a list of integers, filtering out any non-integer values. */
        asIntegerListStrict(): number[];
    }

    interface Map<K, V> {
        /**
         * Returns a specified element from the Map object. If the value that is associated to the provided key is an object,
         * then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
         * 
         * @returns Returns the element associated with the specified key.
         * If no element is associated with the specified key, throws an error.
         */
        getStrict(key: K, message?: string): V;
    }

    interface Number {
        /**
         * Converts a number to a Date object, exactly like `new Date()` does.
         * This will throw an error if the number is not a valid timestamp.
         */
        toDate(): Date;
    }

    interface String {
        /**
         * Split a string into substrings using the specified separator and return them as a list of strings.
         * However, removes any empty strings from the returned list and trims each string.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAndTrim(separator: string | RegExp, limit?: number): string[];

        /**
         * Split a string into substrings using the specified separator and return them as a list of integers.
         * The returned list may contain non-integer values.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAsIntegerList(separator: string | RegExp, limit?: number): number[];

        /**
         * Split a string into substrings using the specified separator and return them as a list of integers.
         * If the string cannot be parsed as an integer, it is not included in the returned list.
         * @param separator A string that identifies character or characters to use in separating the string.
         * If omitted, a single-element array containing the entire string is returned.
         * @param limit A value used to limit the number of elements returned in the array.
         */
        splitAsIntegerListStrict(separator: string | RegExp, limit?: number): number[];
    }

    interface URLSearchParams {
        /**
         * Get the first value associated to the given search parameter, throwing an error if it does not exist.
         * @param name The name of the search parameter to get.
         */
        getStrict<T extends string>(name: string): T;

        /**
         * Get the first value associated to the given search parameter, then tries to parse it as an integer if it is not `null`.
         * The returned value may be `NaN` if it cannot be parsed as an integer.
         * If you want to throw an error if the value cannot be parsed as an integer, use `getAsIntegerStrict()` instead.
         * @param name The name of the search parameter to get.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        getAsInteger(name: string, radix?: number): number | ReturnType<URLSearchParams['get']>;

        /**
         * Get the first value associated to the given search parameter, then tries to parse it as an integer.
         * If it cannot be parsed as an integer, throws a error.
         * @param name The name of the search parameter to get.
         * @param radix A value between 2 and 36 that specifies the base of the number.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        getAsIntegerStrict(name: string, radix?: number): number;
    }

    interface DateConstructor {
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and yesterday, but at the same time of now. */
        yesterday(): number;
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and tomorrow, but at the same time of now. */
        tomorrow(): number;
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and seven days ago, but at the same time of now. */
        sevenDaysAgo(): number;
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and seven days from now, but at the same time of now. */
        sevenDaysFromNow(): number;
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and thirty days ago, but at the same time of now. */
        thirtyDaysAgo(): number;
        /** Returns the number of milliseconds elapsed since the ECMAScript epoch and thirty days from now, but at the same time of now. */
        thirtyDaysFromNow(): number;
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
        parseIntStrict(rawString: string, radix?: number): number
    }
}

////// PROTOTYPES //////
Array.prototype.asIntegerList = function(): number[] {
    return this.map((i) => Number.parseInt(i, 10));
};

Array.prototype.asIntegerListStrict = function(): number[] {
    const parsedArray = this.map((i) => Number.parseInt(i, 10));
    return parsedArray.filter((i) => !Number.isNaN(i));
};

Map.prototype.getStrict = function<K, V>(key: K, message?: string): V {
    const item = this.get(key);
    if (!isString(message)) message = 'O item não existe no mapa.';
    assert(item !== undefined, message);
    return item;
};

Number.prototype.toDate = function(): Date {
    const value = this.valueOf();
    assertPositiveNumber(value);
    return new Date(value);
};

String.prototype.splitAndTrim = function(separator: string | RegExp, limit?: number): string[] {
    const split = this.split(separator, limit);
    return split.map((i) => i.trim()).filter((i) => i.length > 0);
};

String.prototype.splitAsIntegerList = function(separator: string | RegExp, limit?: number): number[] {
    const split = this.split(separator, limit);
    return split.asIntegerList();
};

String.prototype.splitAsIntegerListStrict = function(separator: string | RegExp, limit?: number): number[] {
    const split = this.split(separator, limit);
    return split.asIntegerListStrict();
};

URLSearchParams.prototype.getStrict = function<T extends string>(name: string): T {
    const item = this.get(name);
    assert(item !== null, 'O item não existe entre os parâmetros da URL.');
    return item as T;
};

URLSearchParams.prototype.getAsInteger = function(name: string, radix: number = 10): number | ReturnType<URLSearchParams['get']> {
    const item = this.get(name);
    if (item === null) return item;
    return Number.parseInt(item, radix);
};

URLSearchParams.prototype.getAsIntegerStrict = function(name: string, radix: number = 10): number {
    const item = this.get(name);
    assertString(item, 'O item não existe entre os parâmetros da URL.');
    return Number.parseIntStrict(item, radix);
};

////// STATIC METHODS //////
Date.yesterday = function(): number {
    return Date.now() - (3600000 * 24);
};

Date.tomorrow = function(): number {
    return Date.now() + (3600000 * 24);
};

Date.sevenDaysAgo = function(): number {
    return Date.now() - (3600000 * 24 * 7);
};

Date.sevenDaysFromNow = function(): number {
    return Date.now() + (3600000 * 24 * 7);
};

Date.thirtyDaysAgo = function(): number {
    return Date.now() - (3600000 * 24 * 30);
};

Date.thirtyDaysFromNow = function(): number {
    return Date.now() + (3600000 * 24 * 30);
};

Number.parseIntStrict = function(rawString: string, radix: number = 10): number {
    const parsed = Number.parseInt(rawString, radix);
    assertInteger(parsed, 'Não foi possível obter um número inteiro a partir da string.');
    return parsed;
};