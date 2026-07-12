export interface PlatformInfo {
  os: string
  arch: string
  minVersion: string
  status: string
  packageType: string
  note?: string
}

export const platforms: PlatformInfo[] = [
  { os: 'Windows', arch: 'x64, ARM64', minVersion: 'Windows 10 1809+', status: '稳定', packageType: '.exe' },
  { os: 'macOS', arch: 'x64, ARM64', minVersion: 'macOS 10.15+', status: '稳定', packageType: '.dmg' },
  { os: 'Linux', arch: 'x64, ARM64', minVersion: 'glibc 2.28+', status: '稳定', packageType: 'AppImage', note: 'LoongArch64, RISC-V 64 实验性' },
]
