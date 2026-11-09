# IDv1

An ID system for short, memorable IDs that are easy to keep unique.

```sh
npm install @0001-labs/idv1
```

```ts
import { codeCandidate, codeKind } from '@0001-labs/idv1'

const candidate = codeCandidate('item')
codeKind(candidate) // 'item'
```

Use a unique constraint or a transaction to claim the candidate in your app.

[Documentation](https://idv1.0001.dev/) · [MIT license](LICENSE)
