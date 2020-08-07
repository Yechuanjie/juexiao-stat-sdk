const { cd, exec, echo, touch } = require('shelljs')
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const colors = require('colors')
const url = require('url')

let repoUrl
let pkg = JSON.parse(readFileSync('package.json') as any)

console.log(colors.red('运行prepare: 当前package version: ' + pkg.version))
pkg.version = '0.0.0-dev'
console.log(colors.red('运行prepare: 修改package version: ' + pkg.version))
writeFileSync(path.resolve(__dirname, '..', 'package.json'), JSON.stringify(pkg, null, 2))

if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

let parsedUrl = url.parse(repoUrl)
let repository = (parsedUrl.host || '') + (parsedUrl.path || '')
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!!')
cd('docs')
touch('.nojekyll')
exec('git init')
exec('git add .')
exec('git config user.name "hwq"')
exec('git config user.email "1102684711@qq.com"')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
