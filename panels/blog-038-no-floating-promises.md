---
title: no floating promises
coordinates: 5 -9
date: 2025-10-07
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 4 -9 Prev
---

I'm taking another swing at
<a class="link" data-x="2" data-y="-7">artifacts</a> for its 6th season. This
time around, I'm coding it entirely in TypeScript. So naturally, I've run into
multiple async bugs from forgetting to `await` promises.

The
[no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/)
eslint check can _"Require Promise-like statements to be handled appropriately"_
and help mitigate this problem by alerting you in your editor.

This essentially requires us to use or explicitly
[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)
promises we don't `await`.

# Why isn't this enforced by default?

Back in 2017, kduffie filed microsoft/TypeScript
[issue 13376](https://github.com/microsoft/TypeScript/issues/13376) asking for
exactly this. See discussion there.

# What about deno lint?

Yeah, I recently moved over to using Deno as the JS runtime for my projects.
Deno has
[built-in linting and formatting](https://docs.deno.com/runtime/fundamentals/linting_and_formatting/),
but it doesn't natively support a no-floating-promises lint rule.

Specifically, Deno lint doesn't support **any** lint checks that require knowing
type information (deno_lint
[issue 1138](https://github.com/denoland/deno_lint/issues/1138)).

So we have to fallback to using eslint.

# Setting up eslint with Deno

This section has my notes on setting eslint up with [Deno](https://deno.com) (my
runtime environment) and [VS Code](https://code.visualstudio.com) (my editor).

There isn't clean interop with Deno and existing eslint rules (deno_lint
[issue 25](https://github.com/denoland/deno_lint/issues/25)). So we have to set
it up ourselves.

First, add a minimal `tsconfig.json` (if you don't have one already) and get rid
of the compilerOptions from your `deno.json` config, since eslint can't use
those. Something like:

```
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
  }
}
```

You can also include some of the
[Deno defaults](https://docs.deno.com/runtime/reference/ts_config_migration/#ts-compiler-options).

In this minimal config, we add a target library of `ES2023` so that when we run
eslint later, it knows that we can use the latest and greatest JS features.
Otherwise we might get errors for using anything added after ES5. See the
[tsconfig docs](https://www.typescriptlang.org/tsconfig/) for details.

Next, update your `deno.json` to include `"nodeModulesDir": "auto"` as
recommended in the
[Deno docs](https://docs.deno.com/runtime/fundamentals/linting_and_formatting/#eslint).

Then, add an `eslint.config.js` that provides the configuration for eslint
itself. Something like the following to get started:

```
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
          defaultProject: "tsconfig.json",
        },
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  }
);
```

As mentioned before, no-floating-promises uses type information, so we have to
set up our config to include that. See
[typed linting](https://typescript-eslint.io/getting-started/typed-linting) in
the typescript-eslint docs for details.

Finally, in VS Code, install the
[ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
and you should start seeing some errors!

Unfortunately, that will include a few no-unsafe-call and
no-unsafe-member-access errors because of our use of the Deno global. While it
would be ideal if we could just add `deno.ns` to the libraries in our compiler
options above, **it is not an accepted value there** (vscode_deno
[issue 326](https://github.com/denoland/vscode_deno/issues/326)). (╯°□°）╯︵ ┻━┻

To get around that, we can add a declaration file (typically suffixed with
`.d.ts`) to our codebase that provides the type information for stuff from the
core Deno library. For example:

```
declare namespace Deno {
  function readTextFile(path: string): Promise<string>;
  function writeTextFile(path: string, data: string): Promise<string>;
}
```

And there we go. Not an ideal last step, but voilà. We now have warnings in VS
Code for TS code served by the Deno runtime for floating promises. ┬─┬ノ(º_ºノ)
