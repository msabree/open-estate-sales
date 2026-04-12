# Contributing to Open Estate Sales

Thanks for helping build a fair, open option for estate sale listings. This document explains how we work together.

## Code of conduct

Everyone participating is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report concerns to **conduct@openestatesales.com**.

## Ways to contribute

- **Bug reports** — reproducible steps and environment details help a lot.
- **Feature ideas** — describe the user problem, not only a specific solution.
- **Pull requests** — fixes, docs, and features that match the project goals.
- **Feedback** on [openestatesales.com](https://openestatesales.com) — what works, what does not.

## Before you open a PR

1. **Search** existing issues and PRs so we do not duplicate effort.
2. **Discuss** larger changes in an issue first when the approach is not obvious.
3. **Keep changes focused** — one logical change per PR is easier to review.

## Development workflow

1. Fork the repository and create a branch from `main` (or the default branch):

   ```bash
   git checkout -b short-description-of-change
   ```

2. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

3. Before opening a PR:

   ```bash
   npm run lint
   ```

4. Push your branch and open a pull request against the default branch. Use the PR template and link related issues.

## Code standards

- **TypeScript** — prefer explicit types where they clarify intent; follow existing patterns in the repo.
- **Style** — match surrounding code (naming, formatting, file structure). Do not reformat unrelated files.
- **Linting** — `npm run lint` should pass; fix new warnings you introduce.
- **Comments** — use them for non-obvious rationale, not for restating the code.
- **Dependencies** — new packages need a clear justification (security, maintenance, bundle size).

This repo uses **Next.js** with conventions that may differ from older tutorials; when in doubt, check `node_modules/next/dist/docs/` in this project for current APIs.

## Licensing

By contributing, you agree that your contributions are licensed under the same terms as the project: **AGPL-3.0**. See [LICENSE](LICENSE).

## Questions

If something in this guide is unclear, open an issue and we can improve it.
