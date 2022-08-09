'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

exports.Align = void 0;
(function (Align) {
    Align["auto"] = "auto";
    Align["start"] = "start";
    Align["center"] = "center";
    Align["end"] = "end";
})(exports.Align || (exports.Align = {}));

var findNearestBinarySearch = (function (low, high, input, getVal) {
    while (low <= high) {
        var mid = ((low + high) / 2) | 0;
        var val = getVal(mid);
        if (input < val) {
            high = mid - 1;
        }
        else if (input > val) {
            low = mid + 1;
        }
        else {
            return mid;
        }
    }
    return low > 0 ? low - 1 : 0;
});

var isNumber = (function (val) {
    return typeof val === "number" && !Number.isNaN(val);
});

var now = (function () {
    // eslint-disable-next-line compat/compat
    return "performance" in window ? performance.now() : Date.now();
});

var shouldUpdate = (function (prev, next, skip) {
    if (prev.length !== next.length)
        return true;
    var _loop_1 = function (i) {
        if (Object.keys(prev[i]).some(function (key) {
            var k = key;
            return !skip[k] && prev[i][k] !== next[i][k];
        }))
            return { value: true };
    };
    for (var i = 0; i < prev.length; i += 1) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
});

var useLatest = (function (val) {
    var ref = react.useRef(val);
    ref.current = val;
    return ref;
});

var useDebounce = (function (cb, delay) {
    var rafRef = react.useRef();
    var cbRef = useLatest(cb);
    var cancel = react.useCallback(function () {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = undefined;
        }
    }, []);
    var tick = react.useCallback(function (start) {
        if (now() - start >= delay) {
            cbRef.current();
        }
        else {
            rafRef.current = requestAnimationFrame(function () { return tick(start); });
        }
    }, [cbRef, delay]);
    var fn = react.useCallback(function () {
        cancel();
        tick(now());
    }, [cancel, tick]);
    return [fn, cancel];
});

var useIsoLayoutEffect = typeof window !== "undefined" ? react.useLayoutEffect : react.useEffect;

var useResizeEffect = (function (ref, cb, deps) {
    var cbRef = useLatest(cb);
    useIsoLayoutEffect(function () {
        if (!(ref === null || ref === void 0 ? void 0 : ref.current))
            return function () { return null; };
        // eslint-disable-next-line compat/compat
        var observer = new ResizeObserver(function (_a) {
            var _b = __read(_a, 1), contentRect = _b[0].contentRect;
            var width = contentRect.width, height = contentRect.height;
            cbRef.current({ width: width, height: height });
        });
        observer.observe(ref.current);
        return function () { return observer.disconnect(); };
    }, __spreadArray([cbRef, ref], __read(deps), false));
});

