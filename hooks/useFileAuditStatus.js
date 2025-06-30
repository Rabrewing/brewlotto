// ✅ src/hooks/useFileAuditStatus.js
import audit from '@/audit/CODE_PRUNE_AUDIT.json';

export function useFileAuditStatus(fileName) {
    if (!fileName) return 'unknown';
    const { deprecated_modules, active_modules } = audit;

    const isDeprecated = deprecated_modules.some(mod => mod.file === fileName);
    const isActive = active_modules.includes(fileName);

    if (isDeprecated) return 'deprecated';
    if (isActive) return 'active';
    return 'missing';
}
