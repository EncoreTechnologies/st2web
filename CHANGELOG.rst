Changelog
========================================================================

in development
--------------

Changed
~~~~~~~
* Changed how secrets are handled in the UI from type=password
  to using CSS webkit-text-security.

  Contributed by @fdrab

* Updated various dependencies (security). #1009, #1020

  Contributed by @enykeev

* Updated NodeJS to v20 current (security). #1010

  Contributed by @enykeev

* Add support for EL9. Removed support for bionic and el7. #1027
  Contributed by @amanda11

* Prepared the source for the Node 24 / Rsbuild toolchain (no behaviour change):

  - Removed Flow type annotations (``flow-remove-types``); the type-only
    ``modules/st2flow-model/interfaces.js`` is deleted.
  - Replaced legacy ``@connect`` class decorators with plain
    ``connect(...)(Component)`` calls (40 classes in 32 files).
  - Renamed CSS-module stylesheets (previously selected per package via
    browserify ``modularize`` and the ``.pcss`` extension) to ``*.module.css``.

  Contributed by @bishopbm1

* Moved the build to Node.js 24 LTS and replaced the toolchain:

  - gulp + browserify + babel + lerna/yarn replaced by Rsbuild 2 (``rsbuild.config.mjs``)
    and npm workspaces (``package-lock.json``). ``build/`` keeps its layout (``css/``,
    ``js/``, ``img/``, ``font/``, unbundled ``config.js``, ``package.meta(.js)``).
  - mocha replaced by Rstest with jsdom (``rstest.config.mjs``); tests import
    ``describe``/``it``/hooks from ``@rstest/core``. Bootstrap shims in
    ``@stackstorm/module-test-utils`` only fill in what jsdom lacks. Fixed tests that relied on
    globals or API state leaked from other test files (pack-icon made a real network request).
  - ESLint 6 + babel-eslint replaced by ESLint 9 flat config (``eslint.config.mjs``) with
    ``@stylistic`` for formatting rules. ESLint 10 is held back until ``eslint-plugin-react``
    supports it.
  - Every workspace now declares exactly the packages its source imports (internal packages
    as ``*``), and is ``private``. Removed transitive security pins that only existed for
    the old toolchain.
  - Node built-ins are no longer polyfilled: ``url``/``querystring`` replaced with
    ``URL``/``URLSearchParams``; ``react-time`` replaced by a ``moment``-based ``<time>``.
  - Removed ``tasks/``, ``gulpfile.js``, ``lerna.json``, ``bower.json``, ``Vagrantfile``,
    ``bootstrap.sh`` and the Flow/csscomb configs. Dockerfiles use ``node:24-alpine``.

  Contributed by @bishopbm1

* Upgraded to React 19 (19.3.1), react-redux 9, redux 5 and react-router 8:

  - ``createRoot`` replaces ``ReactDOM.render``; the automatic JSX runtime and fast refresh are on,
    so files no longer import ``React`` just for JSX.
  - ``propTypes`` and the ``prop-types`` package are removed (React 19 ignores them).
  - The panel's legacy ``scrollIntoView`` context is now ``ScrollIntoViewContext``
    (``React.createContext``), used by the action, pack, rule and trigger cards.
  - ``UNSAFE_componentWillReceiveProps`` replaced: ``getDerivedStateFromProps`` for the clone
    dialog's pack list, ``componentDidUpdate`` for auto-form text fields.
  - ``modules/st2-router`` keeps its Redux-driven design; a small hash history replaces the
    ``history`` package and route matching uses react-router 8's ``matchPath``.
  - The store uses redux's ``legacy_createStore``.
  - ``react-hotkeys`` 1.x (needs ``findDOMNode``, removed in React 19) replaced by
    ``react-hotkeys-hook`` for the workflow designer shortcuts; keys typed into inputs are still
    ignored. The per-task ``HotKeys`` wrapper is gone: its only handler had no key bound to it.
  - ``react-textarea-autosize`` 8 is used directly (no subclass).
  - Existing tests keep ``react-test-renderer`` 19 (deprecated; its warning is muted) with renders
    and handler calls wrapped in ``act()``. New tests use ``@testing-library/react``. Added tests
    for the router's hash history and route matching and for workflow transition clicks.
  - Coverage now includes untested JSX files, so it reports about 28% of lines, not 45%.

  Contributed by @bishopbm1

