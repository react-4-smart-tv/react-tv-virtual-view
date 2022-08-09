import { MutableRefObject, RefCallback } from 'react';
export interface State {
    items: Item[];
    innerMargin?: number;
    innerSize?: number;
}
export interface Measure {
    idx: number;
    start: number;
    end: number;
    size: number;
}
export declare type SsrItemCount = number | [number, number];
declare type UseIsScrolling = boolean | ((speed: number) => boolean);
export declare type ItemSize = number | ((index: number, width: number) => number);
export declare type ScrollDuration = number | ((distance: number) => number);
export interface ScrollEasingFunction {
    (time: number): number;
}
export interface IsItemLoaded {
    (index: number): boolean;
}
export interface LoadMore {
    (event: {
        startIndex: number;
        stopIndex: number;
        loadIndex: number;
        readonly scrollOffset: number;
        readonly userScroll: boolean;
    }): void;
}
export interface OnScroll {
    (event: {
        overscanStartIndex: number;
        overscanStopIndex: number;
        visibleStartIndex: number;
        visibleStopIndex: number;
        readonly scrollOffset: number;
        readonly scrollForward: boolean;
        readonly userScroll: boolean;
    }): void;
}
export interface OnResizeEvent {
    width: number;
    height: number;
}
export interface OnResize {
    (event: OnResizeEvent): void;
}
export interface Item {
    readonly index: number;
    readonly start: number;
    readonly size: number;
    readonly width: number;
    readonly isScrolling?: true;
    readonly isSticky?: true;
    measureRef: RefCallback<HTMLElement>;
}
export interface ScrollToOptions {
    offset: number;
    smooth?: boolean;
}
export interface ScrollTo {
    (value: number | ScrollToOptions, callback?: () => void): void;
}
export declare enum Align {
    auto = "auto",
    start = "start",
    center = "center",
    end = "end"
}
export interface ScrollToItemOptions {
    index: number;
    align?: Align;
    smooth?: boolean;
}
export interface ScrollToItem {
    (index: number | ScrollToItemOptions, callback?: () => void): void;
}
export interface StartItem {
    (index: number, callback?: () => void): void;
}
export interface Options {
    itemCount: number;
    ssrItemCount?: SsrItemCount;
    itemSize?: ItemSize;
    horizontal?: boolean;
    resetScroll?: boolean;
    overscanCount?: number;
    useIsScrolling?: UseIsScrolling;
    stickyIndices?: number[];
    scrollDuration?: ScrollDuration;
    scrollEasingFunction?: ScrollEasingFunction;
    loadMoreCount?: number;
    isItemLoaded?: IsItemLoaded;
    loadMore?: LoadMore;
    onScroll?: OnScroll;
    onResize?: OnResize;
    paddingSize?: number;
}
export interface Return<O = any, I = any> {
    outerRef: MutableRefObject<O | null>;
    innerRef: MutableRefObject<I | null>;
    items: Item[];
    scrollTo: ScrollTo;
    scrollToItem: ScrollToItem;
    startItem: StartItem;
}
export interface ItemSizeFunction {
    (index: number, width: number): number;
}
export interface UseIsScrollingFunction {
    (speed: number): boolean;
}
export {};