var getInitState = function (itemSize, ssrItemCount) {
    if (ssrItemCount === void 0) { ssrItemCount = 0; }
    var _a = __read(isNumber(ssrItemCount)
        ? [0, ssrItemCount - 1]
        : ssrItemCount, 2), idx = _a[0], len = _a[1];
    var items = [];
    for (var i = idx; i <= len; i += 1)
        items.push({
            index: i,
            start: 0,
            width: 0,
            size: isNumber(itemSize) ? itemSize : itemSize(i, 0),
            measureRef: /* istanbul ignore next */ function () { return null; },
        });
    return { items: items };
};
var useVirtual = (function (_a) {
    var itemCount = _a.itemCount, ssrItemCount = _a.ssrItemCount, _b = _a.itemSize, itemSize = _b === void 0 ? 50 : _b, horizontal = _a.horizontal, resetScroll = _a.resetScroll, _c = _a.overscanCount, overscanCount = _c === void 0 ? 1 : _c, useIsScrolling = _a.useIsScrolling, stickyIndices = _a.stickyIndices, 
    // Default = 100ms <= distance * 0.75 <= 500ms
    _d = _a.scrollDuration, 
    // Default = 100ms <= distance * 0.75 <= 500ms
    scrollDuration = _d === void 0 ? function (d) { return Math.min(Math.max(d * 0.075, 100), 500); } : _d, 
    // Default = easeInOutSine
    _e = _a.scrollEasingFunction, 
    // Default = easeInOutSine
    scrollEasingFunction = _e === void 0 ? function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; } : _e, _f = _a.loadMoreCount, loadMoreCount = _f === void 0 ? 15 : _f, isItemLoaded = _a.isItemLoaded, loadMore = _a.loadMore, onScroll = _a.onScroll, onResize = _a.onResize, paddingSize = _a.paddingSize;
    var _g = __read(react.useState(function () {
        return getInitState(itemSize, ssrItemCount);
    }), 2), state = _g[0], setState = _g[1];
    var isMountedRef = react.useRef(false);
    var isScrollingRef = react.useRef(true);
    var isScrollToItemRef = react.useRef(false);
    var hasDynamicSizeRef = react.useRef(false);
    var rosRef = react.useRef(new Map());
    var scrollOffsetRef = react.useRef(0);
    var prevItemIdxRef = react.useRef(-1);
    var prevVStopRef = react.useRef(-1);
    var outerRef = react.useRef(null);
    var innerRef = react.useRef(null);
    var outerRectRef = react.useRef({ width: 0, height: 0 });
    var msDataRef = react.useRef([]);
    var userScrollRef = react.useRef(true);
    var scrollToRafRef = react.useRef();
    var stickyIndicesRef = useLatest(stickyIndices);
    var durationRef = useLatest(scrollDuration);
    var easingFnRef = useLatest(scrollEasingFunction);
    var isItemLoadedRef = useLatest(isItemLoaded);
    var loadMoreRef = useLatest(loadMore);
    var itemSizeRef = useLatest(itemSize);
    var useIsScrollingRef = useLatest(useIsScrolling);
    var onScrollRef = useLatest(onScroll);
    var onResizeRef = useLatest(onResize);
    var sizeKey = !horizontal ? "height" : "width";
    var marginKey = !horizontal ? "marginTop" : "marginLeft";
    var scrollKey = !horizontal ? "scrollTop" : "scrollLeft";
    var getItemSize = react.useCallback(function (idx) {
        var size = itemSizeRef.current;
        return isNumber(size) ? size : size(idx, outerRectRef.current.width);
    }, [itemSizeRef]);
    var getMeasure = react.useCallback(function (idx, size) {
        var _a, _b;
        var start = (_b = (_a = msDataRef.current[idx - 1]) === null || _a === void 0 ? void 0 : _a.end) !== null && _b !== void 0 ? _b : 0;
        return { idx: idx, start: start, end: start + size, size: size };
    }, []);
    var measureItems = react.useCallback(function (useCache) {
        if (useCache === void 0) { useCache = true; }
        msDataRef.current.length = itemCount;
        for (var i = 0; i < itemCount; i += 1)
            msDataRef.current[i] = getMeasure(i, useCache && msDataRef.current[i]
                ? msDataRef.current[i].size
                : getItemSize(i));
    }, [getItemSize, getMeasure, itemCount]);
    var getCalcData = react.useCallback(function (scrollOffset) {
        var msData = msDataRef.current;
        var lastIdx = msData.length - 1;
        var vStart = 0;
        if (hasDynamicSizeRef.current) {
            while (vStart < lastIdx &&
                msData[vStart].start + msData[vStart].size < scrollOffset)
                vStart += 1;
        }
        else {
            vStart = findNearestBinarySearch(0, lastIdx, scrollOffset, function (idx) { return msData[idx].start; });
        }
        var vStop = vStart;
        var currStart = msData[vStop].start;
        while (vStop < lastIdx &&
            currStart < scrollOffset + outerRectRef.current[sizeKey]) {
            currStart += msData[vStop].size;
            vStop += 1;
        }
        vStop = vStop === lastIdx ? vStop : vStop - 1;
        var oStart = Math.max(vStart - overscanCount, 0);
        var oStop = Math.min(vStop + overscanCount, lastIdx);
        var innerMargin = msData[oStart].start;
        var totalSize = Math[oStop < lastIdx ? "max" : "min"](msData[oStop].end + msData[oStop].size, msData[lastIdx].end);
        return {
            oStart: oStart,
            oStop: oStop,
            vStart: vStart,
            vStop: vStop,
            innerMargin: innerMargin,
            innerSize: totalSize - innerMargin,
        };
    }, [overscanCount, sizeKey]);
    var scrollTo = react.useCallback(function (offset, isScrolling) {
        if (isScrolling === void 0) { isScrolling = true; }
        if (outerRef.current) {
            userScrollRef.current = false;
            isScrollingRef.current = isScrolling;
            outerRef.current[scrollKey] = offset;
        }
    }, [scrollKey]);
    var scrollToOffset = react.useCallback(function (val, cb) {
        var _a = isNumber(val)
            ? { offset: val }
            : val, offset = _a.offset, smooth = _a.smooth;
        if (!isNumber(offset))
            return;
        if (!smooth) {
            scrollTo(offset);
            if (cb)
                cb();
            return;
        }
        var prevOffset = scrollOffsetRef.current;
        var start = now();
        var scroll = function () {
            var duration = durationRef.current;
            duration = isNumber(duration)
                ? duration
                : duration(Math.abs(offset - prevOffset));
            var time = Math.min((now() - start) / duration, 1);
            var easing = easingFnRef.current(time);
            scrollTo(easing * (offset - prevOffset) + prevOffset);
            if (time < 1) {
                scrollToRafRef.current = requestAnimationFrame(scroll);
            }
            else if (cb) {
                cb();
            }
        };
        scrollToRafRef.current = requestAnimationFrame(scroll);
    }, [durationRef, easingFnRef, scrollTo]);
    var scrollToIndex = react.useCallback(function (val, cb, isSync) {
        var _a = isNumber(val) ? { index: val } : val, index = _a.index, _b = _a.align, align = _b === void 0 ? exports.Align.auto : _b, smooth = _a.smooth;
        if (!isNumber(index))
            return;
        isScrollToItemRef.current = true;
        // For dynamic size, we must measure it for getting the correct scroll position
        if (hasDynamicSizeRef.current)
            measureItems();
        var msData = msDataRef.current;
        var ms = msData[Math.max(0, Math.min(index, msData.length - 1))];
        if (!ms)
            return;
        var start = ms.start, end = ms.end, size = ms.size;
        var totalSize = msData[msData.length - 1].end;
        var outerSize = outerRectRef.current[sizeKey];
        var scrollOffset = scrollOffsetRef.current;
        if (totalSize <= outerSize) {
            if (cb)
                cb();
            return;
        }
        if (isSync ||
            align === exports.Align.start ||
            (align === exports.Align.auto &&
                scrollOffset + outerSize > end &&
                scrollOffset > start)) {
            scrollOffset =
                totalSize - start <= outerSize ? totalSize - outerSize : start;
        }
        else if (align === exports.Align.end ||
            (align === exports.Align.auto &&
                scrollOffset + outerSize < end &&
                scrollOffset < start)) {
            scrollOffset = start + size <= outerSize ? 0 : start - outerSize + size;
        }
        else if (align === exports.Align.center && start + size / 2 > outerSize / 2) {
            var to = start - outerSize / 2 + size / 2;
            scrollOffset = totalSize - to <= outerSize ? totalSize - outerSize : to;
        }
        if (hasDynamicSizeRef.current &&
            Math.abs(scrollOffset - scrollOffsetRef.current) <= 1) {
            if (cb)
                cb();
            return;
        }
        scrollToOffset({ offset: scrollOffset, smooth: smooth }, function () {
            if (!hasDynamicSizeRef.current) {
                if (cb)
                    cb();
            }
            else if (isSync) {
                requestAnimationFrame(function () { return scrollToIndex(val, cb, isSync); });
            }
            else {
                setTimeout(function () { return scrollToIndex(val, cb); });
            }
        });
    }, [measureItems, scrollToOffset, sizeKey]);
    var scrollToItem = react.useCallback(function (val, cb) { return scrollToIndex(val, cb); }, [scrollToIndex]);
    var startItem = react.useCallback(function (idx, cb) { return scrollToIndex(idx, cb, true); }, [scrollToIndex]);
    var _h = __read(useDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    function () { return handleScroll(scrollOffsetRef.current); }, 150), 2), resetIsScrolling = _h[0], cancelResetIsScrolling = _h[1];
    var handleScroll = react.useCallback(function (scrollOffset, isScrolling, uxScrolling) {
        if (loadMoreRef.current &&
            !isMountedRef.current &&
            !(isItemLoadedRef.current && isItemLoadedRef.current(0)))
            loadMoreRef.current({
                startIndex: 0,
                stopIndex: loadMoreCount - 1,
                loadIndex: 0,
                scrollOffset: scrollOffset,
                userScroll: false,
            });
        if (!itemCount) {
            setState({ items: [] });
            return;
        }
        var calcData = getCalcData(scrollOffset);
        var oStart = calcData.oStart, oStop = calcData.oStop, vStart = calcData.vStart, vStop = calcData.vStop;
        var innerMargin = calcData.innerMargin, innerSize = calcData.innerSize;
        var items = [];
        var stickies = Array.isArray(stickyIndicesRef.current)
            ? stickyIndicesRef.current
            : [];
        var _loop_1 = function (i) {
            var msData = msDataRef.current;
            var _a = msData[i], start = _a.start, size = _a.size;
            items.push({
                index: i,
                start: start - innerMargin,
                size: size,
                width: outerRectRef.current.width,
                isScrolling: uxScrolling || undefined,
                isSticky: stickies.includes(i) || undefined,
                measureRef: function (el) {
                    if (!el)
                        return;
                    // eslint-disable-next-line compat/compat
                    new ResizeObserver(function (_a, ro) {
                        var _b, _c, _d;
                        var _e = __read(_a, 1), target = _e[0].target;
                        // NOTE: Use `borderBoxSize` when it's supported by Safari
                        // see: https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
                        var measuredSize = target.getBoundingClientRect()[sizeKey];
                        if (!measuredSize) {
                            ro.disconnect();
                            rosRef.current.delete(target);
                            return;
                        }
                        var prevEnd = (_c = (_b = msData[i - 1]) === null || _b === void 0 ? void 0 : _b.end) !== null && _c !== void 0 ? _c : 0;
                        if (measuredSize !== size || start !== prevEnd) {
                            // To prevent dynamic size from jumping during backward scrolling
                            if (i < prevItemIdxRef.current && start < scrollOffset)
                                scrollTo(scrollOffset + measuredSize - size, false);
                            msDataRef.current[i] = getMeasure(i, measuredSize);
                            if (!isScrollToItemRef.current)
                                handleScroll(scrollOffsetRef.current, isScrolling, uxScrolling);
                            hasDynamicSizeRef.current = true;
                        }
                        prevItemIdxRef.current = i;
                        (_d = rosRef.current.get(target)) === null || _d === void 0 ? void 0 : _d.disconnect();
                        rosRef.current.set(target, ro);
                    }).observe(el);
                },
            });
        };
        for (var i = oStart; i <= oStop; i += 1) {
            _loop_1(i);
        }
        if (stickies.length) {
            var stickyIdx = stickies[findNearestBinarySearch(0, stickies.length - 1, vStart, function (idx) { return stickies[idx]; })];
            if (oStart > stickyIdx) {
                var size = msDataRef.current[stickyIdx].size;
                items.unshift({
                    index: stickyIdx,
                    start: 0,
                    size: size,
                    width: outerRectRef.current.width,
                    isScrolling: uxScrolling || undefined,
                    isSticky: true,
                    measureRef: /* istanbul ignore next */ function () { return null; },
                });
                innerMargin -= size;
                innerSize += size;
            }
        }
        setState(function (prevState) {
            return shouldUpdate(prevState.items, items, { measureRef: true })
                ? { items: items, innerMargin: innerMargin, innerSize: innerSize }
                : prevState;
        });
        if (!isScrolling)
            return;
        var scrollForward = scrollOffset > scrollOffsetRef.current;
        if (onScrollRef.current)
            onScrollRef.current({
                overscanStartIndex: oStart,
                overscanStopIndex: oStop,
                visibleStartIndex: vStart,
                visibleStopIndex: vStop,
                scrollOffset: scrollOffset,
                scrollForward: scrollForward,
                userScroll: userScrollRef.current,
            });
        var loadIndex = Math.max(Math.floor((vStop + 1) / loadMoreCount) - (scrollForward ? 0 : 1), 0);
        var startIndex = loadIndex * loadMoreCount;
        if (loadMoreRef.current &&
            vStop !== prevVStopRef.current &&
            !(isItemLoadedRef.current && isItemLoadedRef.current(loadIndex)))
            loadMoreRef.current({
                startIndex: startIndex,
                stopIndex: startIndex + loadMoreCount - 1,
                loadIndex: loadIndex,
                scrollOffset: scrollOffset,
                userScroll: userScrollRef.current,
            });
        if (uxScrolling)
            resetIsScrolling();
        prevVStopRef.current = vStop;
    }, [
        stickyIndicesRef,
        getCalcData,
        getMeasure,
        itemCount,
        loadMoreCount,
        loadMoreRef,
        onScrollRef,
        resetIsScrolling,
        scrollTo,
        sizeKey,
        isItemLoadedRef,
    ]);
    useResizeEffect(outerRef, function (rect) {
        var _a, _b;
        var _c = outerRectRef.current, width = _c.width, height = _c.height;
        var isSameWidth = width === rect.width;
        var isSameSize = isSameWidth && height === rect.height;
        var msDataLen = msDataRef.current.length;
        var prevTotalSize = (_a = msDataRef.current[msDataLen - 1]) === null || _a === void 0 ? void 0 : _a.end;
        outerRectRef.current = rect;
        measureItems(hasDynamicSizeRef.current);
        handleScroll(scrollOffsetRef.current);
        if (resetScroll && itemCount !== msDataLen)
            setTimeout(function () { return scrollTo(0, false); });
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            return;
        }
        if (!hasDynamicSizeRef.current && !isSameWidth) {
            var totalSize = (_b = msDataRef.current[msDataRef.current.length - 1]) === null || _b === void 0 ? void 0 : _b.end;
            var ratio = totalSize / prevTotalSize || 1;
            scrollTo(scrollOffsetRef.current * ratio, false);
        }
        if (!isSameSize && onResizeRef.current)
            onResizeRef.current(rect);
    }, [itemCount, resetScroll, handleScroll, measureItems, onResizeRef, scrollTo]);
    useIsoLayoutEffect(function () {
        if (!innerRef.current)
            return;
        if (isNumber(state.innerMargin))
            innerRef.current.style[marginKey] = "".concat(state.innerMargin, "px");
        if (isNumber(state.innerSize))
            innerRef.current.style[sizeKey] = "".concat(state.innerSize + 2 * (paddingSize || 0), "px");
    }, [marginKey, sizeKey, state.innerMargin, state.innerSize]);
    useIsoLayoutEffect(function () {
        var outer = outerRef.current;
        if (!outer)
            return function () { return null; };
        var scrollHandler = function (_a) {
            var target = _a.target;
            var scrollOffset = target[scrollKey];
            if (scrollOffset === scrollOffsetRef.current)
                return;
            var uxScrolling = useIsScrollingRef.current;
            uxScrolling =
                typeof uxScrolling === "function"
                    ? uxScrolling(Math.abs(scrollOffset - scrollOffsetRef.current))
                    : uxScrolling;
            handleScroll(scrollOffset, isScrollingRef.current, uxScrolling);
            userScrollRef.current = true;
            isScrollingRef.current = true;
            isScrollToItemRef.current = false;
            scrollOffsetRef.current = scrollOffset;
        };
        outer.addEventListener("scroll", scrollHandler, { passive: true });
        var ros = rosRef.current;
        return function () {
            cancelResetIsScrolling();
            if (scrollToRafRef.current) {
                cancelAnimationFrame(scrollToRafRef.current);
                scrollToRafRef.current = undefined;
            }
            outer.removeEventListener("scroll", scrollHandler);
            ros.forEach(function (ro) { return ro.disconnect(); });
            ros.clear();
        };
    }, [cancelResetIsScrolling, handleScroll, scrollKey, useIsScrollingRef]);
    return {
        outerRef: outerRef,
        innerRef: innerRef,
        items: state.items,
        scrollTo: scrollToOffset,
        scrollToItem: scrollToItem,
        startItem: startItem,
    };
});

exports["default"] = useVirtual;
