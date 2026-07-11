export interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export async function fetchContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch('https://api.github.com/repos/Qomicex-Public/Qomicex.Tauri/contributors', {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Qomicex-Website' },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}
