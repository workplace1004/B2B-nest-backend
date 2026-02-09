import { Injectable } from '@nestjs/common';

interface SyncLog {
  id: number;
  syncType: string;
  status: 'success' | 'failed' | 'in-progress' | 'pending';
  mappingId?: number;
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

@Injectable()
export class SyncLogsService {
  private syncLogs: SyncLog[] = [];
  private nextId = 1;

  findAll(status?: string) {
    let logs = this.syncLogs;
    
    if (status && status !== 'all') {
      logs = logs.filter((log) => log.status === status);
    }

    // Sort by startedAt (newest first)
    logs = logs.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return {
      data: logs.map((log) => this.mapSyncLog(log)),
    };
  }

  startSync() {
    const syncLog: SyncLog = {
      id: this.nextId++,
      syncType: 'full',
      status: 'in-progress',
      recordsProcessed: 0,
      recordsFailed: 0,
      startedAt: new Date().toISOString(),
    };

    this.syncLogs.push(syncLog);

    // Simulate async completion after a delay
    setTimeout(() => {
      const index = this.syncLogs.findIndex((log) => log.id === syncLog.id);
      if (index !== -1) {
        this.syncLogs[index] = {
          ...syncLog,
          status: 'success',
          recordsProcessed: Math.floor(Math.random() * 1000) + 100,
          recordsFailed: Math.floor(Math.random() * 10),
          completedAt: new Date().toISOString(),
        };
      }
    }, 2000);

    return { data: this.mapSyncLog(syncLog) };
  }

  private mapSyncLog(log: SyncLog) {
    return {
      id: log.id,
      syncType: log.syncType,
      status: log.status,
      mappingId: log.mappingId,
      recordsProcessed: log.recordsProcessed,
      recordsFailed: log.recordsFailed,
      startedAt: log.startedAt,
      completedAt: log.completedAt,
      errorMessage: log.errorMessage,
    };
  }
}

