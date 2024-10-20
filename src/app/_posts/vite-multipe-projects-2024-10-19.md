# Vite 配置多项目

最近在重构一个项目，这个项目是两个小项目组成，之前是用Angular实现的，最近在用Vue做重构。在用Vite配置多项目时，网上有一些插件，比如 **vite-plugin-html**，用了一下，发现存在一个小问题，打包后文件的目录结构有点问题，直接用 **vite preview** 打开后显示空白。查了一下原因，是目录结构有问题，项目的 **index.html** 没有放在 **dist** 的根目录下。随后我查了一下文档，自己更新了一下 **vite.config.ts**，去掉了插件，自己做了一下实现，后面也可以做成一下简单的插件。

## 项目目录结构

```
package.json
vite.config.ts
public/
src/
  assets/
  components/  存放公用插件
  projectA/    项目A
    index.html
    main.ts
    App.vue
  projectB/    项目B
    index.html
    main.ts
    App.vue
```

## vite.config.ts 配置

```js
  // vite.config.ts
  import { defineConfig } from 'vite'
  import path from 'path';
  import vue from '@vitejs/plugin-vue'

  const Projects = ['projectA', 'projectB'] as const
  type Project = typeof Projects[number]

  let projectName = 'projectA'

  if (process.env.PROJECT_NAME) {
    const project = process.env.PROJECT_NAME as Project
    if (!Projects.includes(project)) {
      throw new Error(`Project ${project} doesn't exist`)
    }
    projectName = project
  }

  const input = path.resolve(__dirname, `src/${projectName}/index.html`)

  let root = `src/${projectName}`;
  const command = process.argv[2];
  switch(command) {
    case 'build':
      break;
    case 'preview':
      root = './';
      break;
    default:
      break;
  }

  // https://vitejs.dev/config/
  export default defineConfig({
    base: './',
    root,
    publicDir: 'public',
    plugins: [
      vue(),
    ],
    build: {
      rollupOptions: {
        input,
        output: {
          dir: `dist-${projectName}`
        }
      },
    }
  })
```

## package.json 配置

```js
// package.json
{
  "name": "multiple-projects",
  "scripts": {
    "start": "cross-env PROJECT_NAME=projectA vite",
    "start-projectB":  "cross-env PROJECT_NAME=projectB vite",
    "build-projectA": "vue-tsc -b && cross-env PROJECT_NAME=lagrange vite build",
    "build-projectB": "vue-tsc -b && cross-env PROJECT_NAME=projectB vite build",
    "build": "npm run build-projectA && npm run build-projectB",
    "preview-projectA": "vite preview --outDir=dist-projectA",
    "preview-projectB": "vite preview --outDir=dist-projectB"
  }
  ...
}
```

## 打包后的目录结构

```
dist-projectA/
  assets/
  index.html
dist-projectB/
  assets/
  index.html
```

预览的话，直接命令行运行 **npm run preview-projectA** / **npm run preview-projectB**






