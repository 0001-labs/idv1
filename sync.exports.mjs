export default {
  exports: {
    ids: { owned: true, files: ({ tree }) => tree('src', { skip: /\.test\.ts$/ }) },
    advanced: {
      owned: true,
      files: ({ read }) => ({ 'advanced.ts': read('src/advanced.ts'), 'shapes.ts': read('src/shapes.ts'), 'words.ts': read('src/words.ts') }),
    },
  },
}
