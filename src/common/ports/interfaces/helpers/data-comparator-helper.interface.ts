export interface IDataComparatorHelper<T> {
    compareAndLog(
        expected: T,
        received: T,
        identifier: string,
        savePath: string
    ): void;
}
