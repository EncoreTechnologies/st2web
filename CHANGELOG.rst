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

Fixed
~~~~~
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
