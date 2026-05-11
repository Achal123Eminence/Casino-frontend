# Frontend Developer Documentation

This folder provides shareable documentation for the Angular frontend.

## Documentation Stack

- Library: `@compodoc/compodoc`
- Output format: Static HTML docs
- Output directory: `frontend/docs/compodoc`

## Generate Docs

```bash
cd frontend
npm install
npm run docs:generate
```

Generated docs can be shared as:

- A zipped `docs/compodoc` folder
- Any static hosting (Nginx, S3, Vercel static, etc.)

## Preview Docs Locally

```bash
cd frontend
npm run docs:serve
```

## Export JSON Docs

```bash
cd frontend
npm run docs:json
```

This is useful if you want to feed documentation into custom portals or internal tooling.

## What developers will find in docs

- Components and their inputs/outputs
- Services and method signatures
- Routing map and module relationships
- Guards, interceptors, and shared utilities
- Dependency graph

## Recommended workflow

1. Update code and JSDoc comments.
2. Re-generate docs with `npm run docs:generate`.
3. Commit both source and docs updates when API/UI contracts change.

