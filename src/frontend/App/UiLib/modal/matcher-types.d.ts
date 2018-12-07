declare namespace jasmine {
    interface Matchers<T> {
        toHaveModalsOpen(expected: number): boolean;
    }
}