* Upgraded third-party dependencies with supply-chain guardrails:

  - New ``.npmrc``: ``min-release-age=14`` (npm only resolves versions published at least 14 days
    ago), ``ignore-scripts=true`` and ``allow-git=none``. The Dockerfiles copy it before ``npm ci``.
    All versions are pinned exactly and the lockfile was regenerated under these rules; every
    package has a verified registry signature, none has an install script, and none is a version
    from the 2026 axios or Shai-Hulud/ChainDrop (keyv, flat-cache, file-entry-cache) compromises.
  - Packages pinned in earlier steps that were still inside the cooldown were moved back to the
    newest release outside it (Rsbuild 2.2.13, Rstest 0.12.3, react-redux 9.3.0, react-router 8.4.0,
    postcss 8.5.30, postcss-nested 9.0.0, postcss-preset-env 11.6.1).
  - ``follow-redirects`` 1.16.2 and ``fast-uri`` 3.1.9 are security fixes newer than the cooldown;
    both were reviewed by hand and pinned through ``overrides`` with a dated exception in ``.npmrc``.
  - axios 0.24 → 1.20 (``st2-api``): list filters are joined before axios serializes the query
    instead of deep-importing ``axios/lib/helpers/buildURL``, and the request id is read from
    ``x-request-id``.
  - moxios (unmaintained) → axios-mock-adapter in tests.
  - noty (deprecated) and escape-html → a small built-in toast in ``st2-notification`` with the same
    look and behaviour. Text is set as text rather than escaped HTML; the timer pauses on hover.
  - brace (Ace 1.2.9, abandoned) → ace-builds 1.45 in the workflow editor.
  - ajv 6 → 8 in ``st2flow-model`` (non-strict, no regex ``u`` flag, to accept the generated
    orquesta/mistral schemas); error marks use Ajv 8's ``instancePath``. Messages now read "must"
    instead of "should".
  - deep-diff (deprecated) → ``lodash.isEqual``; the model's ``change`` event now passes only the
    YAML, since no listener used the deltas.
  - chai-subset dropped: chai 6 has ``containSubset`` built in.
  - lodash 4.18.1, moment 2.31.0, eventemitter3 5, validator 13.15.35, prismjs 1.30.0,
    classnames 2.5.1, debug 4.4.3.
  - Added tests for the notifier, schema-error formatting and API query serialization.
  - Production dependencies have no ``npm audit`` findings. The remaining dev-only finding is
    minimatch (ReDoS) inside ESLint 9, fixed only in minimatch 11, which no ESLint release uses yet.

  Contributed by @bishopbm1

Fixed
~~~~~
* Fixed the UI failing to load ("process is not defined") without browserify's ``process``
  polyfill: ``st2-api`` now only sets ``NODE_TLS_REJECT_UNAUTHORIZED`` under Node, and
  ``st2flow-perf``'s Node check no longer reads ``process`` when it is undefined.
* Removed a workflow-transition click listener that never ran (it registered
  ``() => this.props.onClick``); clicks were already handled through React's ``onClick``.
* Moved the task badge ``composes`` in ``st2flow-canvas`` to top-level classes, which CSS modules
  require when nesting isn't flattened first.

  Contributed by @bishopbm1

* Fixed CircleCI tests by pinning lerna@6.0.0. #1008

  Contributed by @guzzijones


st2 v3.8.0
------

Added
~~~~~
* Added feature for disabling button for synchronous responses. Button gets disabled onClick on `Connect` and `Submit` in st2-login and st2-history module respectively.

  Contributed by @ParthS007

* Added new Hotkey Shortcuts for Workflow Designer: Save (ctrl/cmd + s), Open (ctrl/cmd + o),
  Undo/Redo (ctrl/cmd + z, shift + z), Copy/Cut/Paste (ctrl/cmd + c/x/v). #963, #991

  Contributed by @Jappzy and @cded from @Bitovi

* Added the search rule criteria in the UI with the possibility of multiple patterns. #992, #964, #492

  Contributed by @Jappzy and @cded from @Bitovi

* Added an optional auto-save capability in the workflow composer. #965, #993

  Contributed by @Jappzy and @cded from @Bitovi

Changed
~~~~~~~
* Updated nodejs from `14.16.1` to `14.20.1`, fixing the local build under ARM processor architecture. #880
    
  Reported by @cded from @Bitovi

Fixed
~~~~~
* Fixed CircleCI tests

  Contributed by @amanda11

* Handle cases where content-type is not only application/json

  Contributed by @luislobo

* Escaped text in notifications. #990

  Contributed by @cded from @Bitovi
