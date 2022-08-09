import { Options, Return } from "./virtual.interface";
declare const _default: <O extends HTMLElement = HTMLElement, I extends HTMLElement = O>({ itemCount, ssrItemCount, itemSize, horizontal, resetScroll, overscanCount, useIsScrolling, stickyIndices, scrollDuration, scrollEasingFunction, loadMoreCount, isItemLoaded, loadMore, onScroll, onResize, paddingSize, }: Options) => Return<O, I>;
export default _default;
