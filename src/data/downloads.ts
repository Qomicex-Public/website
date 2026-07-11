export interface ArchConfig {
  label: string
  suffix: string
}

export interface PlatformDownload {
  id: string
  icon: string
  label: string
  archs: ArchConfig[]
}

export const PLATFORMS: PlatformDownload[] = [
  {
    id: 'windows',
    icon: 'fa6-brands:windows',
    label: 'Windows',
    archs: [
      { label: 'x64', suffix: 'x64-setup.msi' },
      { label: 'ARM64', suffix: 'arm64-setup.msi' },
    ],
  },
  {
    id: 'macos',
    icon: 'fa6-brands:apple',
    label: 'macOS',
    archs: [
      { label: 'Intel (x64)', suffix: 'x64.dmg' },
      { label: 'Apple Silicon (ARM64)', suffix: 'aarch64.dmg' },
    ],
  },
  {
    id: 'linux',
    icon: 'lucide:terminal',
    label: 'Linux',
    archs: [
      { label: 'x64', suffix: 'amd64.AppImage' },
      { label: 'ARM64', suffix: 'arm64.AppImage' },
    ],
  },
]
