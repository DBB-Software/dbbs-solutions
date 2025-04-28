export const oldPrefix = '@dbbs/'

export const SOLUTIONS_RAW_BASE_URL = 'https://raw.githubusercontent.com/DBB-Software/dbbs-solutions'

export const API_REPO_URL = 'https://api.github.com/repos/DBB-Software/dbbs-solutions/contents'

export const PUBLIC_GITHUB_TOKEN = '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'

export const DEFAULT_PACKAGES = ['eslint-config', 'tsconfig']

export const TURBO_GENERATORS_BASE_URL = `turbo/generators`

export enum SupportedLanguage {
  py = 'python',
  ts = 'typescript'
}

export enum DependencyFile {
  PackageJson = 'package.json',
  PyProjectToml = 'pyproject.toml'
}

export const DEPENDENCY_LANGUAGE = {
  [DependencyFile.PackageJson]: SupportedLanguage.ts,
  [DependencyFile.PyProjectToml]: SupportedLanguage.py
}
