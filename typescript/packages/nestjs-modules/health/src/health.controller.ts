import { Controller, Get } from '@nestjs/common'
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus'

/**
 * Controller that handles health check endpoints to monitor application health.
 */
@Controller('health')
export class HealthController {
  /**
   * Initializes a new instance of the HealthController class.
   * @param health The health check service used for checking the status of the application.
   * @param memory The memory health indicator that checks the heap memory usage.
   * @param disk The disk health indicator that checks the disk storage space.
   */
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  /**
   * Endpoint to perform health checks on memory heap and disk storage.
   * This check ensures that both memory and disk space are within acceptable limits.
   * @returns A Promise resolving to the health check status results.
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memoryHeap', 150 * 1024 * 1024), // 150 MB threshold
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.95 }) // 95% usage threshold
    ])
  }
}
