
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    const nodes_to_detach = new Set();
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
        for (const node of nodes_to_detach) {
            node.parentNode.removeChild(node);
        }
        nodes_to_detach.clear();
    }
    function append(target, node) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        if (is_hydrating) {
            nodes_to_detach.add(node);
        }
        else if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules\sveltestrap\src\Alert.svelte generated by Svelte v3.38.1 */
    const file$i = "node_modules\\sveltestrap\\src\\Alert.svelte";

    // (22:0) {#if isOpen}
    function create_if_block$a(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div_transition;
    	let current;
    	let if_block0 = /*toggle*/ ctx[3] && create_if_block_2$2(ctx);
    	const if_block_creators = [create_if_block_1$3, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[7], { class: /*classes*/ ctx[5] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			set_attributes(div, div_data);
    			add_location(div, file$i, 22, 2, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*toggle*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7],
    				(!current || dirty & /*classes*/ 32) && { class: /*classes*/ ctx[5] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(22:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if toggle}
    function create_if_block_2$2(ctx) {
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$i, 33, 8, 900);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$i, 28, 6, 767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[3])) /*toggle*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(28:4) {#if toggle}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(37:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[2] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Alert", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { children = undefined } = $$props;
    	let { color = "success" } = $$props;
    	let { closeClassName = "" } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$new_props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$new_props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$new_props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$new_props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$new_props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		classes,
    		closeClassNames
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("color" in $$props) $$invalidate(9, color = $$new_props.color);
    		if ("closeClassName" in $$props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("isOpen" in $$props) $$invalidate(2, isOpen = $$new_props.isOpen);
    		if ("toggle" in $$props) $$invalidate(3, toggle = $$new_props.toggle);
    		if ("fade" in $$props) $$invalidate(11, fade$1 = $$new_props.fade);
    		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
    		if ("closeClassNames" in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, color, toggle*/ 776) {
    			$$invalidate(5, classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": toggle }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 1024) {
    			$$invalidate(6, closeClassNames = classnames("close", closeClassName));
    		}
    	};

    	return [
    		children,
    		closeAriaLabel,
    		isOpen,
    		toggle,
    		transition,
    		classes,
    		closeClassNames,
    		$$restProps,
    		className,
    		color,
    		closeClassName,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 8,
    			children: 0,
    			color: 9,
    			closeClassName: 10,
    			closeAriaLabel: 1,
    			isOpen: 2,
    			toggle: 3,
    			fade: 11,
    			transition: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.38.1 */
    const file$h = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (48:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$h, 48, 2, 985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 65539) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (33:0) {#if href}
    function create_if_block$9(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$2, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$h, 33, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(33:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (62:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$1(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$h, 58, 8, 1171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		outline,
    		size,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(10, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(5, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(6, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(8, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(6, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(8, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.38.1 */
    const file$g = "node_modules\\sveltestrap\\src\\FormGroup.svelte";

    // (25:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$g, 25, 2, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if tag === 'fieldset'}
    function create_if_block$8(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let fieldset_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$g, 21, 2, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(21:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === "fieldset") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","row","check","inline","disabled","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FormGroup", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { tag = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("row" in $$new_props) $$invalidate(4, row = $$new_props.row);
    		if ("check" in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ("inline" in $$new_props) $$invalidate(6, inline = $$new_props.inline);
    		if ("disabled" in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("tag" in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		tag,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("row" in $$props) $$invalidate(4, row = $$new_props.row);
    		if ("check" in $$props) $$invalidate(5, check = $$new_props.check);
    		if ("inline" in $$props) $$invalidate(6, inline = $$new_props.inline);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("tag" in $$props) $$invalidate(0, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 248) {
    			$$invalidate(1, classes = classnames(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$scope,
    		slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 3,
    			row: 4,
    			check: 5,
    			inline: 6,
    			disabled: 7,
    			tag: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.38.1 */
    const file$f = "node_modules\\sveltestrap\\src\\Input.svelte";

    // (356:40) 
    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ readonly: /*readonly*/ ctx[4] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[152].call(select));
    			add_location(select, file$f, 356, 2, 7097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			if (select_data.multiple) select_options(select, select_data.value);
    			select_option(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "blur", /*blur_handler_16*/ ctx[133], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_16*/ ctx[134], false, false, false),
    					listen_dev(select, "change", /*change_handler_15*/ ctx[135], false, false, false),
    					listen_dev(select, "input", /*input_handler_15*/ ctx[136], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[152])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, null, null);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				(!current || dirty[0] & /*classes*/ 512) && { class: /*classes*/ ctx[9] },
    				(!current || dirty[0] & /*name*/ 64) && { name: /*name*/ ctx[6] },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*readonly*/ 16) && { readonly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*$$restProps, classes, name, disabled, readonly*/ 4944 && select_data.multiple) select_options(select, select_data.value);

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(356:40) ",
    		ctx
    	});

    	return block;
    }

    // (340:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ readOnly: /*readonly*/ ctx[4] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$f, 340, 2, 6830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "blur", /*blur_handler_15*/ ctx[126], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler_15*/ ctx[127], false, false, false),
    					listen_dev(textarea, "keydown", /*keydown_handler_15*/ ctx[128], false, false, false),
    					listen_dev(textarea, "keypress", /*keypress_handler_15*/ ctx[129], false, false, false),
    					listen_dev(textarea, "keyup", /*keyup_handler_15*/ ctx[130], false, false, false),
    					listen_dev(textarea, "change", /*change_handler_14*/ ctx[131], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_14*/ ctx[132], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[151])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(340:29) ",
    		ctx
    	});

    	return block;
    }

    // (82:0) {#if tag === 'input'}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === "text") return create_if_block_1$1;
    		if (/*type*/ ctx[3] === "password") return create_if_block_2;
    		if (/*type*/ ctx[3] === "email") return create_if_block_3;
    		if (/*type*/ ctx[3] === "file") return create_if_block_4;
    		if (/*type*/ ctx[3] === "checkbox") return create_if_block_5;
    		if (/*type*/ ctx[3] === "radio") return create_if_block_6;
    		if (/*type*/ ctx[3] === "url") return create_if_block_7;
    		if (/*type*/ ctx[3] === "number") return create_if_block_8;
    		if (/*type*/ ctx[3] === "date") return create_if_block_9;
    		if (/*type*/ ctx[3] === "time") return create_if_block_10;
    		if (/*type*/ ctx[3] === "datetime") return create_if_block_11;
    		if (/*type*/ ctx[3] === "color") return create_if_block_12;
    		if (/*type*/ ctx[3] === "range") return create_if_block_13;
    		if (/*type*/ ctx[3] === "search") return create_if_block_14;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(82:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (322:2) {:else}
    function create_else_block$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 322, 4, 6503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.value = input_data.value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_14*/ ctx[121], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_14*/ ctx[122], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[123], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[124], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[125], false, false, false),
    					listen_dev(input, "input", /*handleInput*/ ctx[11], false, false, false),
    					listen_dev(input, "change", /*handleInput*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1] && { value: /*value*/ ctx[1] }
    			]));

    			if ("value" in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(322:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (305:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 305, 4, 6220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_13*/ ctx[114], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_13*/ ctx[115], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[116], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[117], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[118], false, false, false),
    					listen_dev(input, "change", /*change_handler_13*/ ctx[119], false, false, false),
    					listen_dev(input, "input", /*input_handler_13*/ ctx[120], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_9*/ ctx[150])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(305:30) ",
    		ctx
    	});

    	return block;
    }

    // (288:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 288, 4, 5917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_12*/ ctx[107], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_12*/ ctx[108], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[109], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[110], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[111], false, false, false),
    					listen_dev(input, "change", /*change_handler_12*/ ctx[112], false, false, false),
    					listen_dev(input, "input", /*input_handler_12*/ ctx[113], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[149]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[149])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(288:29) ",
    		ctx
    	});

    	return block;
    }

    // (271:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 271, 4, 5615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_11*/ ctx[100], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_11*/ ctx[101], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[102], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[103], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[104], false, false, false),
    					listen_dev(input, "change", /*change_handler_11*/ ctx[105], false, false, false),
    					listen_dev(input, "input", /*input_handler_11*/ ctx[106], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_8*/ ctx[148])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(271:29) ",
    		ctx
    	});

    	return block;
    }

    // (254:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 254, 4, 5310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_10*/ ctx[93], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_10*/ ctx[94], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[95], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[96], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[97], false, false, false),
    					listen_dev(input, "change", /*change_handler_10*/ ctx[98], false, false, false),
    					listen_dev(input, "input", /*input_handler_10*/ ctx[99], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_7*/ ctx[147])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(254:32) ",
    		ctx
    	});

    	return block;
    }

    // (237:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 237, 4, 5006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_9*/ ctx[86], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_9*/ ctx[87], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[88], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[89], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[90], false, false, false),
    					listen_dev(input, "change", /*change_handler_9*/ ctx[91], false, false, false),
    					listen_dev(input, "input", /*input_handler_9*/ ctx[92], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_6*/ ctx[146])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(237:28) ",
    		ctx
    	});

    	return block;
    }

    // (220:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 220, 4, 4706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_8*/ ctx[79], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_8*/ ctx[80], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[81], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[82], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[83], false, false, false),
    					listen_dev(input, "change", /*change_handler_8*/ ctx[84], false, false, false),
    					listen_dev(input, "input", /*input_handler_8*/ ctx[85], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_5*/ ctx[145])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(220:28) ",
    		ctx
    	});

    	return block;
    }

    // (203:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 203, 4, 4404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_7*/ ctx[72], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_7*/ ctx[73], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[74], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[75], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[76], false, false, false),
    					listen_dev(input, "change", /*change_handler_7*/ ctx[77], false, false, false),
    					listen_dev(input, "input", /*input_handler_7*/ ctx[78], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_4*/ ctx[144])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(203:30) ",
    		ctx
    	});

    	return block;
    }

    // (186:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 186, 4, 4103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_6*/ ctx[65], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_6*/ ctx[66], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[67], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[68], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[69], false, false, false),
    					listen_dev(input, "change", /*change_handler_6*/ ctx[70], false, false, false),
    					listen_dev(input, "input", /*input_handler_6*/ ctx[71], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_3*/ ctx[143])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(186:27) ",
    		ctx
    	});

    	return block;
    }

    // (169:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 169, 4, 3803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_5*/ ctx[58], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_5*/ ctx[59], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[60], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[61], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[62], false, false, false),
    					listen_dev(input, "change", /*change_handler_5*/ ctx[63], false, false, false),
    					listen_dev(input, "input", /*input_handler_5*/ ctx[64], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_2*/ ctx[142])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(169:29) ",
    		ctx
    	});

    	return block;
    }

    // (151:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 151, 4, 3479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_4*/ ctx[51], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_4*/ ctx[52], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[53], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[54], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[55], false, false, false),
    					listen_dev(input, "change", /*change_handler_4*/ ctx[56], false, false, false),
    					listen_dev(input, "input", /*input_handler_4*/ ctx[57], false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[141])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(151:32) ",
    		ctx
    	});

    	return block;
    }

    // (134:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 134, 4, 3175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_3*/ ctx[44], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_3*/ ctx[45], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[46], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[47], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[48], false, false, false),
    					listen_dev(input, "change", /*change_handler_3*/ ctx[49], false, false, false),
    					listen_dev(input, "input", /*input_handler_3*/ ctx[50], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[140])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(134:28) ",
    		ctx
    	});

    	return block;
    }

    // (117:29) 
    function create_if_block_3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 117, 4, 2874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[37], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[38], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[39], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[40], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[41], false, false, false),
    					listen_dev(input, "change", /*change_handler_2*/ ctx[42], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[43], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[139])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(117:29) ",
    		ctx
    	});

    	return block;
    }

    // (100:32) 
    function create_if_block_2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 100, 4, 2569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[30], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_1*/ ctx[31], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[32], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[33], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[34], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[35], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[36], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[138])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(100:32) ",
    		ctx
    	});

    	return block;
    }

    // (83:2) {#if type === 'text'}
    function create_if_block_1$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 83, 4, 2265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "blur", /*blur_handler*/ ctx[23], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[25], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[26], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[28], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[137])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(83:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_15, create_if_block_16];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[10] === "input") return 0;
    		if (/*tag*/ ctx[10] === "textarea") return 1;
    		if (/*tag*/ ctx[10] === "select" && !/*multiple*/ ctx[5]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","type","size","bsSize","color","checked","valid","invalid","plaintext","addon","value","files","readonly","multiple","name","placeholder","disabled"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { type = "text" } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = "" } = $$props;
    	let { files = "" } = $$props;
    	let { readonly = undefined } = $$props;
    	let { multiple = undefined } = $$props;
    	let { name = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { disabled = undefined } = $$props;
    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble($$self, event);
    	}

    	function change_handler_2(event) {
    		bubble($$self, event);
    	}

    	function input_handler_2(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble($$self, event);
    	}

    	function change_handler_3(event) {
    		bubble($$self, event);
    	}

    	function input_handler_3(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble($$self, event);
    	}

    	function change_handler_4(event) {
    		bubble($$self, event);
    	}

    	function input_handler_4(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble($$self, event);
    	}

    	function change_handler_5(event) {
    		bubble($$self, event);
    	}

    	function input_handler_5(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble($$self, event);
    	}

    	function change_handler_6(event) {
    		bubble($$self, event);
    	}

    	function input_handler_6(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble($$self, event);
    	}

    	function change_handler_7(event) {
    		bubble($$self, event);
    	}

    	function input_handler_7(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble($$self, event);
    	}

    	function change_handler_8(event) {
    		bubble($$self, event);
    	}

    	function input_handler_8(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble($$self, event);
    	}

    	function change_handler_9(event) {
    		bubble($$self, event);
    	}

    	function input_handler_9(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble($$self, event);
    	}

    	function change_handler_10(event) {
    		bubble($$self, event);
    	}

    	function input_handler_10(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble($$self, event);
    	}

    	function change_handler_11(event) {
    		bubble($$self, event);
    	}

    	function input_handler_11(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble($$self, event);
    	}

    	function change_handler_12(event) {
    		bubble($$self, event);
    	}

    	function input_handler_12(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble($$self, event);
    	}

    	function change_handler_13(event) {
    		bubble($$self, event);
    	}

    	function input_handler_13(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble($$self, event);
    	}

    	function change_handler_14(event) {
    		bubble($$self, event);
    	}

    	function input_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble($$self, event);
    	}

    	function change_handler_15(event) {
    		bubble($$self, event);
    	}

    	function input_handler_15(event) {
    		bubble($$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(15, className = $$new_props.class);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$new_props) $$invalidate(13, size = $$new_props.size);
    		if ("bsSize" in $$new_props) $$invalidate(14, bsSize = $$new_props.bsSize);
    		if ("color" in $$new_props) $$invalidate(16, color = $$new_props.color);
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ("invalid" in $$new_props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ("plaintext" in $$new_props) $$invalidate(19, plaintext = $$new_props.plaintext);
    		if ("addon" in $$new_props) $$invalidate(20, addon = $$new_props.addon);
    		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("name" in $$new_props) $$invalidate(6, name = $$new_props.name);
    		if ("placeholder" in $$new_props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		type,
    		size,
    		bsSize,
    		color,
    		checked,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		value,
    		files,
    		readonly,
    		multiple,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(15, className = $$new_props.className);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$props) $$invalidate(13, size = $$new_props.size);
    		if ("bsSize" in $$props) $$invalidate(14, bsSize = $$new_props.bsSize);
    		if ("color" in $$props) $$invalidate(16, color = $$new_props.color);
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$props) $$invalidate(17, valid = $$new_props.valid);
    		if ("invalid" in $$props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ("plaintext" in $$props) $$invalidate(19, plaintext = $$new_props.plaintext);
    		if ("addon" in $$props) $$invalidate(20, addon = $$new_props.addon);
    		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("name" in $$props) $$invalidate(6, name = $$new_props.name);
    		if ("placeholder" in $$props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(9, classes = $$new_props.classes);
    		if ("tag" in $$props) $$invalidate(10, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 2088968) {
    			{
    				const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
    				const isNotaNumber = new RegExp("\\D", "g");
    				const fileInput = type === "file";
    				const textareaInput = type === "textarea";
    				const rangeInput = type === "range";
    				const selectInput = type === "select";
    				const buttonInput = type === "button" || type === "reset" || type === "submit";
    				const unsupportedInput = type === "hidden" || type === "image";
    				$$invalidate(10, tag = selectInput || textareaInput ? type : "input");
    				let formControlClass = "form-control";

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(10, tag = "input");
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = "form-check-input";
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || "secondary"}`;
    				} else if (rangeInput) {
    					formControlClass = "form-control-range";
    				} else if (unsupportedInput) {
    					formControlClass = "";
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn("Please use the prop \"bsSize\" instead of the \"size\" to bootstrap's input sizing.");
    					$$invalidate(14, bsSize = size);
    					$$invalidate(13, size = undefined);
    				}

    				$$invalidate(9, classes = classnames(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		handleInput,
    		$$restProps,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		$$scope,
    		slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				class: 15,
    				type: 3,
    				size: 13,
    				bsSize: 14,
    				color: 16,
    				checked: 0,
    				valid: 17,
    				invalid: 18,
    				plaintext: 19,
    				addon: 20,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				name: 6,
    				placeholder: 7,
    				disabled: 8
    			},
    			[-1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.38.1 */
    const file$e = "node_modules\\sveltestrap\\src\\Nav.svelte";

    function create_fragment$f(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$e, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === "xs") {
    		return "flex-column";
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = "" } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$props) $$invalidate(10, card = $$new_props.card);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				"nav-tabs": tabs,
    				"card-header-tabs": card && tabs,
    				"nav-pills": pills,
    				"card-header-pills": card && pills,
    				"nav-justified": justified,
    				"nav-fill": fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.38.1 */
    const file$d = "node_modules\\sveltestrap\\src\\Navbar.svelte";

    function create_fragment$e(ctx) {
    	let nav;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let nav_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (default_slot) default_slot.c();
    			set_attributes(nav, nav_data);
    			add_location(nav, file$d, 31, 0, 719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === "xs") {
    		return "navbar-expand";
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","light","dark","fixed","sticky","color","expand"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { light = false } = $$props;
    	let { dark = false } = $$props;
    	let { fixed = "" } = $$props;
    	let { sticky = "" } = $$props;
    	let { color = "" } = $$props;
    	let { expand = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("light" in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ("dark" in $$new_props) $$invalidate(4, dark = $$new_props.dark);
    		if ("fixed" in $$new_props) $$invalidate(5, fixed = $$new_props.fixed);
    		if ("sticky" in $$new_props) $$invalidate(6, sticky = $$new_props.sticky);
    		if ("color" in $$new_props) $$invalidate(7, color = $$new_props.color);
    		if ("expand" in $$new_props) $$invalidate(8, expand = $$new_props.expand);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		light,
    		dark,
    		fixed,
    		sticky,
    		color,
    		expand,
    		getExpandClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("light" in $$props) $$invalidate(3, light = $$new_props.light);
    		if ("dark" in $$props) $$invalidate(4, dark = $$new_props.dark);
    		if ("fixed" in $$props) $$invalidate(5, fixed = $$new_props.fixed);
    		if ("sticky" in $$props) $$invalidate(6, sticky = $$new_props.sticky);
    		if ("color" in $$props) $$invalidate(7, color = $$new_props.color);
    		if ("expand" in $$props) $$invalidate(8, expand = $$new_props.expand);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 508) {
    			$$invalidate(0, classes = classnames(className, "navbar", getExpandClass(expand), {
    				"navbar-light": light,
    				"navbar-dark": dark,
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		light,
    		dark,
    		fixed,
    		sticky,
    		color,
    		expand,
    		$$scope,
    		slots
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			class: 2,
    			light: 3,
    			dark: 4,
    			fixed: 5,
    			sticky: 6,
    			color: 7,
    			expand: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sticky() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavItem.svelte generated by Svelte v3.38.1 */
    const file$c = "node_modules\\sveltestrap\\src\\NavItem.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$c, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, "nav-item", active ? "active" : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavLink.svelte generated by Svelte v3.38.1 */
    const file$b = "node_modules\\sveltestrap\\src\\NavLink.svelte";

    function create_fragment$c(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$b, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = "#" } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === "#") {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, "nav-link", { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavbarBrand.svelte generated by Svelte v3.38.1 */
    const file$a = "node_modules\\sveltestrap\\src\\NavbarBrand.svelte";

    function create_fragment$b(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ href: /*href*/ ctx[0] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$a, 10, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavbarBrand", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { href = "/" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, href, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, "navbar-brand"));
    		}
    	};

    	return [href, classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.38.1 */
    const file$9 = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (35:0) {:else}
    function create_else_block$1(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$9, 35, 2, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if responsive}
    function create_if_block$6(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$9, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$9, 29, 2, 735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let classes;
    	let responsiveClassName;
    	const omit_props_names = ["class","size","bordered","borderless","striped","dark","hover","responsive"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(1, classes = classnames(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\NotFound.svelte generated by Svelte v3.38.1 */
    const file$8 = "src\\front\\NotFound.svelte";

    // (13:4) <Button color="primary">
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver a la página principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(13:4) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let h4;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let button;
    	let t6;
    	let current;

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "404";
    			t1 = space();
    			h4 = element("h4");
    			h4.textContent = "Upps! Página no encontrada";
    			t3 = space();
    			p = element("p");
    			p.textContent = "La página que estabas buscando no existe. Tal vez hallas escrito \r\n  mal la dirección o está ha cambiado.";
    			t5 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			t6 = text("\r\n\r\n\r\n© 2021 GitHub, Inc.\r\nTerms\r\nPrivacy\r\nSecurity\r\nStatus\r\nDocs\r\nContact GitHub\r\nPricing\r\nAPI\r\nTraining\r\nBlog\r\nAbout\r\nLoading complete");
    			attr_dev(h2, "class", "svelte-x3yptu");
    			add_location(h2, file$8, 7, 2, 80);
    			attr_dev(h4, "class", "svelte-x3yptu");
    			add_location(h4, file$8, 8, 0, 94);
    			add_location(p, file$8, 9, 0, 131);
    			attr_dev(a, "href", "/");
    			add_location(a, file$8, 11, 2, 247);
    			attr_dev(main, "class", "svelte-x3yptu");
    			add_location(main, file$8, 6, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, h4);
    			append_dev(main, t3);
    			append_dev(main, p);
    			append_dev(main, t5);
    			append_dev(main, a);
    			mount_component(button, a, null);
    			insert_dev(target, t6, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			if (detaching) detach_dev(t6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.38.1 */
    const file$7 = "src\\front\\Home.svelte";

    // (12:23) <Button color="info">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Descubre más!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(12:23) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let body;
    	let t3;
    	let a;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "SOS2021 - 30";
    			t1 = space();
    			body = element("body");
    			body.textContent = "La relación entre la calidad de vida inducida por los factores de consumo de alcohol y tabaco, \r\n        el índice de masa corporal y la esperanza de vida al nacer según la región de España en los últimos años, \r\n        ¿influye el imc o el consumo de alcohol y tabaco en la evolución de la esperanza de vida?¿Influye la situación \r\n        geográfica, edad, género en el consumo de alcohol y tabaco?";
    			t3 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			attr_dev(h1, "class", "svelte-1gr809u");
    			add_location(h1, file$7, 5, 4, 92);
    			add_location(body, file$7, 6, 4, 119);
    			attr_dev(a, "href", "./#/info");
    			add_location(a, file$7, 11, 4, 545);
    			attr_dev(main, "class", "svelte-1gr809u");
    			add_location(main, file$7, 4, 0, 80);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, body);
    			append_dev(main, t3);
    			append_dev(main, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\front\Info.svelte generated by Svelte v3.38.1 */
    const file$6 = "src\\front\\Info.svelte";

    // (19:52) <Button color="info">
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("gti-sos/SOS2021-30");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(19:52) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:46) <Button color="info">
    function create_default_slot_11$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("http://sos2021-30.herokuapp.com");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(21:46) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:87) <Button color="info">
    function create_default_slot_10$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(40:87) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:87) <Button color="info">
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(45:87) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:87) <Button color="info">
    function create_default_slot_8$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$5.name,
    		type: "slot",
    		source: "(50:87) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (51:87) <Button color="info">
    function create_default_slot_7$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$5.name,
    		type: "slot",
    		source: "(51:87) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (56:87) <Button color="info">
    function create_default_slot_6$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación v1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$5.name,
    		type: "slot",
    		source: "(56:87) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Table bordered responsive>
    function create_default_slot_5$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let t7;
    	let td1;
    	let t9;
    	let td2;
    	let a0;
    	let button0;
    	let t10;
    	let tr2;
    	let td3;
    	let t12;
    	let td4;
    	let t14;
    	let td5;
    	let a1;
    	let button1;
    	let t15;
    	let tr3;
    	let td6;
    	let t17;
    	let td7;
    	let t19;
    	let td8;
    	let a2;
    	let button2;
    	let t20;
    	let a3;
    	let button3;
    	let t21;
    	let tr4;
    	let td9;
    	let t23;
    	let td10;
    	let t25;
    	let td11;
    	let a4;
    	let button4;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_8$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_7$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_6$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Desarrollador";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "API";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Documentación";
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Alejandro Sánchez Márquez";
    			t7 = space();
    			td1 = element("td");
    			td1.textContent = "API life-expectancy-stats";
    			t9 = space();
    			td2 = element("td");
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			td3.textContent = "Juan Pedro Hurtado Masero";
    			t12 = space();
    			td4 = element("td");
    			td4.textContent = "API smokers-Stats";
    			t14 = space();
    			td5 = element("td");
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t15 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Jesús Ruiz Domínguez";
    			t17 = space();
    			td7 = element("td");
    			td7.textContent = "API Weights-Stats";
    			t19 = space();
    			td8 = element("td");
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			t20 = space();
    			a3 = element("a");
    			create_component(button3.$$.fragment);
    			t21 = space();
    			tr4 = element("tr");
    			td9 = element("td");
    			td9.textContent = "Víctor Caballero Sánchez";
    			t23 = space();
    			td10 = element("td");
    			td10.textContent = "API alcohol-consumption-stats";
    			t25 = space();
    			td11 = element("td");
    			a4 = element("a");
    			create_component(button4.$$.fragment);
    			add_location(th0, file$6, 31, 12, 2322);
    			add_location(th1, file$6, 32, 12, 2358);
    			add_location(th2, file$6, 33, 12, 2384);
    			add_location(tr0, file$6, 30, 10, 2304);
    			add_location(thead, file$6, 29, 8, 2285);
    			add_location(td0, file$6, 37, 16, 2477);
    			add_location(td1, file$6, 38, 16, 2529);
    			attr_dev(a0, "href", "https://documenter.getpostman.com/view/14968155/TzJsecsr");
    			add_location(a0, file$6, 39, 20, 2585);
    			add_location(td2, file$6, 39, 16, 2581);
    			add_location(tr1, file$6, 36, 12, 2455);
    			add_location(td3, file$6, 42, 16, 2762);
    			add_location(td4, file$6, 43, 16, 2814);
    			attr_dev(a1, "href", "https://documenter.getpostman.com/view/14966429/TzJoFgHe");
    			add_location(a1, file$6, 44, 20, 2862);
    			add_location(td5, file$6, 44, 16, 2858);
    			add_location(tr2, file$6, 41, 12, 2740);
    			add_location(td6, file$6, 47, 16, 3039);
    			add_location(td7, file$6, 48, 16, 3086);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14975289/TzRLjpaY");
    			add_location(a2, file$6, 49, 20, 3134);
    			attr_dev(a3, "href", "https://documenter.getpostman.com/view/14975289/TzRLnWWU");
    			add_location(a3, file$6, 50, 20, 3273);
    			add_location(td8, file$6, 49, 16, 3130);
    			add_location(tr3, file$6, 46, 12, 3017);
    			add_location(td9, file$6, 53, 16, 3450);
    			add_location(td10, file$6, 54, 16, 3501);
    			attr_dev(a4, "href", "https://documenter.getpostman.com/view/14942936/TzJsheDD");
    			add_location(a4, file$6, 55, 20, 3561);
    			add_location(td11, file$6, 55, 16, 3557);
    			add_location(tr4, file$6, 52, 12, 3428);
    			add_location(tbody, file$6, 35, 8, 2434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t7);
    			append_dev(tr1, td1);
    			append_dev(tr1, t9);
    			append_dev(tr1, td2);
    			append_dev(td2, a0);
    			mount_component(button0, a0, null);
    			append_dev(tbody, t10);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td3);
    			append_dev(tr2, t12);
    			append_dev(tr2, td4);
    			append_dev(tr2, t14);
    			append_dev(tr2, td5);
    			append_dev(td5, a1);
    			mount_component(button1, a1, null);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t17);
    			append_dev(tr3, td7);
    			append_dev(tr3, t19);
    			append_dev(tr3, td8);
    			append_dev(td8, a2);
    			mount_component(button2, a2, null);
    			append_dev(td8, t20);
    			append_dev(td8, a3);
    			mount_component(button3, a3, null);
    			append_dev(tbody, t21);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td9);
    			append_dev(tr4, t23);
    			append_dev(tr4, td10);
    			append_dev(tr4, t25);
    			append_dev(tr4, td11);
    			append_dev(td11, a4);
    			mount_component(button4, a4, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    			destroy_component(button4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$5.name,
    		type: "slot",
    		source: "(29:4) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (73:75) <Button color="info">
    function create_default_slot_4$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("life-expectancy-stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(73:75) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:78) <Button color="info">
    function create_default_slot_3$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("smokers-stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(78:78) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:78) <Button color="info">
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("weight-stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(83:78) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (88:78) <Button color="info">
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("alcohol-consumption-stats");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(88:78) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Table bordered responsive>
    function create_default_slot$6(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let t7;
    	let td1;
    	let t9;
    	let td2;
    	let a0;
    	let button0;
    	let t10;
    	let tr2;
    	let td3;
    	let t12;
    	let td4;
    	let t14;
    	let td5;
    	let a1;
    	let button1;
    	let t15;
    	let tr3;
    	let td6;
    	let t17;
    	let td7;
    	let t19;
    	let td8;
    	let a2;
    	let button2;
    	let t20;
    	let tr4;
    	let td9;
    	let t22;
    	let td10;
    	let t24;
    	let td11;
    	let a3;
    	let button3;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Desarrollador";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Front-End";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Enlace";
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Alejandro Sánchez Márquez";
    			t7 = space();
    			td1 = element("td");
    			td1.textContent = "Front-End API life-expectancy-stats";
    			t9 = space();
    			td2 = element("td");
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			td3.textContent = "Juan Pedro Hurtado Masero";
    			t12 = space();
    			td4 = element("td");
    			td4.textContent = "Front-End API smokers-stats";
    			t14 = space();
    			td5 = element("td");
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t15 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Jesús Ruiz Domínguez";
    			t17 = space();
    			td7 = element("td");
    			td7.textContent = "Front-End API weight-stats";
    			t19 = space();
    			td8 = element("td");
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			t20 = space();
    			tr4 = element("tr");
    			td9 = element("td");
    			td9.textContent = "Víctor Caballero Sánchez";
    			t22 = space();
    			td10 = element("td");
    			td10.textContent = "Front-End API alcohol-consumption-stats";
    			t24 = space();
    			td11 = element("td");
    			a3 = element("a");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$6, 64, 12, 3852);
    			add_location(th1, file$6, 65, 12, 3888);
    			add_location(th2, file$6, 66, 12, 3920);
    			add_location(tr0, file$6, 63, 10, 3834);
    			add_location(thead, file$6, 62, 8, 3815);
    			add_location(td0, file$6, 70, 16, 4006);
    			add_location(td1, file$6, 71, 16, 4058);
    			attr_dev(a0, "href", "http://sos2021-30.herokuapp.com/#/life-stats");
    			add_location(a0, file$6, 72, 20, 4124);
    			add_location(td2, file$6, 72, 16, 4120);
    			add_location(tr1, file$6, 69, 12, 3984);
    			add_location(td3, file$6, 75, 16, 4294);
    			add_location(td4, file$6, 76, 16, 4346);
    			attr_dev(a1, "href", "http://sos2021-30.herokuapp.com/#/smokers-stats");
    			add_location(a1, file$6, 77, 20, 4404);
    			add_location(td5, file$6, 77, 16, 4400);
    			add_location(tr2, file$6, 74, 12, 4272);
    			add_location(td6, file$6, 80, 16, 4569);
    			add_location(td7, file$6, 81, 16, 4616);
    			attr_dev(a2, "href", "http://sos2021-30.herokuapp.com/#/weights-stats");
    			add_location(a2, file$6, 82, 20, 4673);
    			add_location(td8, file$6, 82, 16, 4669);
    			add_location(tr3, file$6, 79, 12, 4547);
    			add_location(td9, file$6, 85, 16, 4837);
    			add_location(td10, file$6, 86, 16, 4888);
    			attr_dev(a3, "href", "http://sos2021-30.herokuapp.com/#/alcohol-stats");
    			add_location(a3, file$6, 87, 20, 4958);
    			add_location(td11, file$6, 87, 16, 4954);
    			add_location(tr4, file$6, 84, 12, 4815);
    			add_location(tbody, file$6, 68, 8, 3963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t7);
    			append_dev(tr1, td1);
    			append_dev(tr1, t9);
    			append_dev(tr1, td2);
    			append_dev(td2, a0);
    			mount_component(button0, a0, null);
    			append_dev(tbody, t10);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td3);
    			append_dev(tr2, t12);
    			append_dev(tr2, td4);
    			append_dev(tr2, t14);
    			append_dev(tr2, td5);
    			append_dev(td5, a1);
    			mount_component(button1, a1, null);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t17);
    			append_dev(tr3, td7);
    			append_dev(tr3, t19);
    			append_dev(tr3, td8);
    			append_dev(td8, a2);
    			mount_component(button2, a2, null);
    			append_dev(tbody, t20);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td9);
    			append_dev(tr4, t22);
    			append_dev(tr4, td10);
    			append_dev(tr4, t24);
    			append_dev(tr4, td11);
    			append_dev(td11, a3);
    			mount_component(button3, a3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(62:4) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let h10;
    	let t1;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let h11;
    	let t11;
    	let p;
    	let t13;
    	let h12;
    	let t15;
    	let a4;
    	let button0;
    	let t16;
    	let h13;
    	let t18;
    	let a5;
    	let button1;
    	let t19;
    	let h14;
    	let t21;
    	let li4;
    	let a6;
    	let t23;
    	let li5;
    	let a7;
    	let t25;
    	let li6;
    	let a8;
    	let t27;
    	let li7;
    	let a9;
    	let t29;
    	let h15;
    	let t31;
    	let table0;
    	let t32;
    	let h16;
    	let t34;
    	let table1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h10 = element("h1");
    			h10.textContent = "Equipo";
    			t1 = space();
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Alejandro Sánchez Márquez (life-expectancy-stats)";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Juan Pedro Hurtado Masero (smokers-stats)";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Jesús Ruiz Domínguez (table-weights-stats)";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Víctor Caballero Sánchez (alcohol-consumption-stats)";
    			t9 = space();
    			h11 = element("h1");
    			h11.textContent = "Descripción del proyecto";
    			t11 = space();
    			p = element("p");
    			p.textContent = "La relación entre la calidad de vida inducida por los factores de consumo de alcohol y tabaco, \r\n        el índice de masa corporal y la esperanza de vida al nacer según la región de España en el año 2017, \r\n        ¿influye el imc o el consumo de alcohol y tabaco en la evolución de la esperanza de vida?\r\n        ¿Influye la situación geográfica, edad, género en el consumo de alcohol y tabaco?";
    			t13 = space();
    			h12 = element("h1");
    			h12.textContent = "Repositorio";
    			t15 = space();
    			a4 = element("a");
    			create_component(button0.$$.fragment);
    			t16 = space();
    			h13 = element("h1");
    			h13.textContent = "URL";
    			t18 = space();
    			a5 = element("a");
    			create_component(button1.$$.fragment);
    			t19 = space();
    			h14 = element("h1");
    			h14.textContent = "APIS";
    			t21 = space();
    			li4 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://sos2021-30.herokuapp.com/api/v1/life-expectancy-stats (developed by Alejandro Sánchez Márquez)";
    			t23 = space();
    			li5 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://sos2021-30.herokuapp.com/api/v1/smokers-stats (developed by Juan Pedro Hurtado Masero)";
    			t25 = space();
    			li6 = element("li");
    			a8 = element("a");
    			a8.textContent = "https://sos2021-30.herokuapp.com/api/v1/table-weights-stats (developed by Jesús Ruiz Domínguez)";
    			t27 = space();
    			li7 = element("li");
    			a9 = element("a");
    			a9.textContent = "https://sos2021-30.herokuapp.com/api/v1/alcohol-consumption-stats (developed by Víctor Caballero Sánchez)";
    			t29 = space();
    			h15 = element("h1");
    			h15.textContent = "DOCUMENTACIÓN POSTMAN DE LAS APIS";
    			t31 = space();
    			create_component(table0.$$.fragment);
    			t32 = space();
    			h16 = element("h1");
    			h16.textContent = "ENLACES FRONT-END";
    			t34 = space();
    			create_component(table1.$$.fragment);
    			add_location(h10, file$6, 6, 4, 148);
    			attr_dev(a0, "href", "https://github.com/Alesanmar");
    			add_location(a0, file$6, 7, 22, 187);
    			attr_dev(li0, "type", "circle");
    			add_location(li0, file$6, 7, 4, 169);
    			attr_dev(a1, "href", "https://github.com/Juanpepitt");
    			add_location(a1, file$6, 8, 22, 308);
    			attr_dev(li1, "type", "circle");
    			add_location(li1, file$6, 8, 4, 290);
    			attr_dev(a2, "href", "https://github.com/jesruidom");
    			add_location(a2, file$6, 9, 22, 422);
    			attr_dev(li2, "type", "circle");
    			add_location(li2, file$6, 9, 4, 404);
    			attr_dev(a3, "href", "https://github.com/vic3214");
    			add_location(a3, file$6, 10, 22, 536);
    			attr_dev(li3, "type", "circle");
    			add_location(li3, file$6, 10, 4, 518);
    			add_location(h11, file$6, 11, 4, 640);
    			add_location(p, file$6, 12, 4, 679);
    			add_location(h12, file$6, 17, 4, 1090);
    			attr_dev(a4, "href", "https://github.com/gti-sos/SOS2021-30");
    			add_location(a4, file$6, 18, 4, 1116);
    			add_location(h13, file$6, 19, 4, 1222);
    			attr_dev(a5, "href", "http://sos2021-30.herokuapp.com");
    			add_location(a5, file$6, 20, 4, 1240);
    			add_location(h14, file$6, 21, 4, 1353);
    			attr_dev(a6, "href", "https://sos2021-30.herokuapp.com/api/v1/life-expectancy-stats");
    			add_location(a6, file$6, 22, 22, 1390);
    			attr_dev(li4, "type", "circle");
    			add_location(li4, file$6, 22, 4, 1372);
    			attr_dev(a7, "href", "https://sos2021-30.herokuapp.com/api/v1/smokers-stats");
    			add_location(a7, file$6, 23, 22, 1601);
    			attr_dev(li5, "type", "circle");
    			add_location(li5, file$6, 23, 4, 1583);
    			attr_dev(a8, "href", "https://sos2021-30.herokuapp.com/api/v1/table-weights-stats");
    			add_location(a8, file$6, 24, 22, 1796);
    			attr_dev(li6, "type", "circle");
    			add_location(li6, file$6, 24, 4, 1778);
    			attr_dev(a9, "href", "https://sos2021-30.herokuapp.com/api/v1/alcohol-consumption-stats");
    			add_location(a9, file$6, 25, 22, 1998);
    			attr_dev(li7, "type", "circle");
    			add_location(li7, file$6, 25, 4, 1980);
    			add_location(h15, file$6, 27, 4, 2200);
    			add_location(h16, file$6, 60, 4, 3746);
    			add_location(main, file$6, 5, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h10);
    			append_dev(main, t1);
    			append_dev(main, li0);
    			append_dev(li0, a0);
    			append_dev(main, t3);
    			append_dev(main, li1);
    			append_dev(li1, a1);
    			append_dev(main, t5);
    			append_dev(main, li2);
    			append_dev(li2, a2);
    			append_dev(main, t7);
    			append_dev(main, li3);
    			append_dev(li3, a3);
    			append_dev(main, t9);
    			append_dev(main, h11);
    			append_dev(main, t11);
    			append_dev(main, p);
    			append_dev(main, t13);
    			append_dev(main, h12);
    			append_dev(main, t15);
    			append_dev(main, a4);
    			mount_component(button0, a4, null);
    			append_dev(main, t16);
    			append_dev(main, h13);
    			append_dev(main, t18);
    			append_dev(main, a5);
    			mount_component(button1, a5, null);
    			append_dev(main, t19);
    			append_dev(main, h14);
    			append_dev(main, t21);
    			append_dev(main, li4);
    			append_dev(li4, a6);
    			append_dev(main, t23);
    			append_dev(main, li5);
    			append_dev(li5, a7);
    			append_dev(main, t25);
    			append_dev(main, li6);
    			append_dev(li6, a8);
    			append_dev(main, t27);
    			append_dev(main, li7);
    			append_dev(li7, a9);
    			append_dev(main, t29);
    			append_dev(main, h15);
    			append_dev(main, t31);
    			mount_component(table0, main, null);
    			append_dev(main, t32);
    			append_dev(main, h16);
    			append_dev(main, t34);
    			mount_component(table1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const table0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(table0);
    			destroy_component(table1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Info", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button, Table });
    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.38.1 */

    const { Error: Error_1, Object: Object_1, console: console_1$5 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\lifeExpectancy.svelte generated by Svelte v3.38.1 */

    const { console: console_1$4 } = globals;
    const file$5 = "src\\front\\lifeExpectancy.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import{           onMount        }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import{           onMount        }",
    		ctx
    	});

    	return block;
    }

    // (279:8) {:then LifeExpectancyStats}
    function create_then_block$3(ctx) {
    	let alert_1;
    	let t0;
    	let table;
    	let t1;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[2],
    				toggle: /*func*/ ctx[12],
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getLifeExpectancy*/ ctx[5]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteALL*/ ctx[9]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*getPreviewPage*/ ctx[11]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*getNextPage*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table.$$.fragment);
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			create_component(button3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(button3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty & /*color*/ 8) alert_1_changes.color = /*color*/ ctx[3];
    			if (dirty & /*visible*/ 4) alert_1_changes.isOpen = /*visible*/ ctx[2];
    			if (dirty & /*visible*/ 4) alert_1_changes.toggle = /*func*/ ctx[12];

    			if (dirty & /*$$scope, checkMSG*/ 33554434) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table_changes = {};

    			if (dirty & /*$$scope, LifeExpectancyStats, newLife*/ 33554449) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(button3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(279:8) {:then LifeExpectancyStats}",
    		ctx
    	});

    	return block;
    }

    // (282:12) {#if checkMSG}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 2) set_data_dev(t, /*checkMSG*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(282:12) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (281:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_8$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(281:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (307:60) <Button outline color="primary" on:click={insertLife}>
    function create_default_slot_7$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(307:60) <Button outline color=\\\"primary\\\" on:click={insertLife}>",
    		ctx
    	});

    	return block;
    }

    // (319:20) <Button outline color="danger" on:click="{deleteLife(life.province, life.year)}">
    function create_default_slot_6$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(319:20) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteLife(life.province, life.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (320:20) <Button outline color="primary" on:click="{editLife(life.province, life.year)}">
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(320:20) <Button outline color=\\\"primary\\\" on:click=\\\"{editLife(life.province, life.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (310:8) {#each LifeExpectancyStats as life}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*life*/ ctx[22].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let a;
    	let t2_value = /*life*/ ctx[22].province + "";
    	let t2;
    	let a_href_value;
    	let t3;
    	let td2;
    	let t4_value = /*life*/ ctx[22].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*life*/ ctx[22].lifeExpectancyWoman + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*life*/ ctx[22].lifeExpectancyMan + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*life*/ ctx[22].averageLifeExpectancy + "";
    	let t10;
    	let t11;
    	let td6;
    	let button0;
    	let t12;
    	let td7;
    	let button1;
    	let t13;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*deleteLife*/ ctx[8](/*life*/ ctx[22].province, /*life*/ ctx[22].year))) /*deleteLife*/ ctx[8](/*life*/ ctx[22].province, /*life*/ ctx[22].year).apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*editLife*/ ctx[7](/*life*/ ctx[22].province, /*life*/ ctx[22].year))) /*editLife*/ ctx[7](/*life*/ ctx[22].province, /*life*/ ctx[22].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			a = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			create_component(button0.$$.fragment);
    			t12 = space();
    			td7 = element("td");
    			create_component(button1.$$.fragment);
    			t13 = space();
    			add_location(td0, file$5, 312, 16, 11735);
    			attr_dev(a, "href", a_href_value = "api/v1/life-expectancy-stats/" + /*life*/ ctx[22].province + "/" + /*life*/ ctx[22].year);
    			add_location(a, file$5, 313, 20, 11780);
    			add_location(td1, file$5, 313, 16, 11776);
    			add_location(td2, file$5, 314, 16, 11889);
    			add_location(td3, file$5, 315, 16, 11927);
    			add_location(td4, file$5, 316, 16, 11980);
    			add_location(td5, file$5, 317, 16, 12031);
    			add_location(td6, file$5, 318, 16, 12086);
    			add_location(td7, file$5, 319, 16, 12209);
    			add_location(tr, file$5, 310, 12, 11695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, a);
    			append_dev(a, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			mount_component(button0, td6, null);
    			append_dev(tr, t12);
    			append_dev(tr, td7);
    			mount_component(button1, td7, null);
    			append_dev(tr, t13);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t0_value !== (t0_value = /*life*/ ctx[22].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t2_value !== (t2_value = /*life*/ ctx[22].province + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*LifeExpectancyStats*/ 16 && a_href_value !== (a_href_value = "api/v1/life-expectancy-stats/" + /*life*/ ctx[22].province + "/" + /*life*/ ctx[22].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t4_value !== (t4_value = /*life*/ ctx[22].year + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t6_value !== (t6_value = /*life*/ ctx[22].lifeExpectancyWoman + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t8_value !== (t8_value = /*life*/ ctx[22].lifeExpectancyMan + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*LifeExpectancyStats*/ 16) && t10_value !== (t10_value = /*life*/ ctx[22].averageLifeExpectancy + "")) set_data_dev(t10, t10_value);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(310:8) {#each LifeExpectancyStats as life}",
    		ctx
    	});

    	return block;
    }

    // (287:8) <Table bordered responsive>
    function create_default_slot_4$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let input5;
    	let t19;
    	let td6;
    	let button;
    	let t20;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertLife*/ ctx[6]);
    	let each_value = /*LifeExpectancyStats*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Comunidad autonoma";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Esperanza de vida en mujeres";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Esperanza de vida en hombre";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Esperanza de vida media";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			input5 = element("input");
    			t19 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			t20 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$5, 289, 20, 10439);
    			add_location(th1, file$5, 290, 20, 10474);
    			add_location(th2, file$5, 291, 20, 10523);
    			add_location(th3, file$5, 292, 20, 10557);
    			add_location(th4, file$5, 293, 20, 10616);
    			add_location(th5, file$5, 294, 20, 10674);
    			attr_dev(th6, "colspan", "2");
    			add_location(th6, file$5, 295, 20, 10728);
    			add_location(tr0, file$5, 288, 16, 10413);
    			add_location(thead, file$5, 287, 12, 10388);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "España");
    			add_location(input0, file$5, 300, 20, 10855);
    			add_location(td0, file$5, 300, 16, 10851);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Cataluña");
    			add_location(input1, file$5, 301, 20, 10955);
    			add_location(td1, file$5, 301, 16, 10951);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "2017");
    			add_location(input2, file$5, 302, 20, 11059);
    			add_location(td2, file$5, 302, 16, 11055);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "80");
    			add_location(input3, file$5, 303, 20, 11155);
    			add_location(td3, file$5, 303, 16, 11151);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "81.4");
    			add_location(input4, file$5, 304, 20, 11269);
    			add_location(td4, file$5, 304, 16, 11265);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "80.8");
    			add_location(input5, file$5, 305, 20, 11381);
    			add_location(td5, file$5, 305, 16, 11377);
    			attr_dev(td6, "colspan", "2");
    			set_style(td6, "text-align", "center");
    			add_location(td6, file$5, 306, 16, 11493);
    			add_location(tr1, file$5, 299, 12, 10829);
    			add_location(tbody, file$5, 298, 8, 10808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newLife*/ ctx[0].country);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newLife*/ ctx[0].province);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newLife*/ ctx[0].year);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newLife*/ ctx[0].lifeExpectancyWoman);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newLife*/ ctx[0].lifeExpectancyMan);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			append_dev(td5, input5);
    			set_input_value(input5, /*newLife*/ ctx[0].averageLifeExpectancy);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button, td6, null);
    			append_dev(tbody, t20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[17]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newLife*/ 1 && input0.value !== /*newLife*/ ctx[0].country) {
    				set_input_value(input0, /*newLife*/ ctx[0].country);
    			}

    			if (dirty & /*newLife*/ 1 && input1.value !== /*newLife*/ ctx[0].province) {
    				set_input_value(input1, /*newLife*/ ctx[0].province);
    			}

    			if (dirty & /*newLife*/ 1 && input2.value !== /*newLife*/ ctx[0].year) {
    				set_input_value(input2, /*newLife*/ ctx[0].year);
    			}

    			if (dirty & /*newLife*/ 1 && to_number(input3.value) !== /*newLife*/ ctx[0].lifeExpectancyWoman) {
    				set_input_value(input3, /*newLife*/ ctx[0].lifeExpectancyWoman);
    			}

    			if (dirty & /*newLife*/ 1 && to_number(input4.value) !== /*newLife*/ ctx[0].lifeExpectancyMan) {
    				set_input_value(input4, /*newLife*/ ctx[0].lifeExpectancyMan);
    			}

    			if (dirty & /*newLife*/ 1 && to_number(input5.value) !== /*newLife*/ ctx[0].averageLifeExpectancy) {
    				set_input_value(input5, /*newLife*/ ctx[0].averageLifeExpectancy);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*editLife, LifeExpectancyStats, deleteLife*/ 400) {
    				each_value = /*LifeExpectancyStats*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(287:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (326:8) <Button color="success" on:click="{getLifeExpectancy}">
    function create_default_slot_3$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(326:8) <Button color=\\\"success\\\" on:click=\\\"{getLifeExpectancy}\\\">",
    		ctx
    	});

    	return block;
    }

    // (329:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(329:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (332:8) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(332:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (335:8) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(335:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (277:36)               Loading life stats data...          {:then LifeExpectancyStats}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading life stats data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(277:36)               Loading life stats data...          {:then LifeExpectancyStats}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*LifeExpectancyStats*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Tabla de datos de Esperanza de vida";
    			t1 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$5, 274, 8, 9960);
    			add_location(main, file$5, 272, 0, 9942);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*LifeExpectancyStats*/ 16 && promise !== (promise = /*LifeExpectancyStats*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LifeExpectancy", slots, []);
    	let LifeExpectancyStats = [];

    	let newLife = {
    		country: "",
    		province: "",
    		year: "",
    		lifeExpectancyWoman: "",
    		lifeExpectancyMan: "",
    		averageLifeExpectancy: ""
    	};

    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 3; // Número total de los datos
    	onMount(getLife);

    	//Get initialData
    	async function getLifeExpectancy() {
    		console.log("Fetching life data...");
    		await fetch("/api/v1/life-expectancy-stats/loadInitialData");
    		const res = await fetch("/api/v1/life-expectancy-stats");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, LifeExpectancyStats = json);
    			totaldata = 3;
    			console.log("Received " + LifeExpectancyStats.length + " life data.");
    			$$invalidate(3, color = "success");
    			$$invalidate(1, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(3, color = "danger");
    			$$invalidate(1, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Get
    	async function getLife() {
    		console.log("Fetching resources...");
    		const res = await fetch("/api/v1/life-expectancy-stats");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, LifeExpectancyStats = json);
    			console.log("Received " + LifeExpectancyStats.length + " Life Data.");
    		} else {
    			$$invalidate(1, checkMSG = res.status + ": Recursos no encontrados ");
    			console.log("ERROR! no encontrado");
    		}
    	}

    	//Insert
    	async function insertLife() {
    		console.log("Inserting resources...");

    		if (newLife.country == "" || newLife.province == "" || newLife.year == null) {
    			alert("Los campos 'País' 'Comunidad Autonoma'y 'Año' no pueden estar vacios");
    		} else {
    			await fetch("/api/v1/life-expectancy-stats", {
    				method: "POST",
    				body: JSON.stringify(newLife),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.status == 201) {
    					getLife();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Ya existe una entrada en la base de datos con la provincia y el año introducido");
    				}
    			});
    		}
    	}

    	//EDIT
    	async function editLife(province, year) {
    		//Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
    		if (newLife.province == "" || newLife.year == null) {
    			alert("Los campos 'Comunidad Autonoma'y 'Año' no pueden estar vacios");
    		} else if (province != newLife.province || year != newLife.year) {
    			alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden ser distintos");
    		} else {
    			console.log("Editing resources...");

    			await fetch("/api/v1/life-expectancy-stats/" + province + "/" + year, {
    				method: "PUT",
    				body: JSON.stringify(newLife),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.status == 200) {
    					console.log("Data updated");
    					getLife();
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Entrada modificada correctamente en la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Ya existe una entrada en la base de datos con los datos introducidos");
    				}
    			});
    		}
    	}

    	//Delete
    	async function deleteLife(province, year) {
    		await fetch("/api/v1/life-expectancy-stats/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			$$invalidate(2, visible = true);
    			getLife();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(3, color = "success");
    				$$invalidate(1, checkMSG = "Recurso " + province + " " + year + " borrado correctamente");
    				console.log("Deleted " + province);
    			} else if (res.status == 404) {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = "No se ha encontrado el objeto " + province);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = res.status + ": " + res.statusText);
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL
    	async function deleteALL() {
    		console.log("Deleting life stats data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all life stats data...");

    			await fetch("/api/v1/life-expectancy-stats/", { method: "DELETE" }).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getLife();
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//SEARCH
    	//getNextPage
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 5 > totaldata) {
    			page = 1;
    		} else {
    			page += 5;
    		}

    		$$invalidate(2, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/life-expectancy-stats?limit=5&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(3, color = "success");

    		$$invalidate(1, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(3, color = "danger");
    			$$invalidate(1, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			SmokerStats = json;
    			console.log("Received " + LifeExpectancyStats.length + " resources.");
    		} else {
    			$$invalidate(1, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 5 > 1) {
    			page -= 5;
    		} else page = 1;

    		$$invalidate(2, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/life-expectancy-stats?limit=5&offset=" + (-1 + page));
    		$$invalidate(3, color = "success");

    		errorMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4);

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(3, color = "danger");
    			errorMSG = "¡No hay datos!";
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			SmokerStats = json;
    			console.log("Received " + LifeExpectancyStats.length + " resources.");
    		} else {
    			errorMSG = res.status + ": " + res.statusText;
    			console.log("ERROR!");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<LifeExpectancy> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visible = false);

    	function input0_input_handler() {
    		newLife.country = this.value;
    		$$invalidate(0, newLife);
    	}

    	function input1_input_handler() {
    		newLife.province = this.value;
    		$$invalidate(0, newLife);
    	}

    	function input2_input_handler() {
    		newLife.year = this.value;
    		$$invalidate(0, newLife);
    	}

    	function input3_input_handler() {
    		newLife.lifeExpectancyWoman = to_number(this.value);
    		$$invalidate(0, newLife);
    	}

    	function input4_input_handler() {
    		newLife.lifeExpectancyMan = to_number(this.value);
    		$$invalidate(0, newLife);
    	}

    	function input5_input_handler() {
    		newLife.averageLifeExpectancy = to_number(this.value);
    		$$invalidate(0, newLife);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		LifeExpectancyStats,
    		newLife,
    		checkMSG,
    		visible,
    		color,
    		page,
    		totaldata,
    		getLifeExpectancy,
    		getLife,
    		insertLife,
    		editLife,
    		deleteLife,
    		deleteALL,
    		getNextPage,
    		getPreviewPage
    	});

    	$$self.$inject_state = $$props => {
    		if ("LifeExpectancyStats" in $$props) $$invalidate(4, LifeExpectancyStats = $$props.LifeExpectancyStats);
    		if ("newLife" in $$props) $$invalidate(0, newLife = $$props.newLife);
    		if ("checkMSG" in $$props) $$invalidate(1, checkMSG = $$props.checkMSG);
    		if ("visible" in $$props) $$invalidate(2, visible = $$props.visible);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("page" in $$props) page = $$props.page;
    		if ("totaldata" in $$props) totaldata = $$props.totaldata;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newLife,
    		checkMSG,
    		visible,
    		color,
    		LifeExpectancyStats,
    		getLifeExpectancy,
    		insertLife,
    		editLife,
    		deleteLife,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class LifeExpectancy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LifeExpectancy",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\TablaAlcohol.svelte generated by Svelte v3.38.1 */

    const { console: console_1$3 } = globals;
    const file$4 = "src\\front\\TablaAlcohol.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>        import{          onMount      }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>        import{          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (259:4) {:then alcoholStats}
    function create_then_block$2(ctx) {
    	let alert_1;
    	let t0;
    	let table;
    	let t1;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[1],
    				isOpen: /*visible*/ ctx[0],
    				toggle: /*func*/ ctx[12],
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[5]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteALL*/ ctx[8]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*getPreviewPage*/ ctx[11]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*getNextPage*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table.$$.fragment);
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			create_component(button3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(button3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty & /*color*/ 2) alert_1_changes.color = /*color*/ ctx[1];
    			if (dirty & /*visible*/ 1) alert_1_changes.isOpen = /*visible*/ ctx[0];
    			if (dirty & /*visible*/ 1) alert_1_changes.toggle = /*func*/ ctx[12];

    			if (dirty & /*$$scope, errorMSG*/ 33554436) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table_changes = {};

    			if (dirty & /*$$scope, alcoholStats, newAlcohol*/ 33554456) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(button3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(259:4) {:then alcoholStats}",
    		ctx
    	});

    	return block;
    }

    // (262:8) {#if errorMSG}
    function create_if_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMSG*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMSG*/ 4) set_data_dev(t, /*errorMSG*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(262:8) {#if errorMSG}",
    		ctx
    	});

    	return block;
    }

    // (261:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_8$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMSG*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMSG*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(261:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (285:64) <Button outline color="primary" on:click={insertAlcohol}>
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(285:64) <Button outline color=\\\"primary\\\" on:click={insertAlcohol}>",
    		ctx
    	});

    	return block;
    }

    // (295:28) <Button outline color="danger" on:click="{deleteSpecificAlcohol(stat.country, stat.ageRange,stat.year)}">
    function create_default_slot_6$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(295:28) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteSpecificAlcohol(stat.country, stat.ageRange,stat.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (296:28) <Button outline color="primary" on:click="{updateAlcohol(stat.country,stat.year,stat.ageRange)}">
    function create_default_slot_5$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(296:28) <Button outline color=\\\"primary\\\" on:click=\\\"{updateAlcohol(stat.country,stat.year,stat.ageRange)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (288:16) {#each alcoholStats as stat}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*stat*/ ctx[22].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*stat*/ ctx[22].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*stat*/ ctx[22].ageRange + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*stat*/ ctx[22].alcoholPrematureDeath + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*stat*/ ctx[22].prevalenceOfAlcoholUseDisorder + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*deleteSpecificAlcohol*/ ctx[9](/*stat*/ ctx[22].country, /*stat*/ ctx[22].ageRange, /*stat*/ ctx[22].year))) /*deleteSpecificAlcohol*/ ctx[9](/*stat*/ ctx[22].country, /*stat*/ ctx[22].ageRange, /*stat*/ ctx[22].year).apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*updateAlcohol*/ ctx[6](/*stat*/ ctx[22].country, /*stat*/ ctx[22].year, /*stat*/ ctx[22].ageRange))) /*updateAlcohol*/ ctx[6](/*stat*/ ctx[22].country, /*stat*/ ctx[22].year, /*stat*/ ctx[22].ageRange).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			attr_dev(a, "href", a_href_value = "#/alcohol-stats/" + /*stat*/ ctx[22].country + "/" + /*stat*/ ctx[22].year + "/" + /*stat*/ ctx[22].ageRange);
    			add_location(a, file$4, 289, 28, 11677);
    			add_location(td0, file$4, 289, 24, 11673);
    			add_location(td1, file$4, 290, 24, 11795);
    			add_location(td2, file$4, 291, 24, 11841);
    			add_location(td3, file$4, 292, 24, 11891);
    			add_location(td4, file$4, 293, 24, 11954);
    			add_location(td5, file$4, 294, 24, 12026);
    			add_location(td6, file$4, 295, 24, 12181);
    			add_location(tr, file$4, 288, 20, 11643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*alcoholStats*/ 16) && t0_value !== (t0_value = /*stat*/ ctx[22].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*alcoholStats*/ 16 && a_href_value !== (a_href_value = "#/alcohol-stats/" + /*stat*/ ctx[22].country + "/" + /*stat*/ ctx[22].year + "/" + /*stat*/ ctx[22].ageRange)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*alcoholStats*/ 16) && t2_value !== (t2_value = /*stat*/ ctx[22].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*alcoholStats*/ 16) && t4_value !== (t4_value = /*stat*/ ctx[22].ageRange + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*alcoholStats*/ 16) && t6_value !== (t6_value = /*stat*/ ctx[22].alcoholPrematureDeath + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*alcoholStats*/ 16) && t8_value !== (t8_value = /*stat*/ ctx[22].prevalenceOfAlcoholUseDisorder + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(288:16) {#each alcoholStats as stat}",
    		ctx
    	});

    	return block;
    }

    // (267:8) <Table bordered responsive>
    function create_default_slot_4$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertAlcohol*/ ctx[7]);
    	let each_value = /*alcoholStats*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Rango de edad";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Muertes prematuras a causa del alcohol";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Prevalencia de trastornos por consumo de alcohol";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$4, 269, 20, 10442);
    			add_location(th1, file$4, 270, 20, 10477);
    			add_location(th2, file$4, 271, 20, 10511);
    			add_location(th3, file$4, 272, 20, 10556);
    			add_location(th4, file$4, 273, 20, 10625);
    			attr_dev(th5, "colspan", "2");
    			add_location(th5, file$4, 274, 20, 10704);
    			add_location(tr0, file$4, 268, 16, 10416);
    			add_location(thead, file$4, 267, 12, 10391);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "España");
    			add_location(input0, file$4, 279, 24, 10847);
    			add_location(td0, file$4, 279, 20, 10843);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "2017");
    			add_location(input1, file$4, 280, 24, 10954);
    			add_location(td1, file$4, 280, 20, 10950);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "40-45");
    			add_location(input2, file$4, 281, 24, 11057);
    			add_location(td2, file$4, 281, 20, 11053);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "10");
    			add_location(input3, file$4, 282, 24, 11165);
    			add_location(td3, file$4, 282, 20, 11161);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "0.4");
    			add_location(input4, file$4, 283, 24, 11288);
    			add_location(td4, file$4, 283, 20, 11284);
    			attr_dev(td5, "colspan", "2");
    			set_style(td5, "text-align", "center");
    			add_location(td5, file$4, 284, 20, 11415);
    			add_location(tr1, file$4, 278, 16, 10817);
    			add_location(tbody, file$4, 277, 12, 10792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newAlcohol*/ ctx[3].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newAlcohol*/ ctx[3].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newAlcohol*/ ctx[3].ageRange);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newAlcohol*/ ctx[3].alcoholPrematureDeath);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newAlcohol*/ ctx[3].prevalenceOfAlcoholUseDisorder);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newAlcohol*/ 8 && input0.value !== /*newAlcohol*/ ctx[3].country) {
    				set_input_value(input0, /*newAlcohol*/ ctx[3].country);
    			}

    			if (dirty & /*newAlcohol*/ 8 && input1.value !== /*newAlcohol*/ ctx[3].year) {
    				set_input_value(input1, /*newAlcohol*/ ctx[3].year);
    			}

    			if (dirty & /*newAlcohol*/ 8 && input2.value !== /*newAlcohol*/ ctx[3].ageRange) {
    				set_input_value(input2, /*newAlcohol*/ ctx[3].ageRange);
    			}

    			if (dirty & /*newAlcohol*/ 8 && to_number(input3.value) !== /*newAlcohol*/ ctx[3].alcoholPrematureDeath) {
    				set_input_value(input3, /*newAlcohol*/ ctx[3].alcoholPrematureDeath);
    			}

    			if (dirty & /*newAlcohol*/ 8 && to_number(input4.value) !== /*newAlcohol*/ ctx[3].prevalenceOfAlcoholUseDisorder) {
    				set_input_value(input4, /*newAlcohol*/ ctx[3].prevalenceOfAlcoholUseDisorder);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*updateAlcohol, alcoholStats, deleteSpecificAlcohol*/ 592) {
    				each_value = /*alcoholStats*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(267:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (302:10) <Button color="success" on:click="{loadInitialData}">
    function create_default_slot_3$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(302:10) <Button color=\\\"success\\\" on:click=\\\"{loadInitialData}\\\">",
    		ctx
    	});

    	return block;
    }

    // (305:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(305:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (308:8) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(308:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (311:8) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(311:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (257:25)           Loading alcohol data...      {:then alcoholStats}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading alcohol data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(257:25)           Loading alcohol data...      {:then alcoholStats}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let br;
    	let t2;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*alcoholStats*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Datos sobre consumo de alcohol";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$4, 252, 4, 10014);
    			add_location(br, file$4, 253, 4, 10089);
    			add_location(main, file$4, 251, 0, 10002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, br);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*alcoholStats*/ 16 && promise !== (promise = /*alcoholStats*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TablaAlcohol", slots, []);
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 5; // Número total de los datos
    	let errorMSG = "";
    	var BASE_ALCOHOL_PATH = "/api/v1/alcohol-consumption-stats/";
    	let alcoholStats = [];

    	let newAlcohol = {
    		country: "",
    		year: "",
    		ageRange: "",
    		alcoholPrematureDeath: "",
    		prevalenceOfAlcoholUseDisorder: ""
    	};

    	//GET INITIALDATA
    	async function loadInitialData() {
    		console.log("Fetching employment data...");
    		await fetch("/api/v1/alcohol-consumption-stats/loadInitialData");
    		const res = await fetch("/api/v1/alcohol-consumption-stats?limit=3&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, alcoholStats = json);
    			totaldata = 13;
    			console.log("Received " + alcoholStats.length + " alcohol data.");
    			$$invalidate(1, color = "success");
    			$$invalidate(2, errorMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(1, color = "danger");
    			$$invalidate(2, errorMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Actualizarsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
    	async function updateAlcohol(country, year, ageRange) {
    		if (newAlcohol.year == "" || newAlcohol.year == null || newAlcohol.country == "" || newAlcohol.ageRange == "") {
    			alert("Los campos País, Año y Rango de edad no pueden estar vacíos");
    		} else if (country != newAlcohol.country || year != newAlcohol.year || ageRange != newAlcohol.ageRange) {
    			alert("Los campos País, Año y Rango de edad no pueden ser distintos");
    		} else {
    			console.log("Editing alcohol data...");

    			await fetch(BASE_ALCOHOL_PATH + country + "/" + year + "/" + ageRange, {
    				method: "PUT",
    				body: JSON.stringify(newAlcohol),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.status == 200) {
    					console.log("Data updated");
    					getStats();
    					$$invalidate(1, color = "success");
    					checkMSG = "Entrada modificada correctamente en la base de datos";
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(1, color = "danger");
    					checkMSG = "Los datos de la entrada no fueron introducidos correctamente";
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(1, color = "danger");
    					checkMSG = "Ya existe una entrada en la base de datos con los datos introducidos";
    				}
    			});
    		}
    	}

    	//INSERT
    	async function insertAlcohol() {
    		console.log("Inserting alcohol data...");

    		if (newAlcohol.year == "" || newAlcohol.year == null || newAlcohol.country == "" || newAlcohol.ageRange == "") {
    			alert("Los campos 'País' y 'Año' no pueden estar vacios");
    		} else {
    			await fetch("/api/v1/alcohol-consumption-stats", {
    				method: "POST",
    				body: JSON.stringify(newAlcohol),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.status == 201) {
    					getStats();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(1, color = "success");
    					$$invalidate(2, errorMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(1, color = "danger");
    					$$invalidate(2, errorMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(1, color = "danger");
    					$$invalidate(2, errorMSG = "Ya existe una entrada en la base de datos con el país, el año y el rango de edad");
    				}
    			});
    		}
    	}

    	//Mostrar datos
    	async function getStats() {
    		console.log("Fetching stats...");
    		const res = await fetch(BASE_ALCOHOL_PATH);

    		if (res.ok) {
    			console.log("ok");
    			const json = await res.json();
    			$$invalidate(4, alcoholStats = json);
    			updateAgeRange = alcoholStats.ageRange;
    			updatePrematureDeath = alcoholStats.alcoholPrematureDeath;
    			updateDisorder = alcoholStats.prevalenceOfAlcoholUseDisorder;
    			console.log(`We have received ${alcoholStats.length} alcohol stats`);
    		} else {
    			console.log("Error");
    		}
    	}

    	//Borrar datos
    	async function deleteALL() {
    		console.log("Deleting weights data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all weights data...");

    			await fetch(BASE_ALCOHOL_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getStats();
    					$$invalidate(1, color = "success");
    					$$invalidate(2, errorMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(2, errorMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(2, errorMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//Borrar dato especifico
    	async function deleteSpecificAlcohol(country, ageRange, year) {
    		await fetch(BASE_ALCOHOL_PATH + country + "/" + year + "/" + ageRange, { method: "DELETE" }).then(function (res) {
    			$$invalidate(0, visible = true);
    			getStats();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(1, color = "success");
    				$$invalidate(2, errorMSG = "Recurso " + province + " " + year + +" " + ageRange + " borrado correctamente");
    				console.log("Deleted " + country);
    			} else if (res.status == 404) {
    				$$invalidate(1, color = "danger");
    				$$invalidate(2, errorMSG = "No se ha encontrado el objeto" + country);
    				console.log("STAT NOT FOUND");
    			} else {
    				$$invalidate(1, color = "danger");
    				$$invalidate(2, errorMSG = res.status + ": " + res.statusText);
    				console.log("ERROR!");
    			}
    		});
    	}

    	//sigueinte pagina
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 5 > totaldata) {
    			page = 1;
    		} else {
    			page += 5;
    		}

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/alcohol-consumption-stats?limit=3&offset=" + (-1 + page));
    		$$invalidate(1, color = "success");

    		$$invalidate(2, errorMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(2, errorMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			SmokerStats = json;
    			console.log("Received " + alcoholStats.length + " resources.");
    		} else {
    			$$invalidate(2, errorMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 5 > 1) {
    			page -= 5;
    		} else page = 1;

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/alcohol-consumption-stats?limit=5&offset=" + (-1 + page));
    		$$invalidate(1, color = "success");

    		$$invalidate(2, errorMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(2, errorMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			SmokerStats = json;
    			console.log("Received " + alcoholStats.length + " resources.");
    		} else {
    			$$invalidate(2, errorMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<TablaAlcohol> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, visible = false);

    	function input0_input_handler() {
    		newAlcohol.country = this.value;
    		$$invalidate(3, newAlcohol);
    	}

    	function input1_input_handler() {
    		newAlcohol.year = this.value;
    		$$invalidate(3, newAlcohol);
    	}

    	function input2_input_handler() {
    		newAlcohol.ageRange = this.value;
    		$$invalidate(3, newAlcohol);
    	}

    	function input3_input_handler() {
    		newAlcohol.alcoholPrematureDeath = to_number(this.value);
    		$$invalidate(3, newAlcohol);
    	}

    	function input4_input_handler() {
    		newAlcohol.prevalenceOfAlcoholUseDisorder = to_number(this.value);
    		$$invalidate(3, newAlcohol);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		visible,
    		color,
    		page,
    		totaldata,
    		errorMSG,
    		BASE_ALCOHOL_PATH,
    		alcoholStats,
    		newAlcohol,
    		loadInitialData,
    		updateAlcohol,
    		insertAlcohol,
    		getStats,
    		deleteALL,
    		deleteSpecificAlcohol,
    		getNextPage,
    		getPreviewPage
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("page" in $$props) page = $$props.page;
    		if ("totaldata" in $$props) totaldata = $$props.totaldata;
    		if ("errorMSG" in $$props) $$invalidate(2, errorMSG = $$props.errorMSG);
    		if ("BASE_ALCOHOL_PATH" in $$props) BASE_ALCOHOL_PATH = $$props.BASE_ALCOHOL_PATH;
    		if ("alcoholStats" in $$props) $$invalidate(4, alcoholStats = $$props.alcoholStats);
    		if ("newAlcohol" in $$props) $$invalidate(3, newAlcohol = $$props.newAlcohol);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		color,
    		errorMSG,
    		newAlcohol,
    		alcoholStats,
    		loadInitialData,
    		updateAlcohol,
    		insertAlcohol,
    		deleteALL,
    		deleteSpecificAlcohol,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class TablaAlcohol extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TablaAlcohol",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\front\Smokers.svelte generated by Svelte v3.38.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\front\\Smokers.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (260:4) {:then SmokerStats}
    function create_then_block$1(ctx) {
    	let alert_1;
    	let t0;
    	let table;
    	let t1;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[1],
    				isOpen: /*visible*/ ctx[0],
    				toggle: /*func*/ ctx[12],
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadInitialData*/ ctx[5]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteALL*/ ctx[9]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*getPreviewPage*/ ctx[11]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*getNextPage*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table.$$.fragment);
    			t1 = space();
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			create_component(button3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(button3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty & /*color*/ 2) alert_1_changes.color = /*color*/ ctx[1];
    			if (dirty & /*visible*/ 1) alert_1_changes.isOpen = /*visible*/ ctx[0];
    			if (dirty & /*visible*/ 1) alert_1_changes.toggle = /*func*/ ctx[12];

    			if (dirty & /*$$scope, checkMSG*/ 33554440) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table_changes = {};

    			if (dirty & /*$$scope, SmokerStats, newSmoker*/ 33554452) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(button3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(260:4) {:then SmokerStats}",
    		ctx
    	});

    	return block;
    }

    // (263:8) {#if checkMSG}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 8) set_data_dev(t, /*checkMSG*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(263:8) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (262:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_8$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(262:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (288:64) <Button outline color="primary" on:click={insertSmokers}>
    function create_default_slot_7$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(288:64) <Button outline color=\\\"primary\\\" on:click={insertSmokers}>",
    		ctx
    	});

    	return block;
    }

    // (299:28) <Button outline color="danger" on:click="{deleteSmokers(sc.province, sc.year)}">
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(299:28) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteSmokers(sc.province, sc.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (300:28) <Button outline color="primary" on:click="{editSmokers(sc.province, sc.year)}">
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(300:28) <Button outline color=\\\"primary\\\" on:click=\\\"{editSmokers(sc.province, sc.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (291:16) {#each SmokerStats as sc}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*sc*/ ctx[22].province + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*sc*/ ctx[22].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*sc*/ ctx[22].dailySmoker + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*sc*/ ctx[22].ocasionalSmoker + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*sc*/ ctx[22].exSmoker + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*sc*/ ctx[22].nonSmoker + "";
    	let t10;
    	let t11;
    	let td6;
    	let button0;
    	let t12;
    	let td7;
    	let button1;
    	let t13;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*deleteSmokers*/ ctx[8](/*sc*/ ctx[22].province, /*sc*/ ctx[22].year))) /*deleteSmokers*/ ctx[8](/*sc*/ ctx[22].province, /*sc*/ ctx[22].year).apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*editSmokers*/ ctx[7](/*sc*/ ctx[22].province, /*sc*/ ctx[22].year))) /*editSmokers*/ ctx[7](/*sc*/ ctx[22].province, /*sc*/ ctx[22].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			create_component(button0.$$.fragment);
    			t12 = space();
    			td7 = element("td");
    			create_component(button1.$$.fragment);
    			t13 = space();
    			attr_dev(a, "href", a_href_value = "api/v1/smokers-stats/" + /*sc*/ ctx[22].province + "/" + /*sc*/ ctx[22].year);
    			add_location(a, file$3, 292, 28, 11181);
    			add_location(td0, file$3, 292, 24, 11177);
    			add_location(td1, file$3, 293, 24, 11284);
    			add_location(td2, file$3, 294, 24, 11328);
    			add_location(td3, file$3, 295, 24, 11379);
    			add_location(td4, file$3, 296, 24, 11434);
    			add_location(td5, file$3, 297, 24, 11482);
    			add_location(td6, file$3, 298, 24, 11531);
    			add_location(td7, file$3, 299, 24, 11661);
    			add_location(tr, file$3, 291, 20, 11147);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			mount_component(button0, td6, null);
    			append_dev(tr, t12);
    			append_dev(tr, td7);
    			mount_component(button1, td7, null);
    			append_dev(tr, t13);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*SmokerStats*/ 16) && t0_value !== (t0_value = /*sc*/ ctx[22].province + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*SmokerStats*/ 16 && a_href_value !== (a_href_value = "api/v1/smokers-stats/" + /*sc*/ ctx[22].province + "/" + /*sc*/ ctx[22].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*SmokerStats*/ 16) && t2_value !== (t2_value = /*sc*/ ctx[22].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*SmokerStats*/ 16) && t4_value !== (t4_value = /*sc*/ ctx[22].dailySmoker + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*SmokerStats*/ 16) && t6_value !== (t6_value = /*sc*/ ctx[22].ocasionalSmoker + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*SmokerStats*/ 16) && t8_value !== (t8_value = /*sc*/ ctx[22].exSmoker + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*SmokerStats*/ 16) && t10_value !== (t10_value = /*sc*/ ctx[22].nonSmoker + "")) set_data_dev(t10, t10_value);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(291:16) {#each SmokerStats as sc}",
    		ctx
    	});

    	return block;
    }

    // (268:8) <Table bordered responsive>
    function create_default_slot_4$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let input5;
    	let t19;
    	let td6;
    	let button;
    	let t20;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertSmokers*/ ctx[6]);
    	let each_value = /*SmokerStats*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad Autónoma";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Fumadores diarios";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Fumadores ocasionales";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Ex-fumadores";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "No fumadores";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			input5 = element("input");
    			t19 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			t20 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$3, 270, 20, 9856);
    			add_location(th1, file$3, 271, 20, 9905);
    			add_location(th2, file$3, 272, 20, 9939);
    			add_location(th3, file$3, 273, 20, 9987);
    			add_location(th4, file$3, 274, 20, 10039);
    			add_location(th5, file$3, 275, 20, 10082);
    			attr_dev(th6, "colspan", "2");
    			add_location(th6, file$3, 276, 20, 10125);
    			set_style(tr0, "text-align", "center");
    			add_location(tr0, file$3, 269, 16, 9801);
    			add_location(thead, file$3, 268, 12, 9776);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Babylon");
    			add_location(input0, file$3, 281, 24, 10268);
    			add_location(td0, file$3, 281, 20, 10264);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "2075");
    			add_location(input1, file$3, 282, 24, 10376);
    			add_location(td1, file$3, 282, 20, 10372);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "0000");
    			add_location(input2, file$3, 283, 24, 10479);
    			add_location(td2, file$3, 283, 20, 10475);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "0000");
    			add_location(input3, file$3, 284, 24, 10590);
    			add_location(td3, file$3, 284, 20, 10586);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "0000");
    			add_location(input4, file$3, 285, 24, 10708);
    			add_location(td4, file$3, 285, 20, 10704);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "placeholder", "0000");
    			add_location(input5, file$3, 286, 24, 10817);
    			add_location(td5, file$3, 286, 20, 10813);
    			attr_dev(td6, "colspan", "2");
    			set_style(td6, "text-align", "center");
    			add_location(td6, file$3, 287, 20, 10923);
    			add_location(tr1, file$3, 280, 16, 10238);
    			add_location(tbody, file$3, 279, 12, 10213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newSmoker*/ ctx[2].province);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newSmoker*/ ctx[2].year);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newSmoker*/ ctx[2].dailySmoker);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newSmoker*/ ctx[2].ocasionalSmoker);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newSmoker*/ ctx[2].exSmoker);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			append_dev(td5, input5);
    			set_input_value(input5, /*newSmoker*/ ctx[2].nonSmoker);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button, td6, null);
    			append_dev(tbody, t20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[17]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newSmoker*/ 4 && input0.value !== /*newSmoker*/ ctx[2].province) {
    				set_input_value(input0, /*newSmoker*/ ctx[2].province);
    			}

    			if (dirty & /*newSmoker*/ 4 && to_number(input1.value) !== /*newSmoker*/ ctx[2].year) {
    				set_input_value(input1, /*newSmoker*/ ctx[2].year);
    			}

    			if (dirty & /*newSmoker*/ 4 && to_number(input2.value) !== /*newSmoker*/ ctx[2].dailySmoker) {
    				set_input_value(input2, /*newSmoker*/ ctx[2].dailySmoker);
    			}

    			if (dirty & /*newSmoker*/ 4 && to_number(input3.value) !== /*newSmoker*/ ctx[2].ocasionalSmoker) {
    				set_input_value(input3, /*newSmoker*/ ctx[2].ocasionalSmoker);
    			}

    			if (dirty & /*newSmoker*/ 4 && to_number(input4.value) !== /*newSmoker*/ ctx[2].exSmoker) {
    				set_input_value(input4, /*newSmoker*/ ctx[2].exSmoker);
    			}

    			if (dirty & /*newSmoker*/ 4 && to_number(input5.value) !== /*newSmoker*/ ctx[2].nonSmoker) {
    				set_input_value(input5, /*newSmoker*/ ctx[2].nonSmoker);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*editSmokers, SmokerStats, deleteSmokers*/ 400) {
    				each_value = /*SmokerStats*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(268:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (305:10) <Button color="success" on:click="{loadInitialData}">
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(305:10) <Button color=\\\"success\\\" on:click=\\\"{loadInitialData}\\\">",
    		ctx
    	});

    	return block;
    }

    // (308:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(308:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (311:8) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(311:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (314:8) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(314:8) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (258:24)           Loading smokers data...      {:then SmokerStats}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading smokers data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(258:24)           Loading smokers data...      {:then SmokerStats}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*SmokerStats*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Administración de datos de fumadores";
    			t1 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$3, 255, 4, 9412);
    			add_location(main, file$3, 254, 0, 9400);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*SmokerStats*/ 16 && promise !== (promise = /*SmokerStats*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Smokers", slots, []);
    	let visible = false;
    	let color = "danger";

    	//Variables
    	let page = 1;

    	let totaldata = 13;
    	let SmokerStats = [];

    	let newSmoker = {
    		country: "España",
    		province: "",
    		year: "",
    		dailySmoker: "",
    		ocasionalSmoker: "",
    		exSmoker: "",
    		nonSmoker: ""
    	};

    	let checkMSG = "";
    	onMount(getSmoker);

    	//GET
    	async function getSmoker() {
    		console.log("Fetching smokers Data...");
    		const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, SmokerStats = json);
    			console.log("Received " + SmokerStats.length + " Smokers Data.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//GET INITIALDATA
    	async function loadInitialData() {
    		console.log("Fetching smokers data...");
    		await fetch("/api/v1/smokers-stats/loadInitialData");
    		const res = await fetch("/api/v1/smokers-stats?limit=5&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, SmokerStats = json);
    			totaldata = 13;
    			console.log("Received " + SmokerStats.length + " Smokers data.");
    			$$invalidate(1, color = "success");
    			$$invalidate(3, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//INSERT  
    	async function insertSmokers() {
    		console.log("Inserting smokers data...");

    		//Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
    		if (newSmoker.year == "" || newSmoker.year == null || newSmoker.province == "") {
    			alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacios");
    		} else {
    			await fetch("/api/v1/smokers-stats", {
    				method: "POST",
    				body: JSON.stringify(newSmoker),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.status == 201) {
    					getSmoker();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(1, color = "success");
    					$$invalidate(3, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Ya existe una entrada en la base de datos con la provincia y el año introducido");
    				}
    			});
    		}
    	}

    	//EDIT
    	async function editSmokers(province, year) {
    		//Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
    		if (newSmoker.year == "" || newSmoker.year == null || newSmoker.province == "") {
    			alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacíos");
    		} else if (province != newSmoker.province || year != newSmoker.year) {
    			alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden ser distintos");
    		} else {
    			console.log("Editing smokers data...");

    			await fetch("/api/v1/smokers-stats/" + province + "/" + year, {
    				method: "PUT",
    				body: JSON.stringify(newSmoker),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.status == 200) {
    					console.log("Data updated");
    					getSmoker();
    					$$invalidate(1, color = "success");
    					$$invalidate(3, checkMSG = "Entrada modificada correctamente en la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Ya existe una entrada en la base de datos con los datos introducidos");
    				}
    			});
    		}
    	}

    	//DELETE SPECIFIC
    	async function deleteSmokers(province, year) {
    		await fetch("/api/v1/smokers-stats/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			$$invalidate(0, visible = true);
    			getSmoker();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(1, color = "success");
    				$$invalidate(3, checkMSG = "Recurso " + province + " " + year + " borrado correctamente");
    				console.log("Deleted " + province);
    			} else if (res.status == 404) {
    				$$invalidate(1, color = "danger");
    				$$invalidate(3, checkMSG = "No se ha encontrado el objeto " + province);
    				console.log("SUICIDE NOT FOUND");
    			} else {
    				$$invalidate(1, color = "danger");
    				$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL
    	async function deleteALL() {
    		console.log("Deleting smokers data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all smokers data...");

    			await fetch("/api/v1/smokers-stats/", { method: "DELETE" }).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getSmoker();
    					$$invalidate(1, color = "success");
    					$$invalidate(3, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//SEARCH
    	//getNextPage
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 5 > totaldata) {
    			page = 1;
    		} else {
    			page += 5;
    		}

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/smokers-stats?limit=5&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(1, color = "success");

    		$$invalidate(3, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, SmokerStats = json);
    			console.log("Received " + SmokerStats.length + " resources.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 5 > 1) {
    			page -= 5;
    		} else page = 1;

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch("/api/v1/smokers-stats?limit=5&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(1, color = "success");

    		$$invalidate(3, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(4, SmokerStats = json);
    			console.log("Received " + SmokerStats.length + " resources.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Smokers> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, visible = false);

    	function input0_input_handler() {
    		newSmoker.province = this.value;
    		$$invalidate(2, newSmoker);
    	}

    	function input1_input_handler() {
    		newSmoker.year = to_number(this.value);
    		$$invalidate(2, newSmoker);
    	}

    	function input2_input_handler() {
    		newSmoker.dailySmoker = to_number(this.value);
    		$$invalidate(2, newSmoker);
    	}

    	function input3_input_handler() {
    		newSmoker.ocasionalSmoker = to_number(this.value);
    		$$invalidate(2, newSmoker);
    	}

    	function input4_input_handler() {
    		newSmoker.exSmoker = to_number(this.value);
    		$$invalidate(2, newSmoker);
    	}

    	function input5_input_handler() {
    		newSmoker.nonSmoker = to_number(this.value);
    		$$invalidate(2, newSmoker);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		visible,
    		color,
    		page,
    		totaldata,
    		SmokerStats,
    		newSmoker,
    		checkMSG,
    		getSmoker,
    		loadInitialData,
    		insertSmokers,
    		editSmokers,
    		deleteSmokers,
    		deleteALL,
    		getNextPage,
    		getPreviewPage
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("page" in $$props) page = $$props.page;
    		if ("totaldata" in $$props) totaldata = $$props.totaldata;
    		if ("SmokerStats" in $$props) $$invalidate(4, SmokerStats = $$props.SmokerStats);
    		if ("newSmoker" in $$props) $$invalidate(2, newSmoker = $$props.newSmoker);
    		if ("checkMSG" in $$props) $$invalidate(3, checkMSG = $$props.checkMSG);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		color,
    		newSmoker,
    		checkMSG,
    		SmokerStats,
    		loadInitialData,
    		insertSmokers,
    		editSmokers,
    		deleteSmokers,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class Smokers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Smokers",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\weightsStats\TablaWeights.svelte generated by Svelte v3.38.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\front\\weightsStats\\TablaWeights.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (243:4) {:then weightStats}
    function create_then_block(ctx) {
    	let alert_1;
    	let t0;
    	let table0;
    	let t1;
    	let p;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let h4;
    	let strong;
    	let t6;
    	let table1;
    	let t7;
    	let div;
    	let button3;
    	let t8;
    	let button4;
    	let t9;
    	let button5;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[1],
    				isOpen: /*visible*/ ctx[0],
    				toggle: /*func*/ ctx[17],
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getPreviewPage*/ ctx[16]);

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getNextPage*/ ctx[15]);

    	button2 = new Button({
    			props: {
    				color: "warning",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*getPreviewPage*/ ctx[16]);

    	table1 = new Table({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", function () {
    		if (is_function(/*busqueda*/ ctx[14](/*sProvince*/ ctx[4], /*sYear*/ ctx[5], /*sNormalWeight*/ ctx[6], /*sOverWeight*/ ctx[7], /*sObesity*/ ctx[8]))) /*busqueda*/ ctx[14](/*sProvince*/ ctx[4], /*sYear*/ ctx[5], /*sNormalWeight*/ ctx[6], /*sOverWeight*/ ctx[7], /*sObesity*/ ctx[8]).apply(this, arguments);
    	});

    	button4 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", /*loadInitialData*/ ctx[10]);

    	button5 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button5.$on("click", /*deleteALL*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			p = element("p");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			h4 = element("h4");
    			strong = element("strong");
    			strong.textContent = "Búsqueda general de parámetros";
    			t6 = space();
    			create_component(table1.$$.fragment);
    			t7 = space();
    			div = element("div");
    			create_component(button3.$$.fragment);
    			t8 = space();
    			create_component(button4.$$.fragment);
    			t9 = space();
    			create_component(button5.$$.fragment);
    			attr_dev(p, "align", "center");
    			add_location(p, file$2, 286, 4, 10874);
    			add_location(strong, file$2, 292, 34, 11195);
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$2, 292, 4, 11165);
    			set_style(div, "text-align", "center");
    			add_location(div, file$2, 309, 4, 12030);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			mount_component(button0, p, null);
    			append_dev(p, t2);
    			mount_component(button1, p, null);
    			append_dev(p, t3);
    			mount_component(button2, p, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, strong);
    			insert_dev(target, t6, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button3, div, null);
    			insert_dev(target, t8, anchor);
    			mount_component(button4, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(button5, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 2) alert_1_changes.color = /*color*/ ctx[1];
    			if (dirty[0] & /*visible*/ 1) alert_1_changes.isOpen = /*visible*/ ctx[0];
    			if (dirty[0] & /*visible*/ 1) alert_1_changes.toggle = /*func*/ ctx[17];

    			if (dirty[0] & /*checkMSG*/ 8 | dirty[1] & /*$$scope*/ 64) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*weightStats, newWeight*/ 516 | dirty[1] & /*$$scope*/ 64) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*sObesity, sOverWeight, sNormalWeight, sYear, sProvince*/ 496 | dirty[1] & /*$$scope*/ 64) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			const button5_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t6);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div);
    			destroy_component(button3);
    			if (detaching) detach_dev(t8);
    			destroy_component(button4, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(button5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(243:4) {:then weightStats}",
    		ctx
    	});

    	return block;
    }

    // (246:8) {#if checkMSG}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 8) set_data_dev(t, /*checkMSG*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(246:8) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (245:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_11$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(245:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (269:20) <Button outline color="success" on:click={insertWeight}>
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(269:20) <Button outline color=\\\"success\\\" on:click={insertWeight}>",
    		ctx
    	});

    	return block;
    }

    // (279:93) <Button outline color="primary">
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(279:93) <Button outline color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (280:24) <Button outline color="danger" on:click="{deleteWeights(weightsStat.provinces, weightsStat.year)}">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(280:24) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteWeights(weightsStat.provinces, weightsStat.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (271:12) {#each weightStats as weightsStat}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let b;
    	let t0_value = /*weightsStat*/ ctx[34].provinces + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*weightsStat*/ ctx[34].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*weightsStat*/ ctx[34].normal_weight + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*weightsStat*/ ctx[34].overweight + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*weightsStat*/ ctx[34].obesity + "";
    	let t8;
    	let t9;
    	let td5;
    	let a;
    	let button0;
    	let a_href_value;
    	let t10;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteWeights*/ ctx[12](/*weightsStat*/ ctx[34].provinces, /*weightsStat*/ ctx[34].year))) /*deleteWeights*/ ctx[12](/*weightsStat*/ ctx[34].provinces, /*weightsStat*/ ctx[34].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			t11 = space();
    			add_location(b, file$2, 272, 64, 10202);
    			set_style(td0, "background-color", "lightskyblue");
    			add_location(td0, file$2, 272, 20, 10158);
    			add_location(td1, file$2, 273, 20, 10259);
    			add_location(td2, file$2, 274, 20, 10308);
    			add_location(td3, file$2, 275, 20, 10366);
    			add_location(td4, file$2, 276, 20, 10421);
    			attr_dev(a, "href", a_href_value = "#/weights-stats/" + /*weightsStat*/ ctx[34].provinces + "/" + /*weightsStat*/ ctx[34].year);
    			add_location(a, file$2, 278, 24, 10503);
    			add_location(td5, file$2, 277, 20, 10473);
    			add_location(tr, file$2, 271, 16, 10132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, b);
    			append_dev(b, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a);
    			mount_component(button0, a, null);
    			append_dev(td5, t10);
    			mount_component(button1, td5, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*weightStats*/ 512) && t0_value !== (t0_value = /*weightsStat*/ ctx[34].provinces + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*weightStats*/ 512) && t2_value !== (t2_value = /*weightsStat*/ ctx[34].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*weightStats*/ 512) && t4_value !== (t4_value = /*weightsStat*/ ctx[34].normal_weight + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*weightStats*/ 512) && t6_value !== (t6_value = /*weightsStat*/ ctx[34].overweight + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*weightStats*/ 512) && t8_value !== (t8_value = /*weightsStat*/ ctx[34].obesity + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*weightStats*/ 512 && a_href_value !== (a_href_value = "#/weights-stats/" + /*weightsStat*/ ctx[34].provinces + "/" + /*weightsStat*/ ctx[34].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(271:12) {#each weightStats as weightsStat}",
    		ctx
    	});

    	return block;
    }

    // (251:4) <Table bordered >
    function create_default_slot_7$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertWeight*/ ctx[11]);
    	let each_value = /*weightStats*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad autónoma";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Peso normal";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Sobrepeso";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Obesidad";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$2, 253, 12, 9126);
    			add_location(th1, file$2, 254, 12, 9167);
    			add_location(th2, file$2, 255, 12, 9193);
    			add_location(th3, file$2, 256, 12, 9227);
    			add_location(th4, file$2, 257, 12, 9259);
    			add_location(th5, file$2, 258, 12, 9290);
    			set_style(tr0, "background-color", "lightslategray");
    			add_location(tr0, file$2, 252, 10, 9065);
    			add_location(thead, file$2, 251, 8, 9046);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Comunidad autónoma");
    			add_location(input0, file$2, 263, 60, 9439);
    			set_style(td0, "background-color", "lightskyblue");
    			add_location(td0, file$2, 263, 16, 9395);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "2075");
    			add_location(input1, file$2, 264, 20, 9555);
    			add_location(td1, file$2, 264, 16, 9551);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "0000");
    			add_location(input2, file$2, 265, 20, 9654);
    			add_location(td2, file$2, 265, 16, 9650);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "0000");
    			add_location(input3, file$2, 266, 20, 9762);
    			add_location(td3, file$2, 266, 16, 9758);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "0000");
    			add_location(input4, file$2, 267, 20, 9867);
    			add_location(td4, file$2, 267, 16, 9863);
    			add_location(td5, file$2, 268, 16, 9965);
    			add_location(tr1, file$2, 262, 12, 9373);
    			add_location(tbody, file$2, 261, 8, 9352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newWeight*/ ctx[2].provinces);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newWeight*/ ctx[2].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newWeight*/ ctx[2].normal_weight);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newWeight*/ ctx[2].overweight);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newWeight*/ ctx[2].obesity);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[21]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newWeight*/ 4 && input0.value !== /*newWeight*/ ctx[2].provinces) {
    				set_input_value(input0, /*newWeight*/ ctx[2].provinces);
    			}

    			if (dirty[0] & /*newWeight*/ 4 && to_number(input1.value) !== /*newWeight*/ ctx[2].year) {
    				set_input_value(input1, /*newWeight*/ ctx[2].year);
    			}

    			if (dirty[0] & /*newWeight*/ 4 && to_number(input2.value) !== /*newWeight*/ ctx[2].normal_weight) {
    				set_input_value(input2, /*newWeight*/ ctx[2].normal_weight);
    			}

    			if (dirty[0] & /*newWeight*/ 4 && to_number(input3.value) !== /*newWeight*/ ctx[2].overweight) {
    				set_input_value(input3, /*newWeight*/ ctx[2].overweight);
    			}

    			if (dirty[0] & /*newWeight*/ 4 && to_number(input4.value) !== /*newWeight*/ ctx[2].obesity) {
    				set_input_value(input4, /*newWeight*/ ctx[2].obesity);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deleteWeights, weightStats*/ 4608) {
    				each_value = /*weightStats*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(251:4) <Table bordered >",
    		ctx
    	});

    	return block;
    }

    // (288:8) <Button color="primary" on:click="{getPreviewPage}">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(288:8) <Button color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (289:8) <Button color="primary" on:click="{getNextPage}">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(289:8) <Button color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (290:8) <Button color="warning" on:click="{getPreviewPage}">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar filtros de búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(290:8) <Button color=\\\"warning\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (295:4) <Table>
    function create_default_slot_3$2(ctx) {
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tr;
    	let td0;
    	let input0;
    	let t10;
    	let td1;
    	let input1;
    	let t11;
    	let td2;
    	let input2;
    	let t12;
    	let td3;
    	let input3;
    	let t13;
    	let td4;
    	let input4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			th0 = element("th");
    			th0.textContent = "Búsqueda por comunidad autónoma";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Búsqueda por año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Búsqueda por estadística de peso normal";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Búsqueda por estadística de sobrepeso";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Búsqueda por estadística de obesidad";
    			t9 = space();
    			tr = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t10 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t11 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t12 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t13 = space();
    			td4 = element("td");
    			input4 = element("input");
    			add_location(th0, file$2, 295, 8, 11272);
    			add_location(th1, file$2, 296, 8, 11322);
    			add_location(th2, file$2, 297, 8, 11357);
    			add_location(th3, file$2, 298, 8, 11415);
    			add_location(th4, file$2, 299, 8, 11471);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Comunidad autónoma");
    			add_location(input0, file$2, 301, 16, 11548);
    			add_location(td0, file$2, 301, 12, 11544);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "2075");
    			add_location(input1, file$2, 302, 16, 11650);
    			add_location(td1, file$2, 302, 12, 11646);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "0000");
    			add_location(input2, file$2, 303, 16, 11736);
    			add_location(td2, file$2, 303, 12, 11732);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "0000");
    			add_location(input3, file$2, 304, 16, 11830);
    			add_location(td3, file$2, 304, 12, 11826);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "0000");
    			add_location(input4, file$2, 305, 16, 11922);
    			add_location(td4, file$2, 305, 12, 11918);
    			add_location(tr, file$2, 300, 8, 11526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, th1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, th2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, th3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, th4, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*sProvince*/ ctx[4]);
    			append_dev(tr, t10);
    			append_dev(tr, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*sYear*/ ctx[5]);
    			append_dev(tr, t11);
    			append_dev(tr, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*sNormalWeight*/ ctx[6]);
    			append_dev(tr, t12);
    			append_dev(tr, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*sOverWeight*/ ctx[7]);
    			append_dev(tr, t13);
    			append_dev(tr, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*sObesity*/ ctx[8]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[23]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[24]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[25]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[26]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[27])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sProvince*/ 16 && input0.value !== /*sProvince*/ ctx[4]) {
    				set_input_value(input0, /*sProvince*/ ctx[4]);
    			}

    			if (dirty[0] & /*sYear*/ 32 && to_number(input1.value) !== /*sYear*/ ctx[5]) {
    				set_input_value(input1, /*sYear*/ ctx[5]);
    			}

    			if (dirty[0] & /*sNormalWeight*/ 64 && to_number(input2.value) !== /*sNormalWeight*/ ctx[6]) {
    				set_input_value(input2, /*sNormalWeight*/ ctx[6]);
    			}

    			if (dirty[0] & /*sOverWeight*/ 128 && to_number(input3.value) !== /*sOverWeight*/ ctx[7]) {
    				set_input_value(input3, /*sOverWeight*/ ctx[7]);
    			}

    			if (dirty[0] & /*sObesity*/ 256 && to_number(input4.value) !== /*sObesity*/ ctx[8]) {
    				set_input_value(input4, /*sObesity*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(th1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(th2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(th3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(th4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(295:4) <Table>",
    		ctx
    	});

    	return block;
    }

    // (311:8) <Button outline color="primary" on:click="{busqueda (sProvince, sYear, sNormalWeight, sOverWeight, sObesity)}">
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(311:8) <Button outline color=\\\"primary\\\" on:click=\\\"{busqueda (sProvince, sYear, sNormalWeight, sOverWeight, sObesity)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (314:4) <Button color="success" on:click="{loadInitialData}">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(314:4) <Button color=\\\"success\\\" on:click=\\\"{loadInitialData}\\\">",
    		ctx
    	});

    	return block;
    }

    // (318:4) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todos los datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(318:4) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (241:24)           Loading smokers data...      {:then weightStats}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading smokers data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(241:24)           Loading smokers data...      {:then weightStats}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*weightStats*/ ctx[9], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Tabla sobre el IMC por comunidades";
    			t1 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$2, 238, 4, 8706);
    			add_location(main, file$2, 237, 0, 8694);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*weightStats*/ 512 && promise !== (promise = /*weightStats*/ ctx[9]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TablaWeights", slots, []);
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 38;
    	let weightStats = [];

    	let newWeight = {
    		provinces: "",
    		year: "",
    		normal_weight: "",
    		overweight: "",
    		obesity: ""
    	};

    	let s_provinces = [];
    	let current_province = "-";
    	let checkMSG = "";
    	var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    	let sProvince = "";
    	let sYear = "";
    	let sNormalWeight = "";
    	let sOverWeight = "";
    	let sObesity = "";
    	onMount(getStats);

    	//Función GET para listar los recursos
    	async function getStats() {
    		console.log("Fetching Data...");
    		const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, weightStats = json);

    			s_provinces = json.map(d => {
    				return d.provinces;
    			});

    			s_provinces = Array.from(new Set(s_provinces));
    			console.log("Received " + weightStats.length + " weight Data.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Función LOADINITIALDATA para cargar los datos iniciales
    	async function loadInitialData() {
    		console.log("Fetching data...");
    		await fetch(BASE_WEIGHTS_PATH + "/loadInitialData");
    		const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, weightStats = json);
    			totaldata = 38;
    			console.log("Received " + weightStats.length + " weight data.");
    			$$invalidate(1, color = "success");
    			$$invalidate(3, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Función POST para añadir nuevos recursos  
    	async function insertWeight() {
    		console.log("Inserting data...");

    		if (newWeight.year == "" || newWeight.year == null || newWeight.provinces == "") {
    			alert("Los campos 'Comunidad Autónoma' y 'Año' no pueden estar vacios");
    		} else {
    			await fetch(BASE_WEIGHTS_PATH, {
    				method: "POST",
    				body: JSON.stringify(newWeight),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.status == 201) {
    					getStats();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(1, color = "success");
    					$$invalidate(3, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that province and year in the da tabase");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "Ya existe una entrada en la base de datos con la provincia y el año introducido");
    				}
    			});
    		}
    	}

    	//Función DELETE para eliminar un recurso específico
    	async function deleteWeights(province, year) {
    		await fetch(BASE_WEIGHTS_PATH + "/" + province + "/" + year, { method: "DELETE" }).then(function (res) {
    			$$invalidate(0, visible = true);
    			getStats();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(1, color = "success");
    				$$invalidate(3, checkMSG = "Recurso " + province + " " + year + " borrado correctamente");
    				console.log("Deleted " + province);
    			} else if (res.status == 404) {
    				$$invalidate(1, color = "danger");
    				$$invalidate(3, checkMSG = "No se ha encontrado el objeto " + province);
    				console.log("SUICIDE NOT FOUND");
    			} else {
    				$$invalidate(1, color = "danger");
    				$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    				console.log("ERROR!");
    			}
    		});
    	}

    	//Función DELETE para eliminar todos los recursos
    	async function deleteALL() {
    		console.log("Deleting all weights data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all weights data...");

    			await fetch(BASE_WEIGHTS_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(0, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getStats();
    					$$invalidate(1, color = "success");
    					$$invalidate(3, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(1, color = "danger");
    					$$invalidate(3, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//FUNCION DE BUSQUEDA COMPLETA
    	async function busqueda(sProvince, sYear, sNormalWeight, sOverWeight, sObesity) {
    		const res = await fetch(BASE_WEIGHTS_PATH + "?provinces=" + sProvince + "&year=" + sYear + "&normal_weight=" + sNormalWeight + "&overwight=" + sOverWeight + "obesity=" + sObesity);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(9, weightStats = json);
    			console.log("Found " + weightStats.length + " data");

    			if (weightStats.length == 1) {
    				$$invalidate(3, checkMSG = "Se ha encontrado un dato para tu búsqueda");
    			} else {
    				$$invalidate(3, checkMSG = "Se han encontrado " + weightStats.length + " datos para tu búsqueda");
    			}
    		}
    	}

    	////Función de paginación que consigue la página posterior
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 10 > totaldata) {
    			page = 1;
    		} else {
    			page += 10;
    		}

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=" + (-1 + page));
    		$$invalidate(1, color = "success");

    		$$invalidate(3, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, weightStats = json);
    			console.log("Received " + weightStats.length + " resources.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Función de paginación que consigue la página anterior
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 10 > 1) {
    			page -= 5;
    		} else page = 1;

    		$$invalidate(0, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_WEIGHTS_PATH + "?limit=10&offset=" + (-1 + page));
    		$$invalidate(1, color = "success");

    		$$invalidate(3, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 4));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(1, color = "danger");
    			$$invalidate(3, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, weightStats = json);
    			console.log("Received " + weightStats.length + " resources.");
    		} else {
    			$$invalidate(3, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<TablaWeights> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, visible = false);

    	function input0_input_handler() {
    		newWeight.provinces = this.value;
    		$$invalidate(2, newWeight);
    	}

    	function input1_input_handler() {
    		newWeight.year = to_number(this.value);
    		$$invalidate(2, newWeight);
    	}

    	function input2_input_handler() {
    		newWeight.normal_weight = to_number(this.value);
    		$$invalidate(2, newWeight);
    	}

    	function input3_input_handler() {
    		newWeight.overweight = to_number(this.value);
    		$$invalidate(2, newWeight);
    	}

    	function input4_input_handler() {
    		newWeight.obesity = to_number(this.value);
    		$$invalidate(2, newWeight);
    	}

    	function input0_input_handler_1() {
    		sProvince = this.value;
    		$$invalidate(4, sProvince);
    	}

    	function input1_input_handler_1() {
    		sYear = to_number(this.value);
    		$$invalidate(5, sYear);
    	}

    	function input2_input_handler_1() {
    		sNormalWeight = to_number(this.value);
    		$$invalidate(6, sNormalWeight);
    	}

    	function input3_input_handler_1() {
    		sOverWeight = to_number(this.value);
    		$$invalidate(7, sOverWeight);
    	}

    	function input4_input_handler_1() {
    		sObesity = to_number(this.value);
    		$$invalidate(8, sObesity);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Input,
    		FormGroup,
    		Alert,
    		visible,
    		color,
    		page,
    		totaldata,
    		weightStats,
    		newWeight,
    		s_provinces,
    		current_province,
    		checkMSG,
    		BASE_WEIGHTS_PATH,
    		sProvince,
    		sYear,
    		sNormalWeight,
    		sOverWeight,
    		sObesity,
    		getStats,
    		loadInitialData,
    		insertWeight,
    		deleteWeights,
    		deleteALL,
    		busqueda,
    		getNextPage,
    		getPreviewPage
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("page" in $$props) page = $$props.page;
    		if ("totaldata" in $$props) totaldata = $$props.totaldata;
    		if ("weightStats" in $$props) $$invalidate(9, weightStats = $$props.weightStats);
    		if ("newWeight" in $$props) $$invalidate(2, newWeight = $$props.newWeight);
    		if ("s_provinces" in $$props) s_provinces = $$props.s_provinces;
    		if ("current_province" in $$props) current_province = $$props.current_province;
    		if ("checkMSG" in $$props) $$invalidate(3, checkMSG = $$props.checkMSG);
    		if ("BASE_WEIGHTS_PATH" in $$props) BASE_WEIGHTS_PATH = $$props.BASE_WEIGHTS_PATH;
    		if ("sProvince" in $$props) $$invalidate(4, sProvince = $$props.sProvince);
    		if ("sYear" in $$props) $$invalidate(5, sYear = $$props.sYear);
    		if ("sNormalWeight" in $$props) $$invalidate(6, sNormalWeight = $$props.sNormalWeight);
    		if ("sOverWeight" in $$props) $$invalidate(7, sOverWeight = $$props.sOverWeight);
    		if ("sObesity" in $$props) $$invalidate(8, sObesity = $$props.sObesity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		color,
    		newWeight,
    		checkMSG,
    		sProvince,
    		sYear,
    		sNormalWeight,
    		sOverWeight,
    		sObesity,
    		weightStats,
    		loadInitialData,
    		insertWeight,
    		deleteWeights,
    		deleteALL,
    		busqueda,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1
    	];
    }

    class TablaWeights extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TablaWeights",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\weightsStats\EditWeight.svelte generated by Svelte v3.38.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\front\\weightsStats\\EditWeight.svelte";

    // (72:8) {#if checkMSG}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 4) set_data_dev(t, /*checkMSG*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(72:8) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (71:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[2] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(71:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (96:20) <Button outline color="primary" on:click={updateWeight}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(96:20) <Button outline color=\\\"primary\\\" on:click={updateWeight}>",
    		ctx
    	});

    	return block;
    }

    // (78:4) <Table bordered>
    function create_default_slot_1$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].provinces + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14_value = /*params*/ ctx[0].year + "";
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateWeight*/ ctx[8]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Comunidad autónoma";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Peso normal";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Sobrepeso";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Obesidad";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$1, 80, 16, 2717);
    			add_location(th1, file$1, 81, 16, 2762);
    			add_location(th2, file$1, 82, 16, 2792);
    			add_location(th3, file$1, 83, 16, 2830);
    			add_location(th4, file$1, 84, 16, 2866);
    			add_location(th5, file$1, 85, 16, 2901);
    			add_location(tr0, file$1, 79, 12, 2695);
    			add_location(thead, file$1, 78, 8, 2674);
    			add_location(td0, file$1, 90, 16, 3008);
    			add_location(td1, file$1, 91, 16, 3053);
    			add_location(input0, file$1, 92, 20, 3097);
    			add_location(td2, file$1, 92, 16, 3093);
    			add_location(input1, file$1, 93, 20, 3168);
    			add_location(td3, file$1, 93, 16, 3164);
    			add_location(input2, file$1, 94, 20, 3235);
    			add_location(td4, file$1, 94, 16, 3231);
    			add_location(td5, file$1, 95, 16, 3295);
    			add_location(tr1, file$1, 89, 12, 2986);
    			add_location(tbody, file$1, 88, 8, 2965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*uptadatedNormalWeight*/ ctx[4]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedOverweight*/ ctx[5]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedObesity*/ ctx[6]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].provinces + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*params*/ 1) && t14_value !== (t14_value = /*params*/ ctx[0].year + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*uptadatedNormalWeight*/ 16 && input0.value !== /*uptadatedNormalWeight*/ ctx[4]) {
    				set_input_value(input0, /*uptadatedNormalWeight*/ ctx[4]);
    			}

    			if (dirty & /*updatedOverweight*/ 32 && input1.value !== /*updatedOverweight*/ ctx[5]) {
    				set_input_value(input1, /*updatedOverweight*/ ctx[5]);
    			}

    			if (dirty & /*updatedObesity*/ 64 && input2.value !== /*updatedObesity*/ ctx[6]) {
    				set_input_value(input2, /*updatedObesity*/ ctx[6]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(78:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (101:4) {#if errorMsg}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[7]);
    			set_style(p, "color", "red");
    			add_location(p, file$1, 101, 8, 3462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 128) set_data_dev(t1, /*errorMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(101:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (104:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(104:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].provinces + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let table;
    	let t7;
    	let t8;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[9],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*errorMsg*/ ctx[7] && create_if_block(ctx);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Recurso ");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = text(" listo para editar");
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			if (if_block) if_block.c();
    			t8 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$1, 76, 4, 2575);
    			add_location(main, file$1, 68, 0, 2414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			mount_component(table, main, null);
    			append_dev(main, t7);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t8);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const alert_changes = {};
    			if (dirty & /*color*/ 8) alert_changes.color = /*color*/ ctx[3];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[9];

    			if (dirty & /*$$scope, checkMSG*/ 65540) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].provinces + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedObesity, updatedOverweight, uptadatedNormalWeight, params*/ 65649) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*errorMsg*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, t8);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(table);
    			if (if_block) if_block.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditWeight", slots, []);
    	var BASE_WEIGHTS_PATH = "/api/v2/table-weights-stats";
    	let visible = false;
    	let checkMSG = "";
    	let color = "danger";
    	let { params = {} } = $$props;
    	let weightsStats = {};
    	let uptadatedNormalWeight = null;
    	let updatedOverweight = null;
    	let updatedObesity = null;
    	let errorMsg = "";
    	onMount(getStat);

    	async function getStat() {
    		console.log("Fetching datas...");
    		const res = await fetch(BASE_WEIGHTS_PATH + "/" + params.provinces + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok");
    			await res.json();
    			$$invalidate(4, uptadatedNormalWeight = weightsStats.normal_weight);
    			$$invalidate(5, updatedOverweight = weightsStats.overweight);
    			$$invalidate(6, updatedObesity = weightsStats.obesity);
    			console.log("Recived data");
    		} else {
    			$$invalidate(7, errorMsg = res.status + " " + res.statusText);
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function updateWeight() {
    		console.log("Updating contact..." + JSON.stringify(params.provinces));

    		await fetch(BASE_WEIGHTS_PATH + "/" + params.provinces + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				provinces: params.provinces,
    				year: parseInt(params.year),
    				normal_weight: parseFloat(uptadatedNormalWeight),
    				overweight: parseFloat(updatedOverweight),
    				obesity: parseFloat(updatedObesity)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getStat();
    				console.log("Data introduced");
    				$$invalidate(3, color = "success");
    				$$invalidate(2, checkMSG = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(2, checkMSG = "Se ha producido un error y no se ha podido editar correctamente el recurso solicitado");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<EditWeight> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		uptadatedNormalWeight = this.value;
    		$$invalidate(4, uptadatedNormalWeight);
    	}

    	function input1_input_handler() {
    		updatedOverweight = this.value;
    		$$invalidate(5, updatedOverweight);
    	}

    	function input2_input_handler() {
    		updatedObesity = this.value;
    		$$invalidate(6, updatedObesity);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Alert,
    		BASE_WEIGHTS_PATH,
    		visible,
    		checkMSG,
    		color,
    		params,
    		weightsStats,
    		uptadatedNormalWeight,
    		updatedOverweight,
    		updatedObesity,
    		errorMsg,
    		getStat,
    		updateWeight
    	});

    	$$self.$inject_state = $$props => {
    		if ("BASE_WEIGHTS_PATH" in $$props) BASE_WEIGHTS_PATH = $$props.BASE_WEIGHTS_PATH;
    		if ("visible" in $$props) $$invalidate(1, visible = $$props.visible);
    		if ("checkMSG" in $$props) $$invalidate(2, checkMSG = $$props.checkMSG);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("weightsStats" in $$props) weightsStats = $$props.weightsStats;
    		if ("uptadatedNormalWeight" in $$props) $$invalidate(4, uptadatedNormalWeight = $$props.uptadatedNormalWeight);
    		if ("updatedOverweight" in $$props) $$invalidate(5, updatedOverweight = $$props.updatedOverweight);
    		if ("updatedObesity" in $$props) $$invalidate(6, updatedObesity = $$props.updatedObesity);
    		if ("errorMsg" in $$props) $$invalidate(7, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		checkMSG,
    		color,
    		uptadatedNormalWeight,
    		updatedOverweight,
    		updatedObesity,
    		errorMsg,
    		updateWeight,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditWeight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditWeight",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<EditWeight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditWeight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.38.1 */
    const file = "src\\front\\App.svelte";

    // (30:12) <NavbarBrand href="/">
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SOS2021-30");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(30:12) <NavbarBrand href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:16) <NavLink href="#/">
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Inicio");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(33:16) <NavLink href=\\\"#/\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:14) <NavItem  >
    function create_default_slot_12(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(32:14) <NavItem  >",
    		ctx
    	});

    	return block;
    }

    // (36:16) <NavLink href="#/info">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Información");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(36:16) <NavLink href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:14) <NavItem  >
    function create_default_slot_10(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(35:14) <NavItem  >",
    		ctx
    	});

    	return block;
    }

    // (39:16) <NavLink href="#/alcohol-stats">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tabla alcohol");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(39:16) <NavLink href=\\\"#/alcohol-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:14) <NavItem>
    function create_default_slot_8(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/alcohol-stats",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(38:14) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (42:16) <NavLink href="#/smokers-stats">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tabla fumadores");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(42:16) <NavLink href=\\\"#/smokers-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:14) <NavItem>
    function create_default_slot_6(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/smokers-stats",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(41:14) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (45:16) <NavLink href="#/life-stats">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tabla esperanza de vida");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(45:16) <NavLink href=\\\"#/life-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (44:14) <NavItem>
    function create_default_slot_4(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/life-stats",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(44:14) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (48:16) <NavLink href="#/weights-stats">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tabla IMC");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(48:16) <NavLink href=\\\"#/weights-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:14) <NavItem>
    function create_default_slot_2(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/weights-stats",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(47:14) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (31:12) <Nav navbar >
    function create_default_slot_1(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let navitem3;
    	let t3;
    	let navitem4;
    	let t4;
    	let navitem5;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem3 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem4 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem5 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			create_component(navitem3.$$.fragment);
    			t3 = space();
    			create_component(navitem4.$$.fragment);
    			t4 = space();
    			create_component(navitem5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(navitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(navitem5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    			const navitem3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem3_changes.$$scope = { dirty, ctx };
    			}

    			navitem3.$set(navitem3_changes);
    			const navitem4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem4_changes.$$scope = { dirty, ctx };
    			}

    			navitem4.$set(navitem4_changes);
    			const navitem5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navitem5_changes.$$scope = { dirty, ctx };
    			}

    			navitem5.$set(navitem5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(navitem3.$$.fragment, local);
    			transition_in(navitem4.$$.fragment, local);
    			transition_in(navitem5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(navitem3.$$.fragment, local);
    			transition_out(navitem4.$$.fragment, local);
    			transition_out(navitem5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navitem3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(navitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(navitem5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(31:12) <Nav navbar >",
    		ctx
    	});

    	return block;
    }

    // (29:8) <Navbar color="dark" dark expand = "md" >
    function create_default_slot(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "/",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbarbrand.$$.fragment);
    			t = space();
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbarbrand.$$.fragment, local);
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbarbrand.$$.fragment, local);
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbarbrand, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(29:8) <Navbar color=\\\"dark\\\" dark expand = \\\"md\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let body;
    	let navbar;
    	let t;
    	let router;
    	let current;

    	navbar = new Navbar({
    			props: {
    				color: "dark",
    				dark: true,
    				expand: "md",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			body = element("body");
    			create_component(navbar.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    			add_location(body, file, 27, 1, 836);
    			add_location(main, file, 26, 0, 827);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, body);
    			mount_component(navbar, body, null);
    			append_dev(main, t);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const routes = {
    		"/": Home,
    		"/info": Info,
    		"/alcohol-stats": TablaAlcohol,
    		"/life-stats": LifeExpectancy,
    		"/weights-stats": TablaWeights,
    		"/weights-stats/:provinces/:year": EditWeight,
    		"/smokers-stats": Smokers,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NotFound,
    		Home,
    		Info,
    		Router,
    		LifeExpectancy,
    		TablaAlcohol,
    		SmokerStats: Smokers,
    		FrontWeight: TablaWeights,
    		EditWeight,
    		Navbar,
    		NavbarBrand,
    		Nav,
    		NavItem,
    		NavLink,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
