import { execSync } from 'child_process'

export const getAllProjects = () => {
  try {
    const projectsNDJSON = execSync('yarn workspaces list --json').toString()
    const projects = projectsNDJSON
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))

    return projects
  } catch (_e) {
    return []
  }
}